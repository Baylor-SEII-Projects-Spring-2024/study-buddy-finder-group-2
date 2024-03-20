package studybuddy.api.profile;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import studybuddy.api.meetings.Meeting;
import studybuddy.api.meetings.MeetingRepository;

import java.util.Optional;

@Service
public class ProfileService {
    @Autowired
    private ProfileRepository profileRepository;

    public Optional<Profile> findByUsername(String username){
        return profileRepository.findByUsername(username);
    }

    public Optional<Profile> findById(Long id){
        return profileRepository.findById(id);
    }

    public Profile save(Profile profile) {
        return profileRepository.save(profile);
    }
}
