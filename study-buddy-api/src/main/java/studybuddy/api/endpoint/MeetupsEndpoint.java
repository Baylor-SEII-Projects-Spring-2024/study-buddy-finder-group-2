package studybuddy.api.endpoint;

import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import studybuddy.api.meetings.Meeting;
import studybuddy.api.meetings.MeetingService;
import org.springframework.web.bind.annotation.CrossOrigin;
import studybuddy.api.user.User;
import studybuddy.api.user.UserService;

import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Log4j2
@RestController
//@CrossOrigin(origins = "http://34.16.169.60:3000")
@CrossOrigin(origins = "http://localhost:3000") // for local testing
public class MeetupsEndpoint {

    @Autowired
    private MeetingService meetingService;

    @Autowired
    private UserService userService;

    @GetMapping("/viewMeetups/{username}")
    public List<Meeting> getMeetups(@PathVariable String username, @RequestHeader("timezone") String timeZone) {
        List<Meeting> meetings = meetingService.findByUsername(username);

        Optional<User> user = userService.findByUsername(username);

        List<Long> attendeeMeetingIds = meetingService.findByUserId(user.get().getId());

        List<Meeting> meetings2 = new ArrayList<Meeting>();

        for(Long id : attendeeMeetingIds){
            Optional<Meeting> meetingOptional = meetingService.findById(id);

            // add meeting only if not the creator (avoid duplicates)
            meetingOptional.ifPresent(meeting -> {
                if(!meeting.getUsername().equals(username)){
                    meetings2.add(meeting);
                }
            });
        }

        meetings.addAll(meetings2);

        // convert each meeting to the users local time
        ZoneId timeZoneId = ZoneId.of(timeZone);
        meetings.forEach(meeting -> {
            meeting.setDate(meeting.getDate().atZone(ZoneId.of("UTC")).withZoneSameInstant(timeZoneId).toLocalDateTime());
        });

        return meetings;
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
    public ResponseEntity<Meeting> updateMeeting(@RequestBody Meeting meeting, @RequestHeader("timezone") String timeZone) {
        Optional<Meeting> oldMeetingOpt = meetingService.findById(meeting.getId());

        // check if meeting already exists to update
        if(oldMeetingOpt.isPresent()){
            Meeting oldMeeting = oldMeetingOpt.get();

            ZoneId timeZoneUTC = ZoneId.of("UTC");
            ZoneId timeZoneId = ZoneId.of(timeZone);

            // set timezone of old meeting to new meeting to check against
            oldMeeting.setDate(oldMeeting.getDate().atZone(ZoneId.of("UTC")).withZoneSameInstant(timeZoneId).toLocalDateTime());

//            System.out.println("OLD: " + oldMeeting.getDate());
//            System.out.println("NEW: " + meeting.getDate());

            // if user didnt update time then convert the time to UTC
            // if user did update time then do not convert to UTC
            if(oldMeeting.getDate().isEqual(meeting.getDate())) {
                //System.out.println("******BEFORE CONVERT: " + meeting.getDate());
                meeting.setDate(meeting.getDate().atZone(ZoneId.of(timeZone)).withZoneSameInstant(timeZoneUTC).toLocalDateTime());
                //System.out.println("AFTER CONVERT: " + meeting.getDate());
            }

            return ResponseEntity.ok(meetingService.save(meeting));
        }
        else{
            return ResponseEntity.badRequest().build();
        }
    }
}