package studybuddy.api.endpoint;
import jakarta.transaction.Transactional;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import studybuddy.api.meetings.Meeting;
import studybuddy.api.meetings.MeetingService;
import studybuddy.api.user.User;
import studybuddy.api.user.UserService;

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
    public ResponseEntity<List<Meeting>> searchResults(@RequestBody Meeting meetingSearch){
        // USE STRINGS INSTEAD AND PASS ALL STATES INTO HERE? have 1 generic search function and since some of
        // them will be blank it wont affect the search?
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
}
