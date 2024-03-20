package studybuddy.api.endpoint;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import studybuddy.api.connection.Connection;
import studybuddy.api.connection.ConnectionService;
import studybuddy.api.meetings.Meeting;
import studybuddy.api.user.User;
import studybuddy.api.user.UserService;

import java.util.List;
import java.util.Optional;


@Log4j2
@RestController
@CrossOrigin(origins = "http://localhost:3000") // for local testing
//@CrossOrigin(origins = "http://34.16.169.60:3000")
public class SearchUserEndpoint {

    @Autowired
    private UserService userService;

    @Autowired
    private ConnectionService connectionService;

    @RequestMapping(
            value = "/api/searchUsers",
            method = RequestMethod.POST
    )
    public ResponseEntity<List<User>> searchResults(@RequestBody User userSearch) {
        if(userSearch.getUserType() == null) {
            return ResponseEntity.ok(userService.findByNameOrUsername(userSearch.getUsername()));
        }
        else {
            System.out.println(userSearch.getUserType());
            return ResponseEntity.ok(userService.findByNameOrUsernameAndUserType(userSearch.getUsername(), userSearch.getUserType()));
        }
    }

    @RequestMapping(
            value = "/api/searchUsers/addConnection",
            method = RequestMethod.POST,
            consumes = "application/json",
            produces = "application/json"
    )
    public ResponseEntity<Connection> addConnection(@RequestBody Connection connection){
        Optional<Connection> existingConnection = connectionService.findConnection(connection.getRequester(), connection.getRequested());

        // TODO: something to show user that connection exists (requests??)
        // TODO: prevent user from connecting with self
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