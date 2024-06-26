package studybuddy.api.endpoint;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import studybuddy.api.connection.Connection;
import studybuddy.api.connection.ConnectionService;
import studybuddy.api.notifications.Notification;
import studybuddy.api.notifications.NotificationService;
import studybuddy.api.user.User;
import studybuddy.api.user.UserService;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;


@Log4j2
@RestController
//@CrossOrigin(origins = "http://localhost:3000") // for local testing
@CrossOrigin(origins = "http://34.16.169.60:3000")
public class SearchUserEndpoint {

    @Autowired
    private UserService userService;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private ConnectionService connectionService;

    @RequestMapping(
            value = "/api/searchUsers/{username}",
            method = RequestMethod.POST
    )
    public ResponseEntity<List<User>> searchResults(@PathVariable String username, @RequestBody User userSearch) {
        List<User> users = new ArrayList<>();
        System.out.println("Searching for "+userSearch.getUsername());

        if(userSearch.getUserType().equals("all")) {
            users = userService.findByNameOrUsername(userSearch.getUsername());
        }
        else {
            users = userService.findByNameOrUsernameAndUserType(userSearch.getUsername(), userSearch.getUserType());
        }

        // remove the current user from search results
        users.removeIf(u -> u.getUsername().equals(username));

        //TODO: Courses logic

        if(userSearch.getCourses() != null && userSearch.getCourses().stream().findFirst().isPresent()) {
            List<User> usersWithCourses = userService.getUsersByCourse(userSearch.getCourses().stream().findFirst().get());
            users.removeIf(u -> !usersWithCourses.contains(u));
            System.out.println("WOO");
        }
        return ResponseEntity.ok(users);
    }

    @RequestMapping(
            value = "/api/searchUsers/getConnection/{username}",
            method = RequestMethod.POST
    )
    public ResponseEntity<Connection> getConnection(@PathVariable String username, @RequestBody String requested) {
        return ResponseEntity.ok(connectionService.getConnection(username, requested));
    }

    @DeleteMapping("/api/searchUsers/deleteConnection/{id}")
    public void deleteConnection(@PathVariable Long id) {
        connectionService.delete(id);
    }

    @RequestMapping(
            value = "/api/searchUsers/addConnection",
            method = RequestMethod.POST,
            consumes = "application/json",
            produces = "application/json"
    )
    public ResponseEntity<Connection> addConnection(@RequestBody Connection connection){
        Optional<Connection> existingConnection = connectionService.findConnection(connection.getRequester(), connection.getRequested());

        if(existingConnection.isPresent()) {
            Notification notification = new Notification();
            notification.setReciever(userService.findByUsernameExists(connection.getRequested()));
            notification.setSender(userService.findByUsernameExists(connection.getRequester()));
            notification.setTimestamp(new Date());
            notification.setNotificationUrl("/viewConnections");
            notification.setNotificationContent(connection.getRequester()+" is now your buddy!");
            notificationService.sendNotification(notification);
            connection.setId(existingConnection.get().getId());
            connection.setIsConnected(true);
            return ResponseEntity.ok(connectionService.saveConnection(connection));
        }
        else {
            //Sending notification
            Notification notification = new Notification();
            notification.setReciever(userService.findByUsernameExists(connection.getRequested()));
            notification.setSender(userService.findByUsernameExists(connection.getRequester()));
            notification.setTimestamp(new Date());
            notification.setNotificationUrl("/viewConnections");
            notification.setNotificationContent(connection.getRequester()+" wants to be your buddy!");
            notificationService.sendNotification(notification);

            return ResponseEntity.ok(connectionService.saveConnection(connection));
        }
    }
}