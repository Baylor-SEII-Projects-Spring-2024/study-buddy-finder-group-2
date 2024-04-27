package studybuddy.api.endpoint;

import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import studybuddy.api.user.User;
import studybuddy.api.user.UserService;

import java.util.Optional;

@Log4j2
@RestController
@CrossOrigin(origins = "http://localhost:3000") // for local testing
//@CrossOrigin(origins = "http://34.16.169.60:3000")
public class UserEndpoint {
    @Autowired
    private UserService userService;

    private PasswordEncoder passwordEncoder;

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

    @RequestMapping(value = "/api/is-password/{username}/{oldPwd}",
            method = RequestMethod.GET)
    public ResponseEntity<Boolean> checkPassword(@PathVariable String username, @PathVariable String oldPwd){
      Optional<User> user = userService.findByUsername(username);
      if(user.isPresent()) {
          if(user.get().getPassword().equals(passwordEncoder.encode(oldPwd))){
              return ResponseEntity.ok(true);
          }
      }
      return ResponseEntity.badRequest().build();
    };

    @RequestMapping(value="/api/change-password/{username}",
            method=RequestMethod.POST)
    public ResponseEntity<Boolean> changePassword(@PathVariable String username, @RequestParam String password){
        Optional<User> user = userService.findByUsername(username);
        if(user.isPresent()) {
            User ope = user.get();
            ope.setPassword(passwordEncoder.encode(password));
            userService.saveUser(ope);
            return ResponseEntity.ok(true);
        }
        return ResponseEntity.badRequest().build();
    };

}
