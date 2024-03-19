package studybuddy.api.studyBuddy;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import studybuddy.api.StudyBuddyApplication;
import studybuddy.api.school.School;

import java.util.List;
@Service
public class StudyBuddyService {
    @Autowired
    StudyBuddyRepository studyBuddyRepository;
    public void deleteStudyBuddy(String thisUser, String otherUser){studyBuddyRepository.deleteStudyBuddy(thisUser,otherUser);}
    public List<String> getStudyBuddies(String thisUser){return studyBuddyRepository.getStudyBuddies(thisUser);}
    public List<String> getStudyBuddyRequesters(String thisUser){return studyBuddyRepository.getStudyBuddyRequesters(thisUser);}
    public List<String> getStudyBuddyRequests(String thisUser){return studyBuddyRepository.getStudyBuddyRequests(thisUser);}
    public StudyBuddy save(StudyBuddy studyBuddy){return studyBuddyRepository.save(studyBuddy);}
}
