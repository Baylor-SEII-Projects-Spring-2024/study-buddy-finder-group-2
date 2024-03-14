package studybuddy.api.endpoint;
import ch.qos.logback.core.joran.sanity.Pair;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import studybuddy.api.user.UserService;

import java.util.List;


@Log4j2
@RestController

public class SearchUserEndpoint {

    @Autowired
    private UserService userService;

    //@CrossOrigin(origins = "http://localhost:3000") // for local testing
    /* WIP
    @CrossOrigin(origins = "http://34.16.169.60:3000")
    @RequestMapping (
            value = "/searchUsers",
            method = RequestMethod.GET,
            consumes = "application/json",
            produces = "application/json"
    )
    public List<String> SearchUsers(@RequestParam("query") String query){
        List<Pair<String, String>> = userService.findByNameStartingWith()
    }
    @RequestMapping(
            value = "
    */
}
