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
    @Query(value = "DELETE FROM connection c WHERE (c.requester = ?1 AND c.requested = ?2) OR (c.requester = ?2 AND c.requested = ?1)", nativeQuery = true)
    public void deleteConnection(String thisUser, String otherUser);

    @Query(value = "SELECT * FROM connection c WHERE (c.requester = ?1 AND c.requested = ?2) " +
            "OR (c.requester = ?2 AND c.requested = ?1)", nativeQuery = true)
    public Optional<Connection> findConnection(String requester, String requested);

    @Query(value = "SELECT * FROM connection c WHERE (c.requester = ?1 AND c.requested = ?2) " +
            "OR (c.requester = ?2 AND c.requested = ?1)", nativeQuery = true)
    public Connection getConnection(String requester, String requested);

    @Query(value = "SELECT * FROM connection c WHERE (c.requester = ?1 OR c.requested = ?1) AND c.is_connected = true", nativeQuery = true)
    public List<Connection> getConnections(String username);

    @Query(value = "SELECT * FROM connection c WHERE (c.requester = ?1 OR c.requested = ?1) AND c.is_connected = false", nativeQuery = true)
    public List<Connection> getRequests(String username);

}