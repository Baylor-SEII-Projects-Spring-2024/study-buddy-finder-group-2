package studybuddy.api.endpoint;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import studybuddy.api.meetings.Meeting;
import studybuddy.api.user.User;
import studybuddy.api.user.UserService;
import studybuddy.api.rating.Rating;
import studybuddy.api.rating.RatingService;


import java.util.ArrayList;
import java.util.List;
import java.util.Optional;


@Log4j2
@RestController
//@CrossOrigin(origins = "http://localhost:3000") // for local testing
@CrossOrigin(origins = "http://34.16.169.60:3000")
public class RatingsEndpoint {
    @Autowired
    private RatingService ratingService;
    @Autowired
    private UserService userService;

    @RequestMapping(
            value = "/makeRating",
            method = RequestMethod.POST,
            consumes = "application/json",
            produces = "application/json"
    )
    public ResponseEntity<Rating> createRating(@RequestBody Rating rating) {
        Optional<User> ratingUser = userService.findByUsername(rating.getRatingUser().getUsername());
        Optional<User> ratedUser = userService.findByUsername(rating.getRatedUser().getUsername());
        if (ratingUser.isPresent() & ratedUser.isPresent()){
            Rating savedRating = ratingService.saveRating(new Rating(ratingUser, ratedUser, rating.getRating(),rating.getReview()));
            return ResponseEntity.ok(savedRating);
        }
        if (ratingUser.isEmpty()) {
            log.warn("ratingUser not found");
        }
        if (ratedUser.isEmpty()) {
            log.warn("ratedUser not found");
        }
        return ResponseEntity.badRequest().build();
    }

    @RequestMapping(
            value = "/updateRating/{username}",
            method = RequestMethod.PUT,
            consumes = "application/json",
            produces = "application/json"
    )
    public ResponseEntity<Rating> updateRating(@RequestBody Rating rating) {
        Optional<Rating> oldRating = ratingService.findRatingByID(rating.getRatingId());

        if(oldRating.isPresent()){
            return ResponseEntity.ok(ratingService.saveRating(rating));
        }
        else{
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/viewMadeRatings/{username}")
    public ResponseEntity<List<Rating>> fetchMyRatings(@PathVariable String username) {
        User ratingUser = userService.findByUsername(username).orElse(null);
        System.out.println("finding " + username);
        if (ratingUser == null) {
            log.warn("User not found");
            return ResponseEntity.badRequest().build();
        }


        List<Rating> ratings = ratingService.getMyRatings(ratingUser.getUsername());

        for(Rating r : ratings) {
            System.out.println("ID is " + r.getRatingId());
            System.out.println("User who you rated is " + r.getRatedUser());
            System.out.println("Rating is " + r.getRating());
            if (r.getReview() != null) {
                System.out.println("Review is " + r.getReview());
            }



        }
        return ResponseEntity.ok(ratings);
    }

    @GetMapping("/viewRating/{ratingId}")
    public Optional<Rating> getRating(@PathVariable long ratingId) {
        return ratingService.findRatingByID(ratingId);
    }

    @GetMapping("/viewRatingsForMe/{username}")
    public ResponseEntity<List<Rating>> fetchRatingsForMe(@PathVariable String username) {
        User ratedUser = userService.findByUsername(username).orElse(null);
        System.out.println("finding " + username);
        if (ratedUser == null) {
            log.warn("User not found");
            return ResponseEntity.badRequest().build();
        }
        List<Rating> ratings = ratingService.getMyRatings(ratedUser.getUsername());

        for(Rating r : ratings) {

            System.out.println("ID is " + r.getRatingId());
            System.out.println("User rated you is " + r.getRatingUser());
            System.out.println("Rating is " + r.getRating());
            if (r.getReview() != null) {
                System.out.println("Review is " + r.getReview());
            }


        }
        return ResponseEntity.ok(ratings);
    }

    @DeleteMapping("/deleteRating/{id}")
    public void deleteRating(@PathVariable Long id) {
        ratingService.deleteRating(id);
    }
}
