package studybuddy.api.user;

import ch.qos.logback.core.joran.sanity.Pair;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import studybuddy.api.course.Course;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    /**
     * findByNameStartingWith
     * This functions uses findByNameStartingWith in JPA
     *    Repository to query for the user that starts with the given string.
     *
     * @param startOfName
     *
     * @return a List of Users that matches
     *        empty List if no matches
     */
    public List<Pair<String, String>> findByNameStartingWith(String startOfName){return userRepository.findByNameStartingWith(startOfName);}
    /**
     * findUser
     *
     * This function uses findById in JPA Repository to query for
     * the user with a matching id.
     *
     * @param userId
     *
     * @return a User that matches
     *         NULL if no match
     */
    public Optional<User> findUser(Long userId) {
        return userRepository.findById(userId);
    }

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
    public Optional<User> findByUsernamePassword(String username, String password) {
        return userRepository.findByUsernamePassword(username, password);
    }

    /**
     * findByUsername
     *
     * This function queries if any accounts have the same username
     *
     * @param username
     *
     * @return user if user with username exists, NULL if not
     * */
    public Optional<User> findByUsername(String username) {
    return userRepository.findByUsername(username);
    }

    /**
     * findByEmail
     *
     * This function queries if any accounts have the same email
     *
     * @param email_address
     *
     * @return user if user with email exists, NULL if not
     * */
    public Optional<User> findByEmail(String email_address) {
        return userRepository.findByEmail(email_address);
    }

    /**
     * findUserType
     *
     * This function queries for all the user_type with the given username.
     * This function must always return a String, so only use this when you
     * KOW THE USER EXISTS.
     *
     * @param username
     *
     * @return String of user_type
     *         (of matching user)
     */
    public String findUserType(String username) {
        return userRepository.findUserType(username);
    }

    /**
     * findUser
     *
     * This function uses save in JPA Repository to save a User
     * to the "users" table.
     *
     * @param user
     *
     * @return a reference to the new User in "users"
     */
    public User saveUser(User user) {
        return userRepository.save(user);
    }

    /**
     *
     * @param c
     * @return
     */
    public List<User> getUsersByCourse(Course c) {return userRepository.findByCoursesCourseId(c.getCourseId());}

    /**
     *
     * @param c
     * @param u
     */
    public void deleteCourseFromUser(Course c, User u){
        userRepository.deleteCourseByCourseId(c.getCourseId(), u.id);
    }
}