package studybuddy.api.endpoint;

import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import studybuddy.api.course.Course;
import studybuddy.api.course.CourseService;
import studybuddy.api.user.User;
import studybuddy.api.user.UserService;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@Log4j2
@RestController
//@CrossOrigin(origins = "http://localhost:3000") // for local testing
@CrossOrigin(origins = "http://34.16.169.60:3000")
public class AlterCoursesEndpoint{
    @Autowired
    CourseService courseService = new CourseService();
    @Autowired
    UserService userService = new UserService();

    @RequestMapping(
            value = "/api/get-courses-user/{username}",
            method = RequestMethod.GET,
            produces = "application/json"
    )
    public ResponseEntity<Set<Course>> getUserCourses(@PathVariable String username){
        System.out.println(courseService.getCoursesOfUserByUsername(username).isEmpty());
        return new ResponseEntity<>(courseService.getCoursesOfUserByUsername(username), HttpStatus.OK);
    }

    @RequestMapping(
            value = "/api/add-course/{course}",
            method = RequestMethod.POST,
            consumes = "application/json",
            produces = "application/json"
    )
    public ResponseEntity<Course> addCourse(@PathVariable Course course){
        return new ResponseEntity<>(courseService.saveCourse(course), HttpStatus.OK);
    }


    @RequestMapping(
            value = "/api/add-user-courses/",
            method = RequestMethod.POST,
            consumes = "application/json",
            produces = "application/json"
    )

    public ResponseEntity<Set<Course>> addUserCourses(@RequestParam Set<Course> courses, @RequestParam String username){
        Optional<User> user = userService.findByUsername(username);
        Set<Course> list = new HashSet<>();
        user.ifPresent(x -> {
            x.setCourses(courses);
            userService.saveUser(x);
            list.addAll(courseService.getCoursesOfUser(x));
        });

        if(user.isEmpty()) return ResponseEntity.badRequest().body(null);
        return ResponseEntity.ok(list);
    };

    @RequestMapping(
            value = "/api/add-user-course/{username}",
            method = RequestMethod.POST,
            consumes = "application/json",
            produces = "application/json"
    )
    public ResponseEntity<Set<Course>> addUserCourse(@PathVariable String username, @RequestBody Course course){

        Optional<User> user = userService.findByUsername(username);
        Set<Course> list = new HashSet<>();
        user.ifPresent(x -> {
            x.addCourse(course);
            userService.saveUser(x);
            list.addAll(courseService.getCoursesOfUser(x));
        });

        if(user.isEmpty()) return ResponseEntity.badRequest().body(null);
        return ResponseEntity.ok(list);
    };

    @RequestMapping(
            value = "/api/get-all-courses/",
            method = RequestMethod.GET,
            produces = "application/json"
    )
    public ResponseEntity<Set<Course>> getAllCourses(){
        return new ResponseEntity<>(courseService.findAllCourses(), HttpStatus.OK);
    }


    @RequestMapping(
            value = "/api/remove-course/{username}",
            method = RequestMethod.POST,
            consumes = "application/json",
            produces = "application/json"
    )
    public ResponseEntity<Set<Course>> RemoveUserCourse(@PathVariable String username, @RequestBody Course course){
        Optional<User> user = userService.findByUsername(username);
        System.out.println(course.getCourseId());
        Set<Course> list = new HashSet<>();
        user.ifPresent(x -> {
            userService.deleteCourseFromUser(course, x);
        });

        if(user.isEmpty()) return ResponseEntity.badRequest().body(null);
        return new ResponseEntity<>(courseService.getCoursesOfUserByUsername(username), HttpStatus.OK);
    };


}
