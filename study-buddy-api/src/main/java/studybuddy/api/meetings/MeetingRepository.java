package studybuddy.api.meetings;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import studybuddy.api.user.User;

import java.util.Optional;

public interface MeetingRepository extends JpaRepository<Meeting, Long> {
}
