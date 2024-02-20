package studybuddy.api.endpoint;

import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import studybuddy.api.user.User;
import studybuddy.api.user.UserRepository;

@Log4j2
@RestController
@CrossOrigin(origins = "http://localhost:3000") // for local testing
//@CrossOrigin(origins = "http://34.16.169.60:3000")
public class LoginEndpoint {

    @Autowired
    private UserRepository userRepository;
    // do I use the repository or the jdbc template??
    // JdbcTemplate jdbcTemplate;

    @RequestMapping(
            value = "/api/login",
            method = RequestMethod.POST,
            consumes = "application/json",
            produces = "application/json"
    )
    public ResponseEntity<User> authorizeUser(@RequestBody User user) {
        System.out.println(user.getUsername());
        user.setUserType("student");
        // Query for UserID
        // TODO: how am I supposed to get the User_ID without saving??
        // TODO: I think this just caused sleep??
        // User savedUser = userRepository.save(user);

        // TODO: fix table name in query (says "Table 'studybuddy.User' doesn't exist")
        // TODO: is the table name users??
        //String createSql = "INSERT INTO User (username, password, user_type) VALUES (?, ?, ?)";
        //jdbcTemplate.update(createSql, user.getUsername(), user.getPassword(), "student");

        //String idSql = "SELECT * FROM User WHERE USERNAME = " + user.getUsername() + " AND PASSWORD = " + user.getPassword();
        //List<User> userList = jdbcTemplate.query(idSql, new BeanPropertyRowMapper(User.class));

        // find user
        // System.out.println(userList.size());
        /*if(!userRepository.findById(savedUser.getId()).isEmpty()) {
            System.out.println("authorized user");
            return ResponseEntity.ok(savedUser);
        }
        else {
            System.out.println("no such user");
            return ResponseEntity.badRequest().build();
        }*/
        return ResponseEntity.ok(user);
    }
}
