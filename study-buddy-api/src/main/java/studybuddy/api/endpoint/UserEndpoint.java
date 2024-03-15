package studybuddy.api.endpoint;

import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import studybuddy.api.user.User;
import studybuddy.api.user.UserService;

@Log4j2
@RestController
//@CrossOrigin(origins = "http://localhost:3000") // for local testing
@CrossOrigin(origins = "http://34.16.169.60:3000")
public class UserEndpoint {
    @Autowired
    private UserService userService;

    @GetMapping("/users/{id}")
    public User findUserById(@PathVariable Long id) {
        var user = userService.findUser(id).orElse(null);

        if (user == null) {
            log.warn("User not found");
        }

        return user;
    }

    @RequestMapping (value = "/users/{username}",
            method = RequestMethod.GET,
            produces = "application/json"
    )
    public ResponseEntity<User> findUserByUsername(@PathVariable String username) {
        User user = userService.findByUsername(username).orElse(null);

        System.out.println("finding " + username);
        if (user == null) {
            log.warn("User not found");
            return ResponseEntity.badRequest().build();
        }

        return ResponseEntity.ok(user);
    }

    @PostMapping("/users")
    public User saveUser(@RequestBody User user) {
        return userService.saveUser(user);
    }
}
