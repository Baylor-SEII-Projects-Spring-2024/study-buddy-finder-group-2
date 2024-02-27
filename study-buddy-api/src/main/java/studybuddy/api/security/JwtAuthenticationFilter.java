package studybuddy.api.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;
import studybuddy.api.user.User;

import java.io.IOException;

public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtGenerator jwtGenerator;

    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    // link in filter chain that checks if there is a token in the header
    // form of middleware??
    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String token = getJWTFromRequest(request);
        if(StringUtils.hasText(token) && jwtGenerator.validateToken(token)) {
            String username = jwtGenerator.getUsernameFromJwt(token);

            // make user details
            UserDetails userDetails = customUserDetailsService.loadUserByUsername(username);
            // create token
            UsernamePasswordAuthenticationToken authenticationToken =
                    new UsernamePasswordAuthenticationToken(userDetails,
                            null,
                            userDetails.getAuthorities());
            // set the details
            authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authenticationToken);
        }
        // reaches next filter in chain
        filterChain.doFilter(request, response);

    }

    private String getJWTFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if(StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            // the count after reading "Bearer " is 7
            return bearerToken.substring(7, bearerToken.length());
        }

        return null;
    }
}
