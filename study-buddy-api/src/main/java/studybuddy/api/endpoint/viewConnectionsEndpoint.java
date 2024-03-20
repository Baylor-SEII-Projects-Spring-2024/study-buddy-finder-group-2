package studybuddy.api.endpoint;

import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import studybuddy.api.connection.Connection;
import studybuddy.api.connection.ConnectionService;
import studybuddy.api.meetings.Meeting;
import studybuddy.api.user.UserService;

import java.util.List;

@Log4j2
@RestController
@CrossOrigin(origins = "http://localhost:3000") // for local testing
//@CrossOrigin(origins = "http://34.16.169.60:3000")
public class viewConnectionsEndpoint {

    @Autowired
    private ConnectionService connectionService;

    @GetMapping("/viewConnections/{username}")
    public List<Connection> fetchConnections(@PathVariable String username) {
        return connectionService.getConnections(username);
    }
}
