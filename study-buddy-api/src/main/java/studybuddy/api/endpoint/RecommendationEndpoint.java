package studybuddy.api.endpoint;

import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import studybuddy.api.user.User;
import studybuddy.api.user.UserService;

import java.util.List;

@Log4j2
@RestController
@CrossOrigin(origins = "http://34.16.169.60:3000") // Adjust as necessary
//@CrossOrigin(origins = "http://localhost:3000") // Adjust as necessary
public class RecommendationEndpoint {

    @Autowired
    private UserService userService;

    @GetMapping("/api/recommendations")
    public ResponseEntity<List<User>> recommendUsers(@RequestParam String username) {
        System.out.println("Recommendations for user: " + username);
        User loggedInUser = userService.findByUsername(username).get();
        List<User> recommendedUsers = userService.recommendUsersForUser(loggedInUser.getId());

        if (recommendedUsers.isEmpty()) {
            log.info("No recommendations found for user id: {}", loggedInUser.getUsername());
            return ResponseEntity.noContent().build();
        }
        else {
            for (User user : recommendedUsers) {
                log.info("Recommended user: {}", user.getUsername());
            }
        }

        return ResponseEntity.ok(recommendedUsers);
    }
}
