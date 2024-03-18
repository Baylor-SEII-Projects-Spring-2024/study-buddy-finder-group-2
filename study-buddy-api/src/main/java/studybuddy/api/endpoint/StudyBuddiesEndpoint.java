package studybuddy.api.endpoint;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import studybuddy.api.studyBuddy.StudyBuddy;
import studybuddy.api.studyBuddy.StudyBuddyService;

import java.util.List;


@Log4j2
@RestController
//@CrossOrigin(origins = "http://localhost:3000") // for local testing
@CrossOrigin(origins = "http://34.16.169.60:3000")
public class StudyBuddiesEndpoint {
    @Autowired
    StudyBuddyService studyBuddyService = new StudyBuddyService();

    @RequestMapping (
            value = "/studyBuddies/{username}",
            method = RequestMethod.GET,
            consumes = "application/json",
            produces = "application/json"
    )
    public ResponseEntity<List<String>> getStudyBuddies(@PathVariable String thisUser){
        return ResponseEntity.ok(studyBuddyService.getStudyBuddies(thisUser));
    }
    @RequestMapping (
            value = "/studyBuddies/{username}",
            method = RequestMethod.GET,
            consumes = "application/json",
            produces = "application/json"
    )
    public ResponseEntity<List<String>> getStudyBuddyRequests(@PathVariable String thisUser){
        return ResponseEntity.ok(studyBuddyService.getStudyBuddyRequests(thisUser));
    }
    @RequestMapping (
            value = "/studyBuddies/{username}",
            method = RequestMethod.GET,
            consumes = "application/json",
            produces = "application/json"
    )
    public ResponseEntity<List<String>> getStudyBuddyRequesters(@PathVariable String thisUser){
        return ResponseEntity.ok(studyBuddyService.getStudyBuddyRequesters(thisUser));
    }
}
