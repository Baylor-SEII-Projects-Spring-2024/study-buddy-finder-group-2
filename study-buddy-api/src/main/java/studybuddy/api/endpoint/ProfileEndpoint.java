package studybuddy.api.endpoint;

import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import studybuddy.api.meetings.Meeting;
import studybuddy.api.profile.Profile;
import studybuddy.api.profile.ProfileService;
import studybuddy.api.user.User;
import studybuddy.api.user.UserService;

import java.io.IOException;
import java.util.Arrays;
import java.util.Optional;

@Log4j2
@RestController
//@CrossOrigin(origins = "http://localhost:3000") // for local testing
@CrossOrigin(origins = "http://34.16.169.60:3000")
public class ProfileEndpoint {
    @Autowired
    private UserService userService;
    @Autowired
    private ProfileService profileService;

    @GetMapping("/me/{username}")
    public Optional<User> getUser(@PathVariable String username) {
        return userService.findByUsername(username);
    }

    @GetMapping("/profile/{username}")
    public Optional<Profile> getProfile(@PathVariable String username) {
        //create profile for authorized user if first time viewing profile
        if(!profileService.findByUsername(username).isPresent()){
            Profile p = new Profile();

            p.setUsername(username);
            p.setBio("");
            profileService.save(p);
        }

        return profileService.findByUsername(username);
    }

    @RequestMapping(
            value = "/me",
            method = RequestMethod.PUT,
            consumes = "application/json",
            produces = "application/json"
    )
    public ResponseEntity<Profile> updateProfile(@RequestBody Profile profile) {
        Optional<Profile> oldProfile = profileService.findById(profile.getId());

        if(oldProfile.isPresent()){
            return ResponseEntity.ok(profileService.save(profile));
        }
        else{
            return ResponseEntity.badRequest().build();
        }
    }
}
