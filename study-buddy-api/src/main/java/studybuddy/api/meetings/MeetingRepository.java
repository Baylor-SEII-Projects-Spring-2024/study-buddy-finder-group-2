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
            "WHERE u.username IN (" +
            "    SELECT c.requested FROM connection c WHERE c.requester = (" +
            "        SELECT username FROM users WHERE user_id = ?1" +
            "    ) AND c.is_connected = true " +
            "    UNION " +
            "    SELECT c.requester FROM connection c WHERE c.requested = (" +
            "        SELECT username FROM users WHERE user_id = ?1" +
            "    ) AND c.is_connected = true " +
            ") AND m.meeting_id NOT IN (" +
            "    SELECT mu2.meeting_id FROM meetups_users mu2 WHERE mu2.user_id = ?1" +
            ") ORDER BY RAND() LIMIT 3", nativeQuery = true)
    public List<Meeting> recommendMeetupsWithConnections(long id);

    @Query(value = "SELECT DISTINCT m.* FROM meetings m " +
            "JOIN meetups_users mu ON m.meeting_id = mu.meeting_id " +
            "JOIN users u ON u.user_id = mu.user_id " +
            "WHERE EXISTS (" +
            "    SELECT 1 FROM users_courses uc " +
            "    JOIN users_courses uc2 ON uc.course_id = uc2.course_id " +
            "    WHERE uc.username = u.user_id " +
            "    AND uc2.username = ?1" +
            ") " +
            "AND m.meeting_id NOT IN (" +
            "    SELECT mu2.meeting_id FROM meetups_users mu2 WHERE mu2.user_id = ?1" +
            ") " +
            "ORDER BY RAND() " +
            "LIMIT 3", nativeQuery = true)
    public List<Meeting> recommendMeetingsFromSameCourse(long userId);

    @Query(value = "SELECT DISTINCT m.* FROM meetings m " +
            "JOIN meetups_users mu ON m.meeting_id = mu.meeting_id " +
            "JOIN users u ON u.user_id = mu.user_id " +
            "JOIN users_courses uc ON u.user_id = uc.username " +
            "JOIN courses c ON uc.course_id = c.course_id " +
            "WHERE c.course_prefix IN (" +
            "    SELECT c2.course_prefix FROM users_courses uc2 " +
            "    JOIN courses c2 ON uc2.course_id = c2.course_id " +
            "    WHERE uc2.username = ?1" +
            ") " +
            "AND m.meeting_id NOT IN (" +
            "    SELECT mu2.meeting_id FROM meetups_users mu2 WHERE mu2.user_id = ?1" +
            ") " +
            "ORDER BY RAND() " +
            "LIMIT 3", nativeQuery = true)
    public List<Meeting> recommendMeetingsFromSameCoursePrefix(long userId);

    @Query(value = "SELECT DISTINCT m.* FROM meetings m " +
            "WHERE m.meeting_id NOT IN (" +
            "    SELECT mu.meeting_id FROM meetups_users mu WHERE mu.user_id = ?1" +
            ") " +
            "ORDER BY RAND() " +
            "LIMIT 3", nativeQuery = true)
    public List<Meeting> findRandomMeetingsNotAttending(long userId);
}
