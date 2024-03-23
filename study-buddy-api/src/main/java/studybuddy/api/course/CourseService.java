package studybuddy.api.course;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import studybuddy.api.user.User;

import java.util.Set;

@Service
public class CourseService {

    @Autowired
    CourseRepository courseRepository;

    /** findAllCourses
     * finds all courses stored in the repository
     *
     * @return all courses in the repository
     */
    public Set<Course> findAllCourses(){
        return courseRepository.findAllCourses();
    }

    /**
     * saveCourse
     * stores course to the repository
     *
     * @param course
     * @return Course saved to repo
     */
    public Course saveCourse(Course course) {
        return courseRepository.save(course);
    }

    /**
     * @param user
     * @return
     */
    public Set<Course> getCoursesOfUser(User user){return courseRepository.findCoursesByUsersUsername(user.getUsername());}

    /**
     *
     * @param username
     * @return
     */
    public Set<Course> getCoursesOfUserByUsername(String username){return courseRepository.findCoursesByUsersUsername(username);}

}
