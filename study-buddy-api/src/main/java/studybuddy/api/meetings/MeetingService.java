package studybuddy.api.meetings;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import studybuddy.api.connection.Connection;
import studybuddy.api.connection.ConnectionService;
import studybuddy.api.course.Course;
import studybuddy.api.course.CourseService;
import studybuddy.api.user.UserService;
import studybuddy.api.user.User;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class MeetingService {
    @Autowired
    private MeetingRepository meetingRepository;

    @Autowired
    private ConnectionService connectionService;

    @Autowired
    private CourseService courseService;

    @Autowired
    private UserService UserService;

    public Meeting save(Meeting meeting) {
        return meetingRepository.save(meeting);
    }

    public void delete(Long meetingId){ meetingRepository.deleteById(meetingId);}

    public Optional<Meeting> findById(Long meetingId){
        return meetingRepository.findById(meetingId);
    }

    public List<Meeting> findAll(){
        return meetingRepository.findAll();
    }

    public List<Meeting> findByUsername(String username){
        return meetingRepository.findByUsername(username);
    }

    public List<Meeting> findByTitle(String title){
        return meetingRepository.findByTitle(title);
    }

    public List<Meeting> findByTitleAndCourse(String title, String course){
        return meetingRepository.findByTitleAndCourse(title, course);
    }

    // finds all meetup ids where user is just an attendee
    public List<Long> findByUserId(long id){
        return meetingRepository.findByUserId(id);
    }

    public void saveMeetupUser(long userId, long meetupId){
        meetingRepository.saveMeetupUser(userId, meetupId);
    }

    public List<Meeting> recommendMeetupsForUser(long id) {
        List<Meeting> potentialMeetings = meetingRepository.findAllPotentialMeetings(id);
        if (potentialMeetings.isEmpty()) {
            return Collections.emptyList();
        }

        //filter out expired meetings
        potentialMeetings = potentialMeetings.stream()
                .filter(meeting -> meeting.getStartDate().isAfter(LocalDateTime.now()))
                .collect(Collectors.toList());

        Optional<User> curUser = UserService.findUser(id);
        if (curUser.isEmpty()) {
            return Collections.emptyList();
        }

        String curUsername = curUser.get().getUsername();
        Map<Meeting, Integer> meetingScores = potentialMeetings.stream()
                .collect(Collectors.toMap(meeting -> meeting, meeting -> calculateMeetingScore(meeting, curUsername)));

        return meetingScores.entrySet().stream()
                .sorted(Map.Entry.comparingByValue(Comparator.reverseOrder()))
                .limit(3)
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());
    }

    private int calculateMeetingScore(Meeting meeting, String username) {
        int score = 0;
        Set<Course> userCourses = courseService.getCoursesOfUserByUsername(username);
        List<Connection> userConnections = connectionService.getConnections(username);

        Set<Long> userCourseIds = userCourses.stream().map(Course::getCourseId).collect(Collectors.toSet());
        Set<String> connectionUsernames = userConnections.stream()
                .map(connection -> connection.getRequested().equals(username) ? connection.getRequester() : connection.getRequested())
                .collect(Collectors.toSet());

        for (User attendee : meeting.getAttendees()) {
            if (connectionUsernames.contains(attendee.getUsername())) {
                score += 5;
            }
        }
        
        for (User attendee : meeting.getAttendees()) {
            Set<Course> attendeeCourses = courseService.getCoursesOfUserByUsername(attendee.getUsername());
            for (Course course : attendeeCourses) {
                if (userCourseIds.contains(course.getCourseId())) {
                    score += 2;
                    break;
                }
            }
        }

        return score;
    }

    public void deleteMeetupUser(long meetingId){
        meetingRepository.deleteMeetupUser(meetingId);
    }

    public void leaveMeetup(long userId, long meetingId){
        meetingRepository.leaveMeetup(userId, meetingId);
    }
}
