package studybuddy.api.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import studybuddy.api.dto.AuthResponseDto;
import studybuddy.api.dto.LoginDto;
import studybuddy.api.dto.RegisterDto;
import studybuddy.api.security.JwtGenerator;
import studybuddy.api.user.User;
import studybuddy.api.user.UserService;

@RestController
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
    public ResponseEntity<AuthResponseDto> login(@RequestBody LoginDto loginDto) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginDto.getUsername(),
                        loginDto.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(auth);
        String token = jwtGenerator.generateToken(auth);
        return new ResponseEntity<>(new AuthResponseDto(token), HttpStatus.OK);
    }

    @PostMapping("register")
    public ResponseEntity<String> register(@RequestBody RegisterDto registerDto) {
        if(!userService.findByUsername(registerDto.getUsername()).isEmpty()) {
            return new ResponseEntity<>("Username is taken!", HttpStatus.BAD_REQUEST);
        }

        User user = new User();
        user.setUsername(registerDto.getUsername());
        user.setPassword(passwordEncoder.encode(registerDto.getPassword()));
        // set all attributes

        userService.saveUser(user);
        return new ResponseEntity<>("User is registered!", HttpStatus.OK);
    }
}
