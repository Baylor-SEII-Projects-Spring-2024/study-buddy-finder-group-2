package studybuddy.api.user;

import jakarta.transaction.Transactional;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("testdb")  // make these tests use the H2 in-memory DB instead of your actual DB
@Transactional             // make these tests revert their DB changes after the test is complete
public class UserTests {
    @Autowired
    private UserService userService;

    @Test
    void testUserCreate() {
        User newUser = new User();
        newUser.userType = "STUDENT";
        newUser.emailAddress = "example@example.com";
        newUser.password = "password";

        User savedUser = userService.saveUser(newUser);
        assertNotNull(savedUser.id);

        Optional<User> foundUserOpt = userService.findUser(savedUser.id);
        assertTrue(foundUserOpt.isPresent());
        User foundUser = foundUserOpt.get();

        assertEquals(newUser.userType, foundUser.userType);
        assertEquals(newUser.emailAddress, foundUser.emailAddress);
        assertEquals(newUser.password, foundUser.password);
        assertEquals(savedUser.id, foundUser.id);
    }

    @Test
    void testUserFind() {
        Optional<User> user1 = userService.findUser(1L);
        assertTrue(user1.isEmpty());
    }

    @Test
    void testFindByEmail() {
        User newUser = new User();
        newUser.userType = "STUDENT";
        newUser.emailAddress = "test_email@test.com";
        newUser.password = "super_secure_password";

        User savedUser = userService.saveUser(newUser);
        assertNotNull(savedUser.id);

        Optional<User> foundUserOpt = userService.findByEmail(newUser.emailAddress);
        assertTrue(foundUserOpt.isPresent());
        User foundUser = foundUserOpt.get();

        assertEquals(newUser.userType, foundUser.userType);
        assertEquals(newUser.emailAddress, foundUser.emailAddress);
        assertEquals(newUser.password, foundUser.password);
        assertEquals(savedUser.id, foundUser.id);
    }

    @Test
    void testFindByUsername() {
        User newUser = new User();
        newUser.userType = "STUDENT";
        newUser.emailAddress = "test_email_two@test.com";
        newUser.password = "another_super_secure_password";

        User savedUser = userService.saveUser(newUser);
        assertNotNull(savedUser.id);

        Optional<User> foundUserOpt = userService.findByUsername(newUser.username);
        assertTrue(foundUserOpt.isPresent());
        User foundUser = foundUserOpt.get();

        assertEquals(newUser.userType, foundUser.userType);
        assertEquals(newUser.emailAddress, foundUser.emailAddress);
        assertEquals(newUser.password, foundUser.password);
        assertEquals(savedUser.id, foundUser.id);
    }

    @Test
    void testFindByUsernamePassword() {
        User newUser = new User();
        newUser.userType = "STUDENT";
        newUser.emailAddress = "test_email_three@test.com";
        newUser.password = "yet_another_super_secure_password";


        User savedUser = userService.saveUser(newUser);
        assertNotNull(savedUser.id);

        Optional<User> foundUserOpt = userService.findByUsernamePassword(newUser.username, newUser.password);
        assertTrue(foundUserOpt.isPresent());
        User foundUser = foundUserOpt.get();

        assertEquals(newUser.userType, foundUser.userType);
        assertEquals(newUser.emailAddress, foundUser.emailAddress);
        assertEquals(newUser.password, foundUser.password);
        assertEquals(savedUser.id, foundUser.id);
    }
}
