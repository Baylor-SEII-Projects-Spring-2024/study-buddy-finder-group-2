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
        School baylor = new School();
        baylor.setSchoolName("Baylor University");
        baylor.setEmailDomain("baylor.edu");
        schoolRepository.save(baylor);
        School am = new School();
        am.setSchoolName("Texas A&M");
        am.setEmailDomain("tamu.edu");
        schoolRepository.save(am);
        School uta = new School();
        uta.setSchoolName("University of Texas Austin");
        uta.setEmailDomain("utexas.edu");
        schoolRepository.save(uta);

        return schoolRepository.getAllSchools();
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
