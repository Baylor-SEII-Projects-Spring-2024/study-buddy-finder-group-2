package studybuddy.api.endpoint;

import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import studybuddy.api.user.User;
import studybuddy.api.user.UserRepository;

@Log4j2
@RestController
@CrossOrigin(origins = "http://localhost:3000") // for local testing
//@CrossOrigin(origins = "http://34.16.169.60:3000")
public class LoginEndpoint {

    @Autowired
    //private UserRepository userRepository;
    JdbcTemplate jdbcTemplate;

    @RequestMapping(
            value = "/api/login",
            method = RequestMethod.POST,
            consumes = "application/json",
            produces = "application/json"
    )
    public void authorizeUser(@RequestBody String[] user) {

    }
}
