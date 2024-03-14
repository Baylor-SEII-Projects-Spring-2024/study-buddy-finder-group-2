package studybuddy.api.endpoint;
import ch.qos.logback.core.joran.sanity.Pair;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import studybuddy.api.course.Course;
import studybuddy.api.user.UserService;

import java.util.List;
import java.util.Set;


@Log4j2
@RestController

public class SearchUserEndpoint {

    @Autowired
    private UserService userService;

    //@CrossOrigin(origins = "http://localhost:3000") // for local testing
    @CrossOrigin(origins = "http://34.16.169.60:3000")
    @RequestMapping (
            value = "/api/searchUsers",
            method = RequestMethod.GET,
            consumes = "application/json",
            produces = "application/json"
    )
    public ResponseEntity<List<Pair<String, String>>> searchUsers(@PathVariable String searchWord){
        return new ResponseEntity<>(userService.findByNameStartingWith(searchWord), HttpStatus.OK);
    }


}
