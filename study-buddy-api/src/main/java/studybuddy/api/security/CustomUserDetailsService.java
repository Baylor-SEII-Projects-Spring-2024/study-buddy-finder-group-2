package studybuddy.api.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import studybuddy.api.role.Role;
import studybuddy.api.user.User;
import studybuddy.api.user.UserRepository;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private UserRepository userRepository;

    @Autowired
    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // TODO: idk how user.getRoles() works on his side
    // maybe because his UserEntity is set up differently than our User
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Doing this so I can go push to my branch and GO TO SLEEP
        /*User user = userRepository
                .findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Username NOT found"));

        return new User(user.getUsername(), user.getPassword(), mapRolesToAuthorities(user.getRoles()));*/
        return null;

    }

    private Collection<GrantedAuthority> mapRolesToAuthorities(List<Role> roles) {
        return roles
                .stream()
                .map(role -> new SimpleGrantedAuthority(role.getName()))
                .collect(Collectors.toList());
    }
}
