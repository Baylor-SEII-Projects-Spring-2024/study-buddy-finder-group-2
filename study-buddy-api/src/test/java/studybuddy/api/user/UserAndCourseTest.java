
package studybuddy.api.user;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import studybuddy.api.course.Course;
import studybuddy.api.course.CourseService;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("testdb")  // make these tests use the H2 in-memory DB instead of your actual DB
@Transactional
public class UserAndCourseTest {

    @Autowired
    private UserService userService;

    @Autowired
    private CourseService courseService;
    @Test
    void testUserCoursesSave() {
        Course c = new Course();
        c.setCourseNumber(1440);
        c.setCoursePrefix("CSI");

        User newUser = new User();
        newUser.userType = "STUDENT";
        newUser.emailAddress = "example@example.com";
        newUser.password = "password";
        newUser.courses = new HashSet<>(){};
        newUser.addCourse(c);

        User savedUser = userService.saveUser(newUser);
        assertNotNull(savedUser.id);
        assertNotNull(savedUser.courses);
        savedUser.courses.forEach(x -> System.out.println(x.getCoursePrefix()));


        Set<Course> savedCourse = courseService.findAllCourses();
        assertTrue(savedCourse.contains(c));
    }
}
