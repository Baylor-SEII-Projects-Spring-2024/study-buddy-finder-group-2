package studybuddy.api.endpoint;

import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import studybuddy.api.connection.Connection;
import studybuddy.api.connection.ConnectionService;
import studybuddy.api.meetings.Meeting;
import studybuddy.api.meetings.MeetingService;
import studybuddy.api.meetupInvites.MeetupInvite;
import studybuddy.api.meetupInvites.MeetupInvitesService;
import studybuddy.api.notifications.NotificationService;
import studybuddy.api.user.User;
import studybuddy.api.user.UserService;

import java.time.ZoneId;
import java.util.*;

@Log4j2
@RestController
//@CrossOrigin(origins = "http://localhost:3000") // for local testing
@CrossOrigin(origins = "http://34.16.169.60:3000")
public class InvitationsEndpoint {

    @Autowired
    private ConnectionService connectionService;

    @Autowired
    private UserService userService;

    @Autowired
    private MeetingService meetingService;

    @Autowired
    private MeetupInvitesService meetupInvitesService;

    @Autowired
    private NotificationService notificationService;

    // fetching all incoming requests
    @GetMapping("/api/viewInRequests/{username}")
    public List<User> fetchInRequests(@PathVariable String username) {
        List<Connection> connections = connectionService.getRequests(username);
        List<String> conUsernames = new ArrayList<>();
        List<User> conUsers = new ArrayList<>();

        for(Connection c : connections) {
            if(c.getRequested().equals(username)) {
                conUsernames.add(c.getRequester());
            }
        }

        for(String u : conUsernames) {
            User conUser = userService.findByUsernameExists(u);

            if(conUser != null) {
                conUsers.add(conUser);
            }
        }
        return conUsers;
    }

    // fetching all outgoing requests
    @GetMapping("/api/viewOutRequests/{username}")
    public List<User> fetchOutRequests(@PathVariable String username) {
        List<Connection> connections = connectionService.getRequests(username);
        List<String> conUsernames = new ArrayList<>();
        List<User> conUsers = new ArrayList<>();

        for(Connection c : connections) {
            if(c.getRequester().equals(username)) {
                conUsernames.add(c.getRequested());
            }
        }

        for(String u : conUsernames) {
            User conUser = userService.findByUsernameExists(u);

            if(conUser != null) {
                conUsers.add(conUser);
            }
        }
        return conUsers;
    }

    @RequestMapping(
            value = "/api/removeInvitation",
            method = RequestMethod.POST,
            consumes = "application/json",
            produces = "application/json"
    )
    public ResponseEntity<String> removeRequest(@RequestBody Connection connection) {
        connectionService.deleteConnection(connection.getRequester(), connection.getRequested());
        return ResponseEntity.ok("Request removed");
    }

    // get a single request
    @RequestMapping(
            value = "/api/viewRequests/getConnection/{username}",
            method = RequestMethod.POST
    )
    public ResponseEntity<Connection> getConnection(@PathVariable String username, @RequestBody String requested) {
        return ResponseEntity.ok(connectionService.getConnection(username, requested));
    }

    @RequestMapping(
            value = "/api/viewRequests/addConnection",
            method = RequestMethod.POST,
            consumes = "application/json",
            produces = "application/json"
    )
    public ResponseEntity<Connection> addConnection(@RequestBody Connection connection){
        Optional<Connection> existingConnection = connectionService.findConnection(connection.getRequester(), connection.getRequested());

        if(existingConnection.isPresent()) {
            connection.setId(existingConnection.get().getId());
            connection.setIsConnected(true);
            return ResponseEntity.ok(connectionService.saveConnection(connection));
        }
        else {

            return ResponseEntity.ok(connectionService.saveConnection(connection));
        }
    }

    @GetMapping("/api/viewMeetupInvites/{username}")
    public List<Optional<Meeting>> fetchMeetupInRequests(@PathVariable String username,
                                                         @RequestHeader("timezone") String timeZone) {
        List<MeetupInvite> meetupInvites = meetupInvitesService.getInvites(username);
        List<Long> meetupTitles = new ArrayList<>();
        List<Optional<Meeting>> invitedMeetups = new ArrayList<>();

        for(MeetupInvite mi : meetupInvites) {
            if(mi.getInvitee().equals(username)) {
                meetupTitles.add(mi.getMeetupId());
            }
        }

        ZoneId timeZoneId = ZoneId.of(timeZone);
        for(Long id : meetupTitles) {
            Optional<Meeting> meetup = meetingService.findById(id);

            if(meetup.isPresent()) {
                meetup.get().setStartDate(meetup.get().getStartDate().atZone(ZoneId.of("UTC")).withZoneSameInstant(timeZoneId).toLocalDateTime());
                meetup.get().setEndDate(meetup.get().getEndDate().atZone(ZoneId.of("UTC")).withZoneSameInstant(timeZoneId).toLocalDateTime());

                invitedMeetups.add(meetup);
            }
        }
        return invitedMeetups;
    }

//    @GetMapping("/api/viewMeetupInvitesOut/{username}")
//    public List<Optional<Meeting>> fetchMeetupOutRequests(@PathVariable String username,
//                                                         @RequestHeader("timezone") String timeZone) {
//        List<MeetupInvite> meetupInvites = meetupInvitesService.getInvites(username);
//        List<Long> meetupTitles = new ArrayList<>();
//        List<Optional<Meeting>> invitedMeetups = new ArrayList<>();
//
//        for(MeetupInvite mi : meetupInvites) {
//            if(mi.getCreator().equals(username)) {
//                meetupTitles.add(mi.getMeetupId());
//            }
//        }
//
//        ZoneId timeZoneId = ZoneId.of(timeZone);
//        for(Long id : meetupTitles) {
//            Optional<Meeting> meetup = meetingService.findById(id);
//
//            if(meetup.isPresent()) {
//                meetup.get().setStartDate(meetup.get().getStartDate().atZone(ZoneId.of("UTC")).withZoneSameInstant(timeZoneId).toLocalDateTime());
//                meetup.get().setEndDate(meetup.get().getEndDate().atZone(ZoneId.of("UTC")).withZoneSameInstant(timeZoneId).toLocalDateTime());
//
//                invitedMeetups.add(meetup);
//            }
//        }
//        return invitedMeetups;
//    }

    @GetMapping("/api/viewMeetupInvitesOut/{username}")
    public List<MeetupInvite> fetchMeetupOutRequests(@PathVariable String username,
                                                          @RequestHeader("timezone") String timeZone) {
        List<MeetupInvite> meetupInvites = meetupInvitesService.getInvites(username);
        List<MeetupInvite> outgoingMeetups = new ArrayList<>();

        for(MeetupInvite mi : meetupInvites) {
            if(mi.getCreator().equals(username)) {
                outgoingMeetups.add(mi);
            }
        }

        return outgoingMeetups;
    }

    @RequestMapping(
            value = "/api/removeMeetupInvitation",
            method = RequestMethod.POST,
            consumes = "application/json",
            produces = "application/json"
    )
    public ResponseEntity<String> removeMeetupRequest(@RequestBody MeetupInvite meetupInvite) {
        System.out.println("*******" + meetupInvite.getCreator() + " " + meetupInvite.getInvitee() + " " + meetupInvite.getMeetupId());
        meetupInvitesService.deleteMeetupInvite(meetupInvite.getCreator(), meetupInvite.getInvitee(), meetupInvite.getMeetupId());
        return ResponseEntity.ok("Meetup request removed");
    }

    @RequestMapping(
            value = "/api/getMeetupInvitees/{meetupId}",
            method = RequestMethod.GET,
            produces = "application/json"
    )
    public List<User> getMeetupInvitees(@PathVariable Long meetupId) {
        List<MeetupInvite> meetupInvites = meetupInvitesService.findAll();
        List<User> invitees = new ArrayList<User>();

        for(MeetupInvite mi : meetupInvites) {
            if(Objects.equals(mi.getMeetupId(), meetupId)){
                invitees.add(userService.findByUsernameExists(mi.getInvitee()));
            }
        }

        return invitees;
    }
}
