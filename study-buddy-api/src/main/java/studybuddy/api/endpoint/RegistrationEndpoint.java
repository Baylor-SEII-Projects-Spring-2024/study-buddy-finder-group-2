package studybuddy.api.endpoint;

import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import studybuddy.api.school.School;
import studybuddy.api.school.SchoolRepository;
import studybuddy.api.school.SchoolService;
import studybuddy.api.user.User;
import studybuddy.api.user.UserService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

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
        return new ResponseEntity<>(schoolService.getSchools(), HttpStatus.OK);
    }

    @RequestMapping(
            value = "/api/find-username",
            method = RequestMethod.GET
    )
    public ResponseEntity<String> usernameNotFound(@RequestBody String username){
        if(userService.findByUsername(username).isEmpty()){
            return ResponseEntity.ok(username);
        }
        else{
            return ResponseEntity.badRequest().build();
        }
    }

    @RequestMapping(
            value = "/api/find-email",
            method = RequestMethod.GET
    )
    public ResponseEntity<String>  emailNotFound(@RequestBody String email){
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
            consumes = "application/json",
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
            return ResponseEntity.ok(userService.saveUser(user));
            //return ResponseEntity.ok(user);
        }
    }

}
