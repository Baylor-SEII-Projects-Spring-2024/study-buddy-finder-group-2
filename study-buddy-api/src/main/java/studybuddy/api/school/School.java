package studybuddy.api.school;
import jakarta.persistence.*;
import lombok.Data;
import org.checkerframework.common.aliasing.qual.Unique;

@Data
@Entity
@Table(name = School.TABLE_NAME)
public class School {

    public static final String TABLE_NAME = "SCHOOLS";

    @Id
    @GeneratedValue(generator = TABLE_NAME + "_GENERATOR")
    @SequenceGenerator(
            name = TABLE_NAME + "_GENERATOR",
            sequenceName = TABLE_NAME + "_SEQUENCE"
    )
    @Column(name = "SCHOOL_ID")
    Long id;

    @Column(name = "SCHOOL_NAME", unique = true)
    String schoolName;

    @Column(name = "EMAIL_DOMAIN")
    String emailDomain;


}
