package studybuddy.api.course;

import jakarta.persistence.*;
import lombok.Data;
import studybuddy.api.user.User;

import java.util.Set;

@Data
@Entity
@Table(name = Course.TABLE_NAME)
public class Course {
    public static final String TABLE_NAME = "courses";
    @Id
    @GeneratedValue(generator = TABLE_NAME + "_GENERATOR")
    @SequenceGenerator(
            name = TABLE_NAME + "_GENERATOR",
            sequenceName = TABLE_NAME + "_SEQUENCE"
    )
    @Column(name = "COURSE_ID")
    private Long courseId;

    @Column(name = "COURSE_NUMBER")
    private int courseNumber;

    @Column(name = "COURSE_PREFIX") //Change to what it should be lol
    private String coursePrefix;

    @ManyToMany(cascade = CascadeType.ALL)
    @JoinTable(
            name = "users_courses",
            joinColumns = @JoinColumn(name = "course_id"),
            inverseJoinColumns = @JoinColumn(name = "username"))
    private Set<User> users;

    /*
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "school_id", referencedColumnName = "school_id")
    private School school; */

}
