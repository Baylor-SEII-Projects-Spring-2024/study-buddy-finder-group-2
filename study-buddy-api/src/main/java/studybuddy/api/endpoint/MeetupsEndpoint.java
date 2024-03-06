package studybuddy.api.endpoint;

import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import studybuddy.api.meetings.Meeting;
import studybuddy.api.meetings.MeetingService;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;

@Log4j2
@RestController
@CrossOrigin(origins = "http://34.16.169.60:3000")
//@CrossOrigin(origins = "http://localhost:3000") // for local testing
public class MeetupsEndpoint {

    @Autowired
    private MeetingService meetingService;

    @GetMapping("/viewMeetups")
    public List<Meeting> getMeetups() {
        return meetingService.findAll();
    }

    @RequestMapping(
            value = "/viewMeetups",
            method = RequestMethod.POST,
            consumes = "application/json",
            produces = "application/json"
    )
    public ResponseEntity<Meeting> createMeeting(@RequestBody Meeting meeting) {
        meetingService.save(meeting);

        //add error checking
        return ResponseEntity.ok(meeting);
    }

    @DeleteMapping("/viewMeetups/{id}")
    public void deleteMeeting(@PathVariable Long id) {
        meetingService.delete(id);
    }
}