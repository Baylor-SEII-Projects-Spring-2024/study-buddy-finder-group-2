package studybuddy.api.meetupInvites;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface MeetupInvitesRepository extends JpaRepository<MeetupInvite, Long> {
    @Query(value = "SELECT * FROM meetup_invites m WHERE (m.creator = ?1 OR m.invitee = ?1) AND m.is_joined = false", nativeQuery = true)
    public List<MeetupInvite> getInvites(String username);

    @Query(value = "SELECT * FROM meetup_invites m WHERE m.creator = ?1 AND m.invitee = ?2 AND m.is_joined = ?3 AND m.meetup_id = ?4", nativeQuery = true)
    public Optional<MeetupInvite> find(String creator, String invitee, boolean isJoined, Long meetupId);

    @Query(value = "SELECT m.invitee FROM meetup_invites m WHERE m.creator = ?1 AND m.meetup_id = ?2", nativeQuery = true)
    public List<String> getInvitees(String creator, Long meetupId);

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM meetup_invites m WHERE ((m.creator = ?1 AND m.invitee = ?2) OR (m.creator = ?2 AND m.invitee = ?1)) AND m.meetup_id = ?3", nativeQuery = true)
    public void deleteMeetupInvite(String thisUser, String otherUser, Long meetupId);
}
