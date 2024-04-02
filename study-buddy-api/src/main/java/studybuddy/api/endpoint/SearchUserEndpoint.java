package studybuddy.api.endpoint;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import studybuddy.api.connection.Connection;
import studybuddy.api.connection.ConnectionService;
import studybuddy.api.user.User;
import studybuddy.api.user.UserService;
import org.springframework.web.bind.annotation.CrossOrigin;

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
    private ConnectionService connectionService;

    @RequestMapping(
            value = "/api/searchUsers/{username}",
            method = RequestMethod.POST
    )
    public ResponseEntity<List<User>> searchResults(@PathVariable String username, @RequestBody User userSearch) {
        List<User> users;
        System.out.println(username);

        if(userSearch.getUserType() == null) {
            users = userService.findByNameOrUsername(userSearch.getUsername());
        }
        else {
            users = userService.findByNameOrUsernameAndUserType(userSearch.getUsername(), userSearch.getUserType());
        }

        // remove the current user from search results
        for(User u : users) {
            if(u.getUsername().equals(username)) {
                users.remove(u);
            }
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
            connection.setId(existingConnection.get().getId());
            connection.setIsConnected(true);
            return ResponseEntity.ok(connectionService.saveConnection(connection));
        }
        else {

            return ResponseEntity.ok(connectionService.saveConnection(connection));
        }
    }
}