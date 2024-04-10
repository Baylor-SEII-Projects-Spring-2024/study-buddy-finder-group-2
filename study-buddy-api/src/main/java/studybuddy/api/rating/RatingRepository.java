package studybuddy.api.rating;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import studybuddy.api.user.User;

import java.util.List;
import java.util.Optional;

public interface RatingRepository extends JpaRepository<Rating, Long> {
    @Modifying
    @Transactional
    @Query(value = "DELETE FROM ratings WHERE rating_id = ?1", nativeQuery = true)
    public void deleteRating(Long id);

    @Query(value = "SELECT * FROM ratings WHERE rating_id = ?1", nativeQuery = true)
    public Optional<Rating> findRatingByID(Long id);

    @Query(value = "SELECT AVG(rating) FROM ratings WHERE ratedUser = ?1 AND rating IS NOT NULL", nativeQuery = true)
    public Double getRatingScore(String targetUser);

    @Query(value = "SELECT * FROM ratings WHERE RATED_USER = ?1 AND rating IS NOT NULL", nativeQuery = true)
    public List<Rating> getRatingsForMe(String thisUser);

    @Query(value = "SELECT * FROM ratings WHERE RATING_USER = ?1 AND rating IS NOT NULL", nativeQuery = true)
    public List<Rating> getMyRatings(String thisUser);

    @Query(value = "SELECT * FROM ratings WHERE RATING_USER = ?1 AND rating IS NULL", nativeQuery = true)
    public List<Rating> getUnsubmittedRatings(String thisUser);
}
