package studybuddy.api.endpoint;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import studybuddy.api.user.User;
import studybuddy.api.user.UserService;
import studybuddy.api.rating.Rating;
import studybuddy.api.rating.RatingService;


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
        String meetingTitle = rating.getMeetingTitle();
        if (ratingUser.isPresent() & ratedUser.isPresent()){
            Rating savedRating = ratingService.saveRating(new Rating(meetingTitle, ratingUser, ratedUser, rating.getScore(),rating.getReview()));
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


    @GetMapping("/ratingsBetween")
    public ResponseEntity<List<Rating>> ratingsBetween(
            @RequestParam String ratedUser,
            @RequestParam String ratingUser){
        User rated = userService.findByUsername(ratedUser).orElse(null);
        System.out.println("finding " + ratedUser);
        if (rated == null) {
            log.warn("User not found");
            return ResponseEntity.badRequest().build();
        }
        User rating = userService.findByUsername(ratingUser).orElse(null);
        System.out.println("finding " + ratingUser);
        if (rating == null) {
            log.warn("User not found");
            return ResponseEntity.badRequest().build();
        }
        List<Rating> ratings = ratingService.getRatingsBetween(rated.getUsername(), rating.getUsername());
        for (Rating r : ratings) {
            System.out.println("ID is " + r.getRatingId());
            System.out.println("User who is rated is " + r.getRatedUser());
            System.out.println("User who is rating is " + r.getRatingUser());
        }
        return ResponseEntity.ok(ratings);
    }
    @GetMapping("/ratingsPendingBetween")
    public ResponseEntity<List<Rating>> ratingsPendingBetween(
            @RequestParam String ratedUser,
            @RequestParam String ratingUser){
        User rated = userService.findByUsername(ratedUser).orElse(null);
        System.out.println("finding " + ratedUser);
        if (rated == null) {
            log.warn("User not found");
            return ResponseEntity.badRequest().build();
        }
        User rating = userService.findByUsername(ratingUser).orElse(null);
        System.out.println("finding " + ratingUser);
        if (rating == null) {
            log.warn("User not found");
            return ResponseEntity.badRequest().build();
        }
        List<Rating> ratings = ratingService.getPendingRatingsBetween(rated.getUsername(), rating.getUsername());
        for (Rating r : ratings) {
            System.out.println("ID is " + r.getRatingId());
            System.out.println("User who is rated is " + r.getRatedUser());
            System.out.println("User who is rating is " + r.getRatingUser());
        }
        return ResponseEntity.ok(ratings);
    }
    @GetMapping("/newRatings/{username}")
    public ResponseEntity<List<Rating>> newRatings(@PathVariable String username) {
        User ratingUser = userService.findByUsername(username).orElse(null);
        System.out.println("finding " + username);
        if (ratingUser == null) {
            log.warn("User not found");
            return ResponseEntity.badRequest().build();
        }


        List<Rating> ratings = ratingService.getUnsubmittedRatings(ratingUser.getUsername());

        for (Rating r : ratings) {
            System.out.println("ID is " + r.getRatingId());
            System.out.println("User who you rated is " + r.getRatedUser());
            if (r.getReview() != null) {
                System.out.println("Review is " + r.getReview());
            }


        }
        return ResponseEntity.ok(ratings);
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
            System.out.println("Rating is " + r.getScore());
            if (r.getReview() != null) {
                System.out.println("Review is " + r.getReview());
            }



        }
        return ResponseEntity.ok(ratings);
    }
    @GetMapping("/averageRating/{username}")
    public ResponseEntity<Double> getAvgRating(@PathVariable String username){
        System.out.println("finding " + username);
        User ratedUser = userService.findByUsername(username).orElse(null);
        if (ratedUser == null) {
            log.warn("User not found");
            return ResponseEntity.badRequest().build();
        }


        Double avgScore = ratingService.getRatingScore(ratedUser.getUsername());
        System.out.println("average rating is " + avgScore);
        return ResponseEntity.ok(avgScore);
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
        List<Rating> ratings = ratingService.getRatingsForMe(ratedUser.getUsername());

        for(Rating r : ratings) {

            System.out.println("ID is " + r.getRatingId());
            System.out.println("User rated you is " + r.getRatingUser());
            System.out.println("Rating is " + r.getScore());
            if (r.getReview() != null) {
                System.out.println("Review is " + r.getReview());
            }


        }
        return ResponseEntity.ok(ratings);
    }
    @RequestMapping(
            value = "/updateRating/{ratingId}",
            method = RequestMethod.PUT,
            consumes = "application/json",
            produces = "application/json"
    )
    public ResponseEntity<Rating> updateRating(@PathVariable long ratingId, @RequestBody Rating updatedRating) {
        // Find the existing rating by its ID
        Optional<Rating> existingRating = ratingService.findRatingByID(ratingId);

        if (existingRating.isPresent()) {
            // Update the existing rating with the new data
            Rating ratingToUpdate = existingRating.get();
            ratingToUpdate.setScore(updatedRating.getScore());
            ratingToUpdate.setReview(updatedRating.getReview());

            // Save the updated rating
            Rating savedRating = ratingService.saveRating(ratingToUpdate);

            // Return the updated rating in the response
            return ResponseEntity.ok(savedRating);
        } else {
            // If the rating with the given ID doesn't exist, return a bad request response
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/deleteRating/{id}")
    public void deleteRating(@PathVariable Long id) {
        ratingService.deleteRating(id);
    }
}
