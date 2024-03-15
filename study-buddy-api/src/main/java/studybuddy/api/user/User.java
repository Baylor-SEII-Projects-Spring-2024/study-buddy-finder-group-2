package studybuddy.api.user;

import jakarta.persistence.*;
import lombok.Data;
import studybuddy.api.roles.Role;

import java.util.ArrayList;
import java.util.List;
import org.hibernate.annotations.Cascade;
import studybuddy.api.course.Course;
import studybuddy.api.school.School;

import java.util.HashSet;
import java.util.Set;

@Data
@Entity
@Table(name = User.TABLE_NAME)
public class User {
    public static final String TABLE_NAME = "USERS";

    @Id
    @GeneratedValue(generator = TABLE_NAME + "_GENERATOR")
    @SequenceGenerator(
            name = TABLE_NAME + "_GENERATOR",
            sequenceName = TABLE_NAME + "_SEQUENCE"
    )
    @Column(name = "USER_ID")
    Long id;

    @Column(name = "FIRSTNAME")
    String firstName;

    @Column(name = "LASTNAME")
    String lastName;

    @Column(name = "USERNAME")
    String username;

    @Column(name = "EMAIL_ADDRESS")
    String emailAddress;

    @Column(name = "PASSWORD")
    String password;

    @Column(name = "USER_TYPE")
    String userType;

    // creates join table with Role
    @ManyToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinTable(name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id", referencedColumnName = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id", referencedColumnName = "role_id"))
    private List<Role> roles = new ArrayList<>();

    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinTable(
            name = "users_courses",
            joinColumns = @JoinColumn(name = "username"),
            inverseJoinColumns = @JoinColumn(name = "course_id"))
    Set<Course> courses;

    /*
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "school_id", referencedColumnName = "school_id")
    School school; */

    public void addCourse(Course c){
        if(courses  == null){
            courses = new HashSet<Course>();
        }
        if(!courses.contains(c)) courses.add(c);
    }

    public void removeCourse(Course c){
            courses.remove(c);
    }

}
