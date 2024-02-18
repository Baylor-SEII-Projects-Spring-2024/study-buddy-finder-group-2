package studybuddy.api.endpoint;

import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import studybuddy.api.user.User;
import studybuddy.api.user.UserRepository;

@Log4j2
@RestController
//@RequestMapping("/api/users")
public class LoginEndpoint {

    @Autowired
    private UserRepository userRepository;

    //@PostMapping
    @CrossOrigin(origins = "http://localhost:3000") // for local testing
    //@CrossOrigin(origins = "http://34.16.169.60:3000")
    @GetMapping("/login")
    // ResponseEntity<User>
    public String createUser(@RequestBody User registeredUser) {
        if (registeredUser.getEmailAddress() == null || registeredUser.getPassword() == null) {
            // Basic validation
            //return ResponseEntity.badRequest().build();
            return "womp womp";
        }
        // Ideally, encrypt the password here before saving
        return registeredUser.getPassword();
    }
}
