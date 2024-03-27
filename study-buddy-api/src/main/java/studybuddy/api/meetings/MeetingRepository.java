package studybuddy.api.meetings;

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
    @Query(value = "INSERT INTO meetups_users (user_id, meeting_id) VALUES (?1, ?2)", nativeQuery = true)
    @Modifying
    public void saveMeetupUser(long userId, long meetingId);
}
