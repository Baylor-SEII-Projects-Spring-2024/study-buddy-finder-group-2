package studybuddy.api.endpoint;

import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import studybuddy.api.school.School;
import studybuddy.api.school.SchoolService;
import studybuddy.api.user.User;
import studybuddy.api.user.UserService;

import java.util.List;


@Log4j2
@RestController
//@CrossOrigin(origins = "http://localhost:3000") // for local testing
@CrossOrigin(origins = "http://34.16.169.60:3000")
public class RegistrationEndpoint {
    @Autowired
    UserService userService = new UserService();
    @Autowired
    SchoolService schoolService = new SchoolService();

    //TODO: get values and names of schools from database
    @RequestMapping(
            value = "/api/request-school-options",
            method = RequestMethod.GET,
            produces = "application/json"
    )
    public ResponseEntity<List<School>> getSchoolOptions(){
        System.out.println("here");
        return new ResponseEntity<>(schoolService.getSchools(), HttpStatus.OK);
    }

    @RequestMapping(
            value = "/api/find-username/{username}",
            method = RequestMethod.GET
    )
    public ResponseEntity<String> usernameNotFound(@PathVariable String username){
        if(userService.findByUsername(username).isEmpty()){
            System.out.println("USER IS EMPTY");
            return ResponseEntity.ok(username);
        }
        else{
            System.out.println("USER EXISTS");
            return ResponseEntity.badRequest().build();
        }
    }

    @RequestMapping(
            value = "/api/find-email/{email}",
            method = RequestMethod.GET,
            produces = "application/json"
    )
    public ResponseEntity<String>  emailNotFound(@PathVariable String email){
        if(userService.findByEmail(email).isEmpty()){
            return ResponseEntity.ok(email);
        }
        else{
            return ResponseEntity.badRequest().build();
        }
    }

    //find if user exists already
    //creates user if not
    @RequestMapping (
            value = "/api/register",
            method = RequestMethod.POST,
            produces = "application/json"
    )
    public ResponseEntity<User> registerUser(@RequestBody User user) {
        System.out.println(user.getUsername());
        System.out.println(user.getUserType());
        if(!(userService.findByUsername(user.getUsername()).isEmpty())
                || !(userService.findByEmail(user.getEmailAddress()).isEmpty())){
        //if(false){
            System.out.println("Username or email already exists");
            return ResponseEntity.badRequest().body(null);
        }
        else{
            System.out.println("User is available!");
            return new ResponseEntity<>(userService.saveUser(user),HttpStatus.OK);
            //return ResponseEntity.ok(user);
        }
    }

}
