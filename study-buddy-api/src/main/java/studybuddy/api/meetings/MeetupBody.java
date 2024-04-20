package studybuddy.api.meetings;

import studybuddy.api.user.User;
import lombok.Data;

import java.util.List;

// just used for doing the request body in meetupEndpoint - createMeeting

@Data
public class MeetupBody {
    private Meeting meeting;
    private List<User> invites;
}