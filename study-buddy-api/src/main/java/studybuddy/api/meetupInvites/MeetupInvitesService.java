package studybuddy.api.meetupInvites;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MeetupInvitesService {
    @Autowired
    private MeetupInvitesRepository meetupInvitesRepository;

    public MeetupInvite save(MeetupInvite meetupInvite) {
        return meetupInvitesRepository.save(meetupInvite);
    }

    public Optional<MeetupInvite> find(String creator, String invitee, boolean isJoined, Long meetupId){
        return meetupInvitesRepository.find(creator, invitee, isJoined, meetupId);
    }

    public List<MeetupInvite> findAll(){
        return meetupInvitesRepository.findAll();
    }
    public List<MeetupInvite> getInvites(String username){
        return meetupInvitesRepository.getInvites(username);
    }

    public void deleteMeetupInvite(String thisUser, String otherUser, Long meetupId){
        meetupInvitesRepository.deleteMeetupInvite(thisUser,otherUser, meetupId);
    }

    public List<String> getInvitees(String creator, Long meetupId){
        return meetupInvitesRepository.getInvitees(creator, meetupId);
    }
}
