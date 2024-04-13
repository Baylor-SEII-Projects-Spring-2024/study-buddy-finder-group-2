package studybuddy.api.profile;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.util.Optional;

public interface ProfileRepository extends JpaRepository<Profile, Long> {
    @Query(value = "SELECT * FROM profiles p WHERE p.username = ?1", nativeQuery = true)
    public Optional<Profile> findByUsername(String username);
}
