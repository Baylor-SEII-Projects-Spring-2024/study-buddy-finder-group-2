package studybuddy.api.endpoint;

import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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
@CrossOrigin(origins = "http://localhost:3000") // for local testing
//@CrossOrigin(origins = "http://34.16.169.60:3000")
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
            return ResponseEntity.status(409).build();
        }
        else{
            System.out.println("User is available!");
            return ResponseEntity.ok(userService.saveUser(user));
            //return ResponseEntity.ok(user);
        }
    }

}
