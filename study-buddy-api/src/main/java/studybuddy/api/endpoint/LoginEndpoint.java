package studybuddy.api.endpoint;

import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import studybuddy.api.user.User;
import studybuddy.api.user.UserRepository;

import java.util.HashMap;
import java.util.Map;

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
        // find user with matchin username and password from map
        Map<String, String> userList = new HashMap<>();
        userList.put("emmlynn", "password10");
        userList.put("rodger", "myPswrd");
        userList.put("darthVader66", "exeOrder66");

        // BOTH username and password must match
        boolean userFound = false;
        if(userList.containsKey(user.getUsername())
                && userList.get(user.getUsername()).equals(user.getPassword())) {
            userFound = true;
        }
        // set different userTypes manually here
        if(user.getUsername().equals("emmlynn")) {
            user.setUserType("student");
        }
        else if(user.getUsername().equals("rodger")) {
            user.setUserType("student");
        }
        else if(user.getUsername().equals("darthVader66")){
            user.setUserType("tutor");
        }

        if(userFound) {
            // return success code (200)
            System.out.println("authorized user");
            return ResponseEntity.ok(user);
        }
        else {
            // return error
            System.out.println("no such user");
            return ResponseEntity.badRequest().build();
        }

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
    }
}
