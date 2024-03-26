package studybuddy.api.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    /**
     * findByNameOrUsername
     *
     * This function queries for all the users information with the given
     * part of the name or username
     *
     * @param partialName
     *
     * @return List of Users that contain the partialName in their
     *         username, first name, or last name
     *         empty List if no matches
     */
    @Query(value = "SELECT * FROM users u WHERE u.firstName LIKE %?1% OR u.lastName LIKE %?1% OR u.username LIKE %?1%", nativeQuery = true)
    public List<User> findByNameOrUsername(String partialName);

    /**
     * findByNameOrUsernameAndUserType
     *
     * This function queries for all the users information with the given
     * part of the name or username and the user type
     *
     * @param partialName
     * @param type
     *
     * @return List of Users that contain the partialName in their
     *      *  username, first name, or last name and natches the user type
     *      *  empty List if no matches
     */
    @Query(value = "SELECT * FROM users u WHERE u.user_type = ?2 AND u.user_id IN(SELECT b.user_id FROM users b WHERE b.firstName LIKE %?1% OR b.lastName LIKE %?1% OR b.username LIKE %?1%)", nativeQuery = true)
    public List<User> findByNameOrUsernameAndUserType(String partialName, String type);

    /**
     * findByUsernamePassword
     *
     * This function queries for all the user information with the given
     * username and password.
     *
     * @param username
     * @param password
     *
     * @return a User that matches
     *         NULL if no matches
     */
    @Query(value = "SELECT * FROM users u WHERE u.username = ?1 AND u.password = ?2", nativeQuery = true)
    public Optional<User> findByUsernamePassword(String username, String password);

    /**
     * findByUsername
     *
     * This function queries if any accounts have the same username
     *
     * @param username
     *
     * @return user if user with username exists,
     *         NULL if not
     */
    @Query(value = "SELECT * FROM users u WHERE u.username = ?1", nativeQuery = true)
    public Optional<User> findByUsername(String username);

    /**
     * findByEmail
     *
     * This function queries if any accounts have the same email
     *
     * @param email_address
     *
     * @return user if user with email exists,
     *         NULL if not
     */
    @Query(value = "SELECT * FROM users u WHERE u.email_address = ?1", nativeQuery = true)
    public Optional<User> findByEmail(String email_address);


    /**
     * findUserType
     *
     * This function queries for all the user_type with the given username.
     * This function must always return a String, so only use this when you
     * KNOW THE USER EXISTS.
     *
     * @param username
     *
     * @return String of user_type
     *         (of matching user)
     */
    @Query(value = "SELECT user_type FROM users u WHERE u.username = ?1", nativeQuery = true)
    public String findUserType(String username);

    /**
     *
     * @param courseId
     * @return User
     */
    public List<User> findByCoursesCourseId(long courseId);

    /**
     * findByUsernameExists
     *
     * This function queries if any accounts have the same username
     *
     * @param username
     *
     * @return user if user with username exists,
     *         NULL if not
     */
    @Query(value = "SELECT * FROM users u WHERE u.username = ?1", nativeQuery = true)
    public User findByUsernameExists(String username);

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM users_courses uc WHERE uc.course_id = ?1 AND uc.username = ?2", nativeQuery = true)
    public void deleteCourseByCourseId(long courseid, long userid);


    @Query(value = "SELECT DISTINCT u.* FROM users u " +
            "INNER JOIN users_courses uc ON u.user_id = uc.username " + // Adjusted join condition
            "WHERE uc.course_id IN (" +
            "    SELECT uc2.course_id FROM users_courses uc2 WHERE uc2.username = ?1" +
            ") " +
            "AND NOT EXISTS (" +
            "    SELECT 1 FROM connection conn " +
            "    WHERE (conn.requester = (SELECT username FROM users WHERE user_id = ?1) AND conn.requested = u.username AND conn.is_connected = true) " +
            "       OR (conn.requester = u.username AND conn.requested = (SELECT username FROM users WHERE user_id = ?1) AND conn.is_connected = true)" +
            ") " +
            "AND u.user_id != ?1",
            nativeQuery = true)
    public List<User> recommendUsersFromSameCourse(long userId);

    @Query(value = "SELECT DISTINCT u.* FROM users u " +
            "JOIN users_courses uc ON u.user_Id = uc.username " +
            "JOIN courses c ON uc.course_id = c.course_id " +
            "WHERE c.course_prefix = (" +
            "    SELECT c2.course_prefix FROM users_courses uc2 " +
            "    JOIN courses c2 ON uc2.course_id = c2.course_id " +
            "    WHERE uc2.username = (SELECT username FROM users WHERE user_id = ?1)" +
            ") " +
            "AND NOT EXISTS (" +
            "    SELECT 1 FROM connection conn " +
            "    WHERE (conn.requester = (SELECT username FROM users WHERE user_id = ?1) AND conn.requested = u.username AND conn.is_connected = true) " +
            "       OR (conn.requester = u.username AND conn.requested = (SELECT username FROM users WHERE user_id = ?1) AND conn.is_connected = true)" +
            ") " +
            "AND u.user_id != ?1 " +
            "LIMIT 5",
            nativeQuery = true)
    List<User> recommendUsersFromSameCoursePrefix(long userId);

    @Query(value = "SELECT DISTINCT u.* FROM users u " +
            "WHERE u.user_id != ?1 " +
            "AND NOT EXISTS (" +
            "    SELECT 1 FROM connection c " +
            "    INNER JOIN users u2 ON u2.username = c.requester OR u2.username = c.requested " +
            "    WHERE (u2.user_id = ?1 AND ((c.requester = u.username AND c.is_connected = true) " +
            "    OR (c.requested = u.username AND c.is_connected = true)))" +
            ") " +
            "ORDER BY RAND() " +
            "LIMIT 5",
            nativeQuery = true)
    List<User> recommendRandomUsers(long userId);

}
