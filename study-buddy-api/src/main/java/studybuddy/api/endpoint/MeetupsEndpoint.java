package studybuddy.api.endpoint;

import jakarta.transaction.Transactional;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cglib.core.Local;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.bind.annotation.*;
import studybuddy.api.meetings.Meeting;
import studybuddy.api.meetings.MeetingService;
import org.springframework.web.bind.annotation.CrossOrigin;
import studybuddy.api.notifications.Notification;
import studybuddy.api.notifications.NotificationService;
import studybuddy.api.user.User;
import studybuddy.api.user.UserService;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Date;
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

    @Autowired
    private NotificationService notificationService;

    @GetMapping("expiredMeetups/{username}")
    public void checkExpiredMeetups(@PathVariable String username, @RequestHeader("timezone") String timeZone){
        System.out.println("CHECKING USER: " + username);

        User user = userService.findByUsernameExists(username);

        List<Long> meetingIds = meetingService.findByUserId(user.getId());
        List<Meeting> endedMeetings = new ArrayList<Meeting>();

        ZoneId timeZoneId = ZoneId.of(timeZone);

//        LocalDateTime currentTime = LocalDateTime.now().atZone(ZoneId.of("UTC")).withZoneSameInstant(timeZoneId).toLocalDateTime();

//        System.out.println("THE CURRENT TIME: " + currentTime.toString());

        ZonedDateTime zoned = ZonedDateTime.now(ZoneId.of(timeZone));

        System.out.println("THE CURRENT TIME: " + zoned.toLocalDateTime().toString());

        ZoneId timeZoneUTC = ZoneId.of("UTC");
        meetingIds.forEach(id -> {
            Optional<Meeting> m = meetingService.findById(id);

            m.get().setStartDate(m.get().getStartDate().atZone(ZoneId.of("UTC")).withZoneSameInstant(timeZoneId).toLocalDateTime());
            m.get().setEndDate(m.get().getEndDate().atZone(ZoneId.of("UTC")).withZoneSameInstant(timeZoneId).toLocalDateTime());


            System.out.println("MEETING CHECK: " + m.get().getTitle());
            System.out.println("MEETING EXPIRED?: " + m.get().getExpired());

            // check if meeting ended and they did not create meeting and notif about this meetup hasnt been sent before
            if(m.get().getEndDate().isBefore(zoned.toLocalDateTime()) && !m.get().getUsername().equals(username)
                    && !m.get().getExpired()){
                System.out.println("MEETING ENDED: " + m.get().getTitle());
                endedMeetings.add(m.get());
            }
        });

        endedMeetings.forEach(meeting -> {
            meeting.getAttendees().forEach(attendee -> {
                // only send notif to attendees, not the creator
                if(!attendee.getUsername().equals(meeting.getUsername())) {
                    System.out.println("ATTENDEE: " + attendee.getUsername());
                    Notification notification = new Notification();
                    notification.setReciever(attendee);
                    notification.setSender(userService.findByUsernameExists(meeting.getUsername()));
                    notification.setTimestamp(new Date());
                    notification.setNotificationUrl("/invitations");
                    notification.setNotificationContent("The meetup '" + meeting.getTitle() + "' by '" + meeting.getUsername() + "' has ended.");
                    notificationService.sendNotification(notification);
                }
            });

            // update expired status in database for this meeting
            meeting.setExpired(true);
            meeting.setStartDate(meeting.getStartDate().atZone(ZoneId.of(timeZone)).withZoneSameInstant(timeZoneUTC).toLocalDateTime());
            meeting.setEndDate(meeting.getEndDate().atZone(ZoneId.of(timeZone)).withZoneSameInstant(timeZoneUTC).toLocalDateTime());
            meetingService.save(meeting);
        });
    }

    @GetMapping("/viewMeetup/{meetupId}")
    public Optional<Meeting> getMeetup(@PathVariable long meetupId) {
        return meetingService.findById(meetupId);
    }

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

    @RequestMapping(value = "/viewMeetups", method = RequestMethod.POST, consumes = "application/json", produces = "application/json")
    public ResponseEntity<Meeting> createMeeting(@RequestBody Meeting meeting) {
        Meeting savedMeeting = meetingService.save(meeting);
        Long userId = userService.findByUsername(savedMeeting.getUsername()).get().getId();
        meetingService.saveMeetupUser(userId, savedMeeting.getId());
        return ResponseEntity.ok(savedMeeting);
    }


    @DeleteMapping("/viewMeetups/{id}")
    public void deleteMeeting(@PathVariable Long id) {
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
    public List<Meeting> recommendMeetups(@PathVariable String username, @RequestHeader("timezone") String timeZone) {
        User loggedInUser = userService.findByUsername(username).get();
        List<Meeting> recommendedMeetups = meetingService.recommendMeetupsForUser(loggedInUser.getId());

        if (recommendedMeetups.isEmpty()) {
            log.info("No recommendations found for user id: {}", loggedInUser.getUsername());
        }
        else {
            // convert each meeting to the users local time
            ZoneId timeZoneId = ZoneId.of(timeZone);
            for (Meeting meeting : recommendedMeetups) {
                meeting.setStartDate(meeting.getStartDate().atZone(ZoneId.of("UTC")).withZoneSameInstant(timeZoneId).toLocalDateTime());
                meeting.setEndDate(meeting.getEndDate().atZone(ZoneId.of("UTC")).withZoneSameInstant(timeZoneId).toLocalDateTime());
                log.info("Recommended meeting: {}", meeting.getTitle());
            }
        }

        return recommendedMeetups;
    }
}