package studybuddy.api.endpoint;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import studybuddy.api.meetings.Meeting;
import studybuddy.api.meetings.MeetingService;
import java.util.List;

@Log4j2
@RestController
//@CrossOrigin(origins = "http://localhost:3000") // for local testing
@CrossOrigin(origins = "http://34.16.169.60:3000")
public class SearchMeetupEndpoint {
    @Autowired
    private MeetingService meetingService;

    @RequestMapping(
            value = "/api/searchMeetups",
            method = RequestMethod.POST
    )
    public ResponseEntity<List<Meeting>> searchResults(@RequestBody Meeting meetingSearch) {
        System.out.println("TITLE: " + meetingSearch.getTitle());
        System.out.println("COURSE: " + meetingSearch.getSubject());

        // only title
        if(meetingSearch.getSubject().isEmpty()){
            return ResponseEntity.ok(meetingService.findByTitle(meetingSearch.getTitle()));
        }
        // title and course
        else{
            System.out.println("FINDING BY TITLE AND COURSE: " + meetingSearch.getTitle() + " " + meetingSearch.getSubject());
            return ResponseEntity.ok(meetingService.findByTitleAndCourse(meetingSearch.getTitle(), meetingSearch.getSubject()));
        }
    }
}
