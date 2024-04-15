package studybuddy.api.user;

import ch.qos.logback.core.joran.sanity.Pair;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import studybuddy.api.connection.Connection;
import studybuddy.api.connection.ConnectionRepository;
import studybuddy.api.course.Course;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class UserService {


    @Autowired
    private ConnectionRepository connectionRepository;

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
     * findByNameStartingWith
     * This functions uses findByNameStartingWith in JPA
     *    Repository to query for the user that starts with the given string.
     *
     * @param startOfName
     *
     * @return a List of Users that matches
     *        empty List if no matches
     */
    public List<User> findByNameStartingWith(String startOfName){return userRepository.findByNameStartingWith(startOfName);}
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
        Optional<User> optionalUser = userRepository.findById(userId);
        if (!optionalUser.isPresent()) {
            return Collections.emptyList();
        }

        User currentUser = optionalUser.get();
        Set<String> directConnections = getDirectConnections(currentUser.getUsername());
        Set<String> secondDegreeConnections = getSecondDegreeConnections(directConnections);

        List<User> allUsers = userRepository.findAll().stream()
                .filter(user -> !user.getId().equals(currentUser.getId()) && !directConnections.contains(user.getUsername()))
                .collect(Collectors.toList());

        Map<User, Integer> userScores = new HashMap<>();
        for (User user : allUsers) {
            int score = calculateRelevanceScore(currentUser, user, secondDegreeConnections);
            userScores.put(user, score);
        }

        List<User> recommendedUsers = userScores.entrySet().stream()
                .sorted(Map.Entry.<User, Integer>comparingByValue(Comparator.reverseOrder()))
                .map(Map.Entry::getKey)
                .limit(5)
                .collect(Collectors.toList());

        return recommendedUsers;
    }

    private Set<String> getDirectConnections(String username) {
        List<Connection> connections = connectionRepository.getConnections(username);
        return connections.stream()
                .map(conn -> conn.getRequester().equals(username) ? conn.getRequested() : conn.getRequester())
                .collect(Collectors.toSet());
    }

    private Set<String> getSecondDegreeConnections(Set<String> directConnections) {
        Set<String> secondDegreeConnections = new HashSet<>();
        for (String friend : directConnections) {
            List<Connection> friendConnections = connectionRepository.getConnections(friend);
            friendConnections.stream()
                    .map(conn -> conn.getRequester().equals(friend) ? conn.getRequested() : conn.getRequester())
                    .filter(connUsername -> !directConnections.contains(connUsername))
                    .forEach(secondDegreeConnections::add);
        }
        return secondDegreeConnections;
    }

    private int calculateRelevanceScore(User currentUser, User potentialFriend, Set<String> secondDegreeConnections) {
        int score = 0;

        Set<Course> sharedCourses = new HashSet<>(currentUser.getCourses());
        sharedCourses.retainAll(potentialFriend.getCourses());
        score += sharedCourses.size() * 2;

        Set<String> currentUserPrefixes = currentUser.getCourses().stream()
                .map(Course::getCoursePrefix)
                .collect(Collectors.toSet());
        Set<String> otherUserPrefixes = potentialFriend.getCourses().stream()
                .map(Course::getCoursePrefix)
                .collect(Collectors.toSet());
        currentUserPrefixes.retainAll(otherUserPrefixes);
        score += currentUserPrefixes.size();


        if (secondDegreeConnections.contains(potentialFriend.getUsername())) {
            score += 10;
        }

        return score;
    }
}