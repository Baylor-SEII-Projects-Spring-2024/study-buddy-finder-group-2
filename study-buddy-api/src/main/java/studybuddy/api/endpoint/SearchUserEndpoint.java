package studybuddy.api.endpoint;
import ch.qos.logback.core.joran.sanity.Pair;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import studybuddy.api.course.Course;
import studybuddy.api.user.User;
import studybuddy.api.user.UserService;

import java.util.List;
import java.util.Set;


@Log4j2
@RestController
//@CrossOrigin(origins = "http://localhost:3000") // for local testing
@CrossOrigin(origins = "http://34.16.169.60:3000")
public class SearchUserEndpoint {

    @Autowired
    private UserService userService;


    @RequestMapping (
            value = "/api/searchUsers",
            method = RequestMethod.GET,
            consumes = "application/json",
            produces = "application/json"
    )
    public ResponseEntity<List<User>> searchUsers(@PathVariable String searchWord){
        return ResponseEntity.ok(userService.findByNameStartingWith(searchWord));
    }
    //TODO: figure out if addConnection should be own service.
    // Remember we have recommendations as an upcoming feature
    /*
    @RequestMapping(
            value = "/api/searchUsers/addConnection/{username}",
            method = RequestMethod.POST,
            consumes = "application/json",
            produces = "application/json"
    )
    public ResponseEntity<Course> addConnection(@PathVariable String username){

        return ResponseEntity.ok(userService);
    }*/

}
