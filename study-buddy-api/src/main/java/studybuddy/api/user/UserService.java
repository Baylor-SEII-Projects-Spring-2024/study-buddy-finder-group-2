package studybuddy.api.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import studybuddy.api.course.Course;

import java.util.*;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
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
    public List<User> findByNameOrUsername(String partialName){
        return userRepository.findByNameOrUsername(partialName);
    }

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
    public List<User> findByNameOrUsernameAndUserType(String partialName, String type){
        return userRepository.findByNameOrUsernameAndUserType(partialName, type);
    }

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

    public User findByUsernameExists(String username) {
        return userRepository.findByUsernameExists(username);
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


    public List<User> recommendUsersForUser(long userId) {
        Set<User> uniqueRecommendations = new HashSet<>();

        // try to get users from the same course
        uniqueRecommendations.addAll(userRepository.recommendUsersFromSameCourse(userId));
        if (uniqueRecommendations.size() >= 5) {
            return new ArrayList<>(uniqueRecommendations).subList(0, 5);
        }

        // print what we have so far
        System.out.println("Recommendations so far: ");
        for (User user : uniqueRecommendations) {
            System.out.println(user.getUsername());
        }

        // try to get users with the same course prefix
        uniqueRecommendations.addAll(userRepository.recommendUsersFromSameCoursePrefix(userId));

        // print what we have so far
        System.out.println("Recommendations so far: ");
        for (User user : uniqueRecommendations) {
            System.out.println(user.getUsername());
        }

        // if we still don't have enough, get random users
        if (uniqueRecommendations.size() < 5) {
            List<User> randomUsers = userRepository.recommendRandomUsers(userId);
            for (User user : randomUsers) {
                if (uniqueRecommendations.size() >= 5) {
                    break; // stop if we have enough
                }
                uniqueRecommendations.add(user);
            }
        }

        // create a list from the set
        List<User> recommendations = new ArrayList<>(uniqueRecommendations);
        return recommendations.size() > 5 ? recommendations.subList(0, 5) : recommendations;
    }
}