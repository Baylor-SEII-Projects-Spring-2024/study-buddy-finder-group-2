package studybuddy.api.connection;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConnectionRepository  extends JpaRepository<Connection, Long> {
    @Modifying
    @Transactional
    @Query(value = "DELETE FROM connection WHERE (requester = ?1 AND to = ?2) OR (requester = ?2 AND to = ?1)", nativeQuery = true)
    public void deleteStudyBuddy(String thisUser, String otherUser);


    @Query(value = "SELECT s1.requester FROM connection s1 WHERE " +
            "s1.to = ?1 AND EXISTS (SELECT * FROM connection s2 WHERE " +
            "s1.requester = s2.requested AND s1.requested = s2.requester)",
            nativeQuery = true)
    public List<String> getStudyBuddies(String thisUser);

    @Query(value = "SELECT s1.requester FROM connection WHERE s1.to = ?1" +
            " AND NOT EXISTS (SELECT * FROM connection s2" +
            " WHERE s1.requester = s2.requested" +
            " AND s1.requested = s2.requester)", nativeQuery = true)
    public List<String> getStudyBuddyRequesters(String thisUser);

    @Query(value = "SELECT s1.to FROM connection s1 WHERE NOT EXISTS (SELECT " +
            "* FROM connection s2 WHERE s1.requested = s2.requester AND s1.requester = " +
            "s2.requested)", nativeQuery = true)
    public List<String> getStudyBuddyRequests(String thisUser);

    @Query(value = "SELECT * FROM connection c WHERE (c.requester = ?1 AND c.requested = ?2) " +
            "OR (c.requester = ?2 AND c.requested = ?1)", nativeQuery = true)
    public Optional<Connection> findConnection(String requester, String requested);

    @Query(value = "SELECT * FROM connection c WHERE (c.requester = ?1 OR c.requested = ?1) AND c.isConnected = true", nativeQuery = true)
    public List<Connection> getConnections(String username);
}