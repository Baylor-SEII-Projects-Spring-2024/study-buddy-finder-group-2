/*package studybuddy.api.endpoint;

import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import studybuddy.api.user.User;
import studybuddy.api.user.UserService;


@Log4j2
@RestController
@CrossOrigin(origins = "http://localhost:3000") // for local testing
//@CrossOrigin(origins = "http://34.16.169.60:3000")
public class LoginEndpoint {

    @Autowired
    private UserService userService;
    @RequestMapping(
            value = "/api/login",
            method = RequestMethod.POST,
            consumes = "application/json",
            produces = "application/json"
    )
    public ResponseEntity<User> authorizeUser(@RequestBody User user) {
        // Query for user using username and password
        if(!userService.findByUsernamePassword(user.getUsername(), user.getPassword()).isEmpty()) {
            // assign the correct userType to the user to be passed back
            user.setUserType(userService.findUserType(user.getUsername()));

            // return success code (200)
            System.out.println("authorized user");
            return ResponseEntity.ok(user);
        }
        else {
            // return error
            System.out.println("no such user");
            return ResponseEntity.badRequest().build();
        }
    }
}*/

package studybuddy.api.endpoint;

import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import studybuddy.api.user.User;
import studybuddy.api.user.UserService;


@Log4j2
@RestController
@CrossOrigin(origins = "http://localhost:3000") // for local testing
//@CrossOrigin(origins = "http://34.16.169.60:3000")
public class LoginEndpoint {

    @Autowired
    private UserService userService;
    @RequestMapping(
            value = "/api/login",
            method = RequestMethod.POST,
            consumes = "application/json",
            produces = "application/json"
    )
    public ResponseEntity<User> authorizeUser(@RequestBody User user) {
        // Query for user using username and password
        if(!userService.findByUsernamePassword(user.getUsername(), user.getPassword()).isEmpty()) {
            // assign the correct userType to the user to be passed back
            user.setUserType(userService.findUserType(user.getUsername()));

            // return success code (200)
            System.out.println("authorized user");
            return ResponseEntity.ok(user);
        }
        else {
            // return error
            System.out.println("no such user");
            return ResponseEntity.badRequest().build();
        }
    }
}
