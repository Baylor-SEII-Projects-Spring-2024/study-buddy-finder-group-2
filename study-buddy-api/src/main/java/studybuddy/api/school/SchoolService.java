package studybuddy.api.school;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
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
        return schoolRepository.getAllSchools();
    }
}
