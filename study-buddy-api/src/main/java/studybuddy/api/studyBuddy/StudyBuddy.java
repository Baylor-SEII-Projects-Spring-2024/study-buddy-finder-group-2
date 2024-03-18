package studybuddy.api.studyBuddy;

import jakarta.persistence.*;
import lombok.Data;
import studybuddy.api.course.Course;

import java.util.HashSet;
import java.util.Set;

@Data
@Entity
@Table(name = StudyBuddy.TABLE_NAME)
public class StudyBuddy {
    public static final String TABLE_NAME = "studyBuddy";

    @Id
    @GeneratedValue(generator = TABLE_NAME + "_GENERATOR")
    @SequenceGenerator(
            name = TABLE_NAME + "_GENERATOR",
            sequenceName = TABLE_NAME + "_SEQUENCE"
    )
    @Column(name = "REQUESTER")
    String requester;

    @Column(name = "TO")
    String to;




}
