package studybuddy.api.endpoint;

import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import studybuddy.api.user.User;
import studybuddy.api.user.UserRepository;

import java.io.Console;

@Log4j2
@RestController
@CrossOrigin(origins = "http://localhost:3000") // for local testing
//@CrossOrigin(origins = "http://34.16.169.60:3000")
public class LoginEndpoint {

    @Autowired
    // do I use the repository or the jdbc template??
    //private UserRepository userRepository;
    JdbcTemplate jdbcTemplate;

    @RequestMapping(
            value = "/api/login",
            method = RequestMethod.POST,
            consumes = "application/json",
            produces = "application/json"
    )
    public String authorizeUser(@RequestBody User user) {
        System.out.println(user.getPassword());
        // TODO:
        // Query for UserID
        //String idSql = "SELECT USER_ID FROM User WHERE USERNAME = ?";
        //jdbcTemplate.query(idSql, user.getUsername());

        // findUser(rs from query)
        // what to do based on user type??
        return "authorized";
    }
}
