package studybuddy.api.course;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CourseService {

    @Autowired
    CourseRepository courseRepository;

    /** findAllCourses
     * finds all courses stored in the repository
     *
     * @return all courses in the repository
     */
    public List<Course> findAllCourses(){
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
}
