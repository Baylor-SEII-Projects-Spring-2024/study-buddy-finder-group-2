package studybuddy.api.school;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface SchoolRepository extends JpaRepository<School, Long> {
    /**
     * getSchools
     * gets schools from database
     *
     * @return School[]
     */
    @Query(value = "SELECT school_id, email_domain, school_name FROM schools s", nativeQuery = true)
    public List<School> getAllSchools();

    /**
     * getAllSchoolNames
     *
     * @return all names of schools in database
     */
    @Query(value = "SELECT school_name FROM schools s", nativeQuery = true)
    public List<String> getAllSchoolNames();



}
