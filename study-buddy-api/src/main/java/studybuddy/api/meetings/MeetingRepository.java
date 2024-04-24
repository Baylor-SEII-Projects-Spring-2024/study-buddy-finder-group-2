package studybuddy.api.meetings;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface MeetingRepository extends JpaRepository<Meeting, Long> {

    @Query(value = "SELECT * FROM meetings m WHERE m.title LIKE %?1%", nativeQuery = true)
    public List<Meeting> findByTitle(String title);

    @Query(value = "SELECT * FROM meetings m WHERE m.title LIKE %?1% AND m.subject = %?2%", nativeQuery = true)
    public List<Meeting> findByTitleAndCourse(String title, String course);
    @Query(value = "SELECT * FROM meetings m WHERE m.username = ?1", nativeQuery = true)
    public List<Meeting> findByUsername(String username);

    @Query(value = "SELECT m.meeting_id FROM meetups_users m WHERE m.user_id = ?1", nativeQuery = true)
    public List<Long> findByUserId(long id);

    // use this when adding a user into an already created meeting (is an attendee)
    @Transactional
    @Query(value = "INSERT INTO meetups_users (user_id, meeting_id) VALUES (?1, ?2)", nativeQuery = true)
    @Modifying
    public void saveMeetupUser(long userId, long meetingId);


    @Query(value = "SELECT DISTINCT m.* FROM meetings m " +
            "JOIN meetups_users mu ON m.meeting_id = mu.meeting_id " +
            "JOIN users u ON u.user_id = mu.user_id " +
            "WHERE m.meeting_id NOT IN (" +
            "    SELECT mu2.meeting_id FROM meetups_users mu2 WHERE mu2.user_id = ?1" +
            ") ", nativeQuery = true)
    public List<Meeting> findAllPotentialMeetings(long userId);

    @Transactional
    @Query(value = "DELETE FROM meetups_users WHERE meeting_id = ?1", nativeQuery = true)
    @Modifying
    public void deleteMeetupUser(long meetingId);

    @Transactional
    @Query(value = "DELETE FROM meetups_users WHERE user_id = ?1 AND meeting_id = ?2", nativeQuery = true)
    @Modifying
    public void leaveMeetup(long userId, long meetingId);
}
