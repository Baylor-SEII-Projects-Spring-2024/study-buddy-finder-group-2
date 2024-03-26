package studybuddy.api.endpoint;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import studybuddy.api.connection.Connection;
import studybuddy.api.connection.ConnectionService;
import studybuddy.api.meetings.Meeting;
import studybuddy.api.meetings.Meeting;
import studybuddy.api.meetings.MeetingService;
import studybuddy.api.user.User;
import studybuddy.api.user.UserService;

import java.util.List;
import java.util.Optional;


@Log4j2
@RestController
@CrossOrigin(origins = "http://localhost:3000") // for local testing
//@CrossOrigin(origins = "http://34.16.169.60:3000")
public class SearchMeetupEndpoint {
    @Autowired
    private MeetingService meetingService;

    @RequestMapping(
            value = "/api/searchMeetups",
            method = RequestMethod.POST
    )
    public ResponseEntity<List<Meeting>> searchResults(@RequestBody Meeting meetingSearch) {
//        if(userSearch.getUserType() == null) {
//            return ResponseEntity.ok(userService.findByNameOrUsername(userSearch.getUsername()));
//        }
//        else {
//            System.out.println(userSearch.getUserType());
//            return ResponseEntity.ok(userService.findByNameOrUsernameAndUserType(userSearch.getUsername(), userSearch.getUserType()));
//        }

        return ResponseEntity.ok(meetingService.findByTitle(meetingSearch.getTitle()));
    }
}
