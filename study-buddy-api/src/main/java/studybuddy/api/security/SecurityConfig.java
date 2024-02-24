package studybuddy.api.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // deviates from tutorial because of method deprecation
                // TODO: research different matchers more
                // antMatchers?? (non-existent)
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/token/**").permitAll()
                        .anyRequest().authenticated()
                )
                .httpBasic(Customizer.withDefaults());

        return http.build();
    }

    // NOTES
    // Authentication: you can login and use the software
    // Users: authentication based

    // Authorization: restricted access in the software
    // Roles: authorization based

    // Granted Authorities: more "granular" form of roles

    @Bean
    public UserDetailsService users() {
        UserDetails student = User.builder()
                .username("student")
                .password("password")
                .roles("STUDENT")
                .build();

        UserDetails tutor = User.builder()
                .username("tutor")
                .password("password")
                .roles("TUTOR")
                .build();

        /* May use this instead of the 2
        UserDetails user = User.builder()
                .username("user")
                .password("password")
                .roles("user")
                .build();
        */

        return new InMemoryUserDetailsManager(student, tutor);
    }
}
