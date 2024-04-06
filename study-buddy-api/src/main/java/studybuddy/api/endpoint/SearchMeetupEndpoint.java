package studybuddy.api.endpoint;
import jakarta.transaction.Transactional;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import studybuddy.api.meetings.Meeting;
import studybuddy.api.meetings.MeetingService;
import studybuddy.api.user.User;
import studybuddy.api.user.UserService;

import java.time.ZoneId;
import java.util.List;
import java.util.Optional;

@Log4j2
@RestController
//@CrossOrigin(origins = "http://localhost:3000") // for local testing
@CrossOrigin(origins = "http://34.16.169.60:3000")
public class SearchMeetupEndpoint {
    @Autowired
    private MeetingService meetingService;

    @Autowired
    private UserService userService;

    @RequestMapping(
            value = "/api/searchMeetups",
            method = RequestMethod.POST
    )
    public ResponseEntity<List<Meeting>> searchResults(@RequestBody Meeting meetingSearch, @RequestHeader("timezone") String timeZone){
        // USE STRINGS INSTEAD AND PASS ALL STATES INTO HERE? have 1 generic search function and since some of
        // them will be blank it wont affect the search?
        System.out.println("TITLE: " + meetingSearch.getTitle());
        System.out.println("COURSE: " + meetingSearch.getSubject());

        List<Meeting> m;

        // only title
        if(meetingSearch.getSubject().isEmpty()){
            m = (ResponseEntity.ok(meetingService.findByTitle(meetingSearch.getTitle())).getBody());
        }
        // title and course
        else{
            System.out.println("FINDING BY TITLE AND COURSE: " + meetingSearch.getTitle() + " " + meetingSearch.getSubject());
            m = (ResponseEntity.ok(meetingService.findByTitleAndCourse(meetingSearch.getTitle(), meetingSearch.getSubject()))).getBody();
        }

        ZoneId timeZoneId = ZoneId.of(timeZone);
        m.forEach(meeting -> {
            meeting.setStartDate(meeting.getStartDate().atZone(ZoneId.of("UTC")).withZoneSameInstant(timeZoneId).toLocalDateTime());
            meeting.setEndDate(meeting.getEndDate().atZone(ZoneId.of("UTC")).withZoneSameInstant(timeZoneId).toLocalDateTime());
        });

        ResponseEntity<List<Meeting>> response = new ResponseEntity<>(m, HttpStatus.OK);

        return response;
    }

    @Transactional
    @RequestMapping(
            value = "/api/searchMeetups/{username}",
            method = RequestMethod.POST
    )
    public void joinMeeting(@PathVariable String username, @RequestParam Long meetingId){
        System.out.println("USERNAME: " + username);
        System.out.println("MEETINGID: " + meetingId);
        Optional<User> user = userService.findByUsername(username);

        if(user.isPresent()) {
            meetingService.saveMeetupUser(user.get().getId(), meetingId);
        }
    }

    @Transactional
    @RequestMapping(
            value = "/api/searchMeetups/{username}",
            method = RequestMethod.DELETE
    )
    public void leaveMeeting(@PathVariable String username, @RequestParam Long meetingId){
        System.out.println("USERNAME: " + username);
        System.out.println("MEETINGID: " + meetingId);
        Optional<User> user = userService.findByUsername(username);

        if(user.isPresent()) {
            meetingService.leaveMeetup(user.get().getId(), meetingId);
        }
    }
}
