package studybuddy.api.meetings;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

public interface MeetingRepository extends JpaRepository<Meeting, Long> {
    @Query(value = "SELECT * FROM meetings m WHERE m.username = ?1", nativeQuery = true)
    public List<Meeting> findByUsername(String username);
}
