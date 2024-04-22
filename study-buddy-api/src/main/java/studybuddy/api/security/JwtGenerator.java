package studybuddy.api.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;
import studybuddy.api.user.User;

import java.util.Date;

@Component
public class JwtGenerator {

    // token contains username and userType
    // also has an issued at time and expiration
    public String generateToken(Authentication auth, User user) {
        String username = auth.getName();
        Date currentDate = new Date();
        Date expireDate = new Date(currentDate.getTime() + SecurityConstants.JWT_EXPIRATION);

        // creates token using secret string
        String token = Jwts.builder()
                .setSubject(username)
                .setIssuedAt(currentDate)
                .setExpiration(expireDate)
                .signWith(SignatureAlgorithm.HS256, SecurityConstants.JWT_SECRET)
                // custom claims (figure out roles later??)
                .claim("userType", user.getUserType())
                .claim("firstName", user.getFirstName())
                .claim("lastName", user.getLastName())
                .claim("email", user.getEmailAddress())
                // TODO: associate with schools
                //.claim("school", user.getSchool())
                .compact();

        return token;
    }

    // extracts body from token
    public String getUsernameFromJwt(String token) {
        // claims get information from the token
        Claims claims = Jwts.parser()
                .setSigningKey(SecurityConstants.JWT_SECRET)
                .parseClaimsJws(token)
                .getBody();

        return claims.getSubject();
    }

    // get all claims from token
    public User parseToken(String token) {
        User user = new User();

        Claims claims = Jwts.parser()
                .setSigningKey(SecurityConstants.JWT_SECRET)
                .parseClaimsJws(token)
                .getBody();

        user.setUsername(claims.getSubject());
        user.setUserType(claims.get("userType", String.class));
        user.setUserType(claims.get("firstName", String.class));
        user.setUserType(claims.get("lastName", String.class));
        user.setUserType(claims.get("email", String.class));
        //user.setUserType(claims.get("school", String.class));

        System.out.println(user.getFirstName());

        return user;
    }

    // validates token expired/incorrect
    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .setSigningKey(SecurityConstants.JWT_SECRET)
                    .parseClaimsJws(token);
            return true;
        }
        catch (Exception e) {
            throw new AuthenticationCredentialsNotFoundException("JWT was expired or incorrect");
        }
    }
}
