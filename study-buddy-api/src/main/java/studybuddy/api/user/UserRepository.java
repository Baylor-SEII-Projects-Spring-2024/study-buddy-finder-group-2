package studybuddy.api.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

     /**
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

}