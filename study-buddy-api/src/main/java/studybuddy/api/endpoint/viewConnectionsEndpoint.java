package studybuddy.api.endpoint;

import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import studybuddy.api.connection.Connection;
import studybuddy.api.connection.ConnectionService;
import studybuddy.api.user.User;
import studybuddy.api.user.UserService;

import java.util.ArrayList;
import java.util.List;

@Log4j2
@RestController
//@CrossOrigin(origins = "http://localhost:3000") // for local testing
@CrossOrigin(origins = "http://34.16.169.60:3000")
public class viewConnectionsEndpoint {

    @Autowired
    private ConnectionService connectionService;

    @Autowired
    private UserService userService;

    @GetMapping("/viewConnections/{username}")
    public List<User> fetchConnections(@PathVariable String username) {
        List<Connection> connections = connectionService.getConnections(username);
        List<String> conUsernames = new ArrayList<>();
        List<User> conUsers = new ArrayList<>();

        for(Connection c : connections) {
            System.out.println("requester is " + c.getRequester());
            System.out.println("requested is " + c.getRequested());

            if(!c.getRequester().equals(username)) {
                conUsernames.add(c.getRequester());
            }
            else if(!c.getRequested().equals(username)) {
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
}
