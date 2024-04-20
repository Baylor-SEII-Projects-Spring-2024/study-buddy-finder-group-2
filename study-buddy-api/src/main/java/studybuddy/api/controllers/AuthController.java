package studybuddy.api.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import studybuddy.api.dto.LoginDto;
import studybuddy.api.dto.RegisterDto;
import studybuddy.api.security.JwtGenerator;
import studybuddy.api.user.User;
import studybuddy.api.user.UserService;

@RestController
//@CrossOrigin(origins = "http://localhost:3000") // for local testing
@CrossOrigin(origins = "http://34.16.169.60:3000")
@RequestMapping("/api/authorization")
public class AuthController {
    private AuthenticationManager authenticationManager;
    private UserService userService;
    private PasswordEncoder passwordEncoder;
    private JwtGenerator jwtGenerator;

    @Autowired
    public AuthController(
            AuthenticationManager authenticationManager,
            UserService userService,
            PasswordEncoder passwordEncoder,
            JwtGenerator jwtGenerator) {
        this.authenticationManager = authenticationManager;
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.jwtGenerator = jwtGenerator;
    }

    @PostMapping("login")
    // AuthResponseDto
    public ResponseEntity<String> login(@RequestBody LoginDto loginDto) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginDto.getUsername(),
                        loginDto.getPassword()));

        // get the user from database
        User user = userService.findByUsernameExists(loginDto.getUsername());

        // generate the token
        SecurityContextHolder.getContext().setAuthentication(auth);
        String token = jwtGenerator.generateToken(auth, user);

        return new ResponseEntity<>(token, HttpStatus.valueOf(200));
    }

    @PostMapping("register")
    public ResponseEntity<String> register(@RequestBody RegisterDto registerDto) {
        if(userService.findByUsername(registerDto.getUsername()).isPresent()) {
            return new ResponseEntity<>("Username is taken!", HttpStatus.BAD_REQUEST);
        }

        // set all attributes for user
        // make sure to give user userType and emailAddress!! (no underscores)
        User user = new User();
        user.setUsername(registerDto.getUsername());
        user.setPassword(passwordEncoder.encode(registerDto.getPassword()));
        user.setUserType(registerDto.getUserType());
        user.setFirstName(registerDto.getFirstName());
        user.setLastName(registerDto.getLastName());
        user.setEmailAddress(registerDto.getEmailAddress());
        // TODO: associate school
        //user.setSchool(registerDto.getSchool());

        // save user
        // can't return token because user must be in database already (completed transaction)
        userService.saveUser(user);
        return new ResponseEntity<>(user.getUsername(), HttpStatus.OK);
    }
}
