package studybuddy.api.meetings;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MeetingService {
    @Autowired
    private MeetingRepository meetingRepository;

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
}
