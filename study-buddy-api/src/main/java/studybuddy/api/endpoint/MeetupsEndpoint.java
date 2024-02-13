package studybuddy.api.endpoint;

import lombok.extern.log4j.Log4j2;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;


@Log4j2
@RestController
public class MeetupsEndpoint {

    // CrossOrigin(origins = "http://localhost:3000") // for local testing
    @CrossOrigin(origins = "34.16.169.60:3000")
    @GetMapping("/viewMeetups")
    public List<String> getMeetups() {
        return List.of("sample meetup 1", "sample meetup 2", "sample meetup 3", "sample meetup 4");
    }
}
