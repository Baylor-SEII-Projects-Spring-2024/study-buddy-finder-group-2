package studybuddy.api.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtGenerator {

    public String generateToken(Authentication auth) {
        String username = auth.getName();
        Date currentDate = new Date();
        Date expireDate = new Date(currentDate.getTime() + SecurityConstants.JWT_EXPIRATION);

        // creates token using secret string
        String token = Jwts.builder()
                .setSubject(username)
                .setIssuedAt(currentDate)
                .setExpiration(expireDate)
                .signWith(SignatureAlgorithm.HS256, SecurityConstants.JWT_SECRET)
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
