package studybuddy.api.course;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {

    /**
     * findAllCourses
     *
     * finds all courses in the repository
     *
     * @return List of All stored Courses
     */
    @Query(value = "SELECT * FROM courses c", nativeQuery = true)
    public List<Course> findAllCourses();

    /**
     * findAllCoursesByPrefix
     *
     * finds all courses in the repository with the same prefix
     *
     * @param prefix
     * @return list of courses with the prefix
     */
    @Query(value = "SELECT * FROM courses c WHERE course_prefix = ?1", nativeQuery = true)
    public List<Course> findAllCoursesByPrefix(String prefix);

    /**
     * findCourseById
     *
     * finds the Course with the same id
     *
     * @param id
     * @return Course with matching id
     */
    @Query(value = "SELECT * FROM courses c WHERE course_id = ?1", nativeQuery = true)
    public Course findCourseById(long id);

    /**
     * finds a list of courses a user has
     * @param userId
     * @return
     */
    public List<Course> findCoursesByUsersId(long userId);

    /**
     *
     * @param courseId
     * @param userId
     * @return course that is deleted from join table
     */
    public Course removeCoursesByCourseIdAndUsersId(long courseId,long userId);

}
