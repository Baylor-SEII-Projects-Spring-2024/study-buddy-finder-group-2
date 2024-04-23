package studybuddy.api.user;

import jakarta.persistence.*;
import lombok.Data;
import studybuddy.api.course.Course;
import studybuddy.api.school.School;
import studybuddy.api.roles.Role;


import java.util.*;

@Data
@Entity
@Table(name = User.TABLE_NAME,
        indexes = {@Index(name = "idx_username", columnList = "USERNAME"),
        @Index(name = "idx_id", columnList = "USER_ID")})
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

    @ManyToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinTable(
            name = "users_courses",
            joinColumns = @JoinColumn(name = "username"),
            inverseJoinColumns = @JoinColumn(name = "course_id"))
    Set<Course> courses;



    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "SCHOOL_ID")
    private School school;

    // creates join table with Role
    @ManyToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinTable(name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id", referencedColumnName = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id", referencedColumnName = "role_id"))
    private List<Role> roles = new ArrayList<>();


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