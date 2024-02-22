package studybuddy.api.endpoint;

import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import studybuddy.api.user.User;
import studybuddy.api.user.UserService;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Log4j2
@RestController
public class RegistrationEndpoint {
    @Autowired
    UserService userService = new UserService();

    //find if user exists already
    //creates user if not
    @CrossOrigin(origins = "http://localhost:3000") // for local testing
    //@CrossOrigin(origins = "http://34.16.169.60:3000")
    @RequestMapping (
            value = "/api/register",
            method = RequestMethod.POST,
            consumes = "application/json",
            produces = "application/json"
    )
    public ResponseEntity<User> registerUser(@RequestBody User user) {
        System.out.println(user.getUsername());
        System.out.println(user.getUserType());
        //TODO: Figure out why interface null = issue
        if(!(userService.findByUsername(user.getUsername()).isEmpty())
                || !(userService.findByEmail(user.getEmailAddress()).isEmpty())){
        //if(false){
            System.out.println("Username or email already exists");
            return ResponseEntity.status(409).build();
        }
        else{
            System.out.println("User is available!");
            return ResponseEntity.ok(userService.saveUser(user)); //NOTE: won't work
            //return ResponseEntity.ok(user);
        }
    }
    
}
