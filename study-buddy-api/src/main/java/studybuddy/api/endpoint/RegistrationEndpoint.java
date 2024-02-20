package studybuddy.api.endpoint;

import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import studybuddy.api.user.User;

import java.util.ArrayList;
import java.util.List;

@Log4j2
@RestController
public class RegistrationEndpoint {



    //find if user exists already
    //creates user if not
    @RequestMapping (
            value = "/api/register",
            method = RequestMethod.POST,
            consumes = "application/json",
            produces = "application/json"
    )
    public ResponseEntity<User> registerUser(@RequestBody User user) {
        System.out.println(user.getUsername());
        //TODO: Search for user

        //TODO: If user not found, save user to database

        return ResponseEntity.ok(user);
    }
    
}
