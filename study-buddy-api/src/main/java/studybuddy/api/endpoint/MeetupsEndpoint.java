package studybuddy.api.endpoint;

import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import studybuddy.api.meetings.Meeting;
import studybuddy.api.meetings.MeetingService;
import studybuddy.api.user.User;
import studybuddy.api.user.UserService;

import java.util.List;


@Log4j2
@RestController
public class MeetupsEndpoint {

    @Autowired
    private MeetingService meetingService;
    @CrossOrigin(origins = "http://localhost:3000") // for local testing
    //@CrossOrigin(origins = "http://34.16.169.60:3000")
    @GetMapping("/viewMeetups")
    public List<Meeting> getMeetups() {
        return meetingService.findAll();
    }

    @CrossOrigin(origins = "http://localhost:3000") // for local testing
    @RequestMapping(
            value = "/viewMeetups",
            method = RequestMethod.POST,
            consumes = "application/json",
            produces = "application/json"
    )
    public ResponseEntity<Meeting> createMeeting(@RequestBody Meeting meeting) {
        meetingService.save(meeting);

        //add error checking (frontend or backend?)
        return ResponseEntity.ok(meeting);
    }
}