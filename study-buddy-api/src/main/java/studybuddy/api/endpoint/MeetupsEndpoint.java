package studybuddy.api.endpoint;

import jakarta.transaction.Transactional;
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
@CrossOrigin(origins = "http://34.16.169.60:3000")
//@CrossOrigin(origins = "http://localhost:3000") // for local testing
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
            meeting.setStartDate(meeting.getStartDate().atZone(ZoneId.of("UTC")).withZoneSameInstant(timeZoneId).toLocalDateTime());
            meeting.setEndDate(meeting.getEndDate().atZone(ZoneId.of("UTC")).withZoneSameInstant(timeZoneId).toLocalDateTime());
        });

        return meetings;
    }

//    @Transactional
//    @RequestMapping(
//            value = "/viewMeetups",
//            method = RequestMethod.POST,
//            consumes = "application/json",
//            produces = "application/json"
//    )
//    public ResponseEntity<Meeting> createMeeting(@RequestBody Meeting meeting) {
//        Optional<User> user = userService.findByUsername(meeting.getUsername());
//
//        ResponseEntity<Meeting> response = ResponseEntity.ok(meetingService.save(meeting));
//
//        Meeting m = response.getBody(); // Get the Meeting object from ResponseEntity
//
//        if(user.isPresent()) {
//            meetingService.saveMeetupUser(m.getId(), user.get().getId());
//        }
//
//        return response;
//    }

    //TODO: make it so that the creator gets included in attendees ^^^^
    @RequestMapping(value = "/viewMeetups", method = RequestMethod.POST, consumes = "application/json", produces = "application/json")
    public ResponseEntity<Meeting> createMeeting(@RequestBody Meeting meeting) {
        Meeting savedMeeting = meetingService.save(meeting);
        Long userId = userService.findByUsername(savedMeeting.getUsername()).get().getId();
        meetingService.saveMeetupUser(userId, savedMeeting.getId());
        return ResponseEntity.ok(savedMeeting);
    }


    @DeleteMapping("/viewMeetups/{id}")
    public void deleteMeeting(@PathVariable Long id) {
//        Optional<Meeting> m = meetingService.findById(id);
//
//        Meeting present = m.get();
//
//        for(User u : present.getAttendees()){
//            meetingService.deleteMeetupUser(u.getId(), id);
//        }
//
//        meetingService.delete(id);

        meetingService.deleteMeetupUser(id);
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
            oldMeeting.setStartDate(oldMeeting.getStartDate().atZone(ZoneId.of("UTC")).withZoneSameInstant(timeZoneId).toLocalDateTime());
            oldMeeting.setEndDate(oldMeeting.getEndDate().atZone(ZoneId.of("UTC")).withZoneSameInstant(timeZoneId).toLocalDateTime());

//            System.out.println("OLD: " + oldMeeting.getDate());
//            System.out.println("NEW: " + meeting.getDate());

            // if user didnt update time then convert the time to UTC
            // if user did update time then do not convert to UTC
            if(oldMeeting.getStartDate().isEqual(meeting.getStartDate())) {
                //System.out.println("******BEFORE CONVERT: " + meeting.getDate());
                meeting.setStartDate(meeting.getStartDate().atZone(ZoneId.of(timeZone)).withZoneSameInstant(timeZoneUTC).toLocalDateTime());
                //System.out.println("AFTER CONVERT: " + meeting.getDate());
            }

            if(oldMeeting.getEndDate().isEqual(meeting.getEndDate())) {
                //System.out.println("******BEFORE CONVERT: " + meeting.getDate());
                meeting.setEndDate(meeting.getEndDate().atZone(ZoneId.of(timeZone)).withZoneSameInstant(timeZoneUTC).toLocalDateTime());
                //System.out.println("AFTER CONVERT: " + meeting.getDate());
            }

            return ResponseEntity.ok(meetingService.save(meeting));
        }
        else{
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping(value = "/recommendMeetups/{username}")
    public List<Meeting> recommendMeetups(@PathVariable String username) {
        User loggedInUser = userService.findByUsername(username).get();
        List<Meeting> recommendedMeetups = meetingService.recommendMeetupsForUser(loggedInUser.getId());

        if (recommendedMeetups.isEmpty()) {
            log.info("No recommendations found for user id: {}", loggedInUser.getUsername());
        }
        else {
            for (Meeting meeting : recommendedMeetups) {
                log.info("Recommended meeting: {}", meeting.getTitle());
            }
        }

        return recommendedMeetups;
    }
}