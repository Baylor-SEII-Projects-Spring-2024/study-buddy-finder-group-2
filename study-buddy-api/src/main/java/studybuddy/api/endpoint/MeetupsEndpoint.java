package studybuddy.api.endpoint;

import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import studybuddy.api.meetings.Meeting;
import studybuddy.api.meetings.MeetingService;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;
import java.util.Optional;

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
        return ResponseEntity.ok(meetingService.save(meeting));
    }

    @DeleteMapping("/viewMeetups/{id}")
    public void deleteMeeting(@PathVariable Long id) {
        meetingService.delete(id);
    }

    @RequestMapping(
            value = "/viewMeetups",
            method = RequestMethod.PUT,
            consumes = "application/json",
            produces = "application/json"
    )
    public ResponseEntity<Meeting> updateMeeting(@RequestBody Meeting meeting) {
        Optional<Meeting> oldMeeting = meetingService.findById(meeting.getId());

        if(oldMeeting.isPresent()){
            return ResponseEntity.ok(meetingService.save(meeting));
        }
        else{
            return ResponseEntity.badRequest().build();
        }
    }
}