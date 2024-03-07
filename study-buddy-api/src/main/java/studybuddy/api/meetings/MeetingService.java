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
}
