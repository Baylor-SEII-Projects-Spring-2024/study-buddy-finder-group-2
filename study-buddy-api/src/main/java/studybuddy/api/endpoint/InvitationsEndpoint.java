package studybuddy.api.endpoint;

import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import studybuddy.api.connection.Connection;
import studybuddy.api.connection.ConnectionService;
import studybuddy.api.user.User;
import studybuddy.api.user.UserService;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Log4j2
@RestController
//@CrossOrigin(origins = "http://localhost:3000") // for local testing
@CrossOrigin(origins = "http://34.16.169.60:3000")
public class InvitationsEndpoint {

    @Autowired
    private ConnectionService connectionService;

    @Autowired
    private UserService userService;

    // fetching all incoming requests
    @GetMapping("/api/viewInRequests/{username}")
    public List<User> fetchInRequests(@PathVariable String username) {
        List<Connection> connections = connectionService.getRequests(username);
        List<String> conUsernames = new ArrayList<>();
        List<User> conUsers = new ArrayList<>();

        for(Connection c : connections) {
            if(c.getRequested().equals(username)) {
                conUsernames.add(c.getRequester());
            }
        }

        for(String u : conUsernames) {
            User conUser = userService.findByUsernameExists(u);

            if(conUser != null) {
                conUsers.add(conUser);
            }
        }
        return conUsers;
    }

    // fetching all outgoing requests
    @GetMapping("/api/viewOutRequests/{username}")
    public List<User> fetchOutRequests(@PathVariable String username) {
        List<Connection> connections = connectionService.getRequests(username);
        List<String> conUsernames = new ArrayList<>();
        List<User> conUsers = new ArrayList<>();

        for(Connection c : connections) {
            if(c.getRequester().equals(username)) {
                conUsernames.add(c.getRequested());
            }
        }

        for(String u : conUsernames) {
            User conUser = userService.findByUsernameExists(u);

            if(conUser != null) {
                conUsers.add(conUser);
            }
        }
        return conUsers;
    }

    // get a single request
    @RequestMapping(
            value = "/api/viewRequests/getConnection/{username}",
            method = RequestMethod.POST
    )
    public ResponseEntity<Connection> getConnection(@PathVariable String username, @RequestBody String requested) {
        return ResponseEntity.ok(connectionService.getConnection(username, requested));
    }

    @RequestMapping(
            value = "/api/viewRequests/addConnection",
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
