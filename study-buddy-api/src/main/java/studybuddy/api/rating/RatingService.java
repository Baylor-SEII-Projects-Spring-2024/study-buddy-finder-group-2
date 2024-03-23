package studybuddy.api.rating;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import studybuddy.api.connection.Connection;

import java.util.List;
import java.util.Optional;
import studybuddy.api.user.User;
@Service
public class RatingService {
    @Autowired
    private RatingRepository ratingRepository;
    public void deleteRating(Long id){ratingRepository.deleteRating(id);}

    public Double getRatingScore(User targetUser){
        return ratingRepository.getRatingScore(targetUser);}

    public List<Rating> getRatingsForMe(User thisUser){
        return ratingRepository.getRatingsForMe(thisUser);}
    public List<Rating> getMyRatings(User thisUser){
        return ratingRepository.getMyRatings(thisUser);}

    public Rating saveRating(Rating rating) {
        return ratingRepository.save(rating);
    }

    public Optional<Rating> findRatingByID(Long id){return ratingRepository.findRatingByID(id);}
}
