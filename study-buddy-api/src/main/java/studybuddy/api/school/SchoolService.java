package studybuddy.api.school;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class SchoolService{

    @Autowired
    private SchoolRepository schoolRepository;

    /**
     * getSchools
     *
     * returns list of schools from database
     * @return ResponseEntity<School>[]
     *
     */
    public List<School> getSchools(){
        List<School> schools = new ArrayList<>();
        School baylor = new School();
        baylor.setSchoolName("Baylor University");
        baylor.setId(1l);
        baylor.setEmailDomain("baylor.edu");
        schools.add(baylor);
        return schools;
    }

    /**
     * saveSchool
     * Saves the school to the repository
     *
     * @param school
     * @return
     */
    public School saveSchool(School school){return schoolRepository.save(school);}
}
