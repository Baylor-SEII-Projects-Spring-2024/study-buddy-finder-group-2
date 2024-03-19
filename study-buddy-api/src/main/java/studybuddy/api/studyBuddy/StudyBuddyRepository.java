package studybuddy.api.studyBuddy;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import studybuddy.api.studyBuddy.StudyBuddy;

import java.util.List;

@Repository
public interface StudyBuddyRepository  extends JpaRepository<StudyBuddy, Long> {
    @Modifying
    @Transactional
    @Query(value = "DELETE FROM studyBuddies WHERE (requester = ?1 AND receiver = ?2) OR (requester = ?2 AND receiver = ?1)", nativeQuery = true)
    public void deleteStudyBuddy(String thisUser, String otherUser);


    @Query(value = "SELECT s1.requester FROM studyBuddies s1 WHERE " +
            "s1.receiver = ?1 AND EXISTS (SELECT * FROM studyBuddies s2 WHERE " +
            "s1.requester = s2.receiver AND s1.receiver = s2.requester",
            nativeQuery = true)
    public List<String> getStudyBuddies(String thisUser);

    @Query(value = "SELECT s1.requester FROM studyBuddies WHERE s1.receiver = ?1" +
            " AND NOT EXISTS SELECT * FROM studyBuddies s2" +
            " WHERE s1.requester = s2.receiver" +
            " AND s1.receiver = s2.requester", nativeQuery = true)
    public List<String> getStudyBuddyRequesters(String thisUser);

    @Query(value = "SELECT s1.receiver FROM studyBuddies s1 WHERE NOT EXISTS SELECT " +
            "* FROM studyBuddies s2 WHERE s1.receiver = s2.requester AND s1.requester = " +
            "s2.receiver", nativeQuery = true)
    public List<String> getStudyBuddyRequests(String thisUser);

}
