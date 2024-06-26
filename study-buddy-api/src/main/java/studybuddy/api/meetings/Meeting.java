package studybuddy.api.meetings;

import jakarta.persistence.*;
import lombok.Data;
import studybuddy.api.user.User;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@Entity
@Table(name = Meeting.TABLE_NAME)
public class Meeting {
    public static final String TABLE_NAME = "MEETINGS";

    @Id
    @GeneratedValue(generator = TABLE_NAME + "_GENERATOR")
    @SequenceGenerator(
            name = TABLE_NAME + "_GENERATOR",
            sequenceName = TABLE_NAME + "_SEQUENCE"
    )
    @Column(name = "MEETING_ID")
    Long id;

    @Column(name = "USERNAME")
    String username;

    @ManyToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinTable(
            name = "meetups_users",
            joinColumns = @JoinColumn(name = "meeting_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id"))
    Set<User> attendees;

    @Column(name = "TITLE")
    String title;

    @Column(name = "DESCRIPTION")
    String description;

    @Column(name = "SUBJECT")
    String subject;

    @Column(name = "STARTDATE")
    LocalDateTime startDate;

    @Column(name = "ENDDATE")
    LocalDateTime endDate;

    @Column(name = "LOCATION")
    String location;

    @Column(name = "EXPIRED", columnDefinition = "BOOLEAN DEFAULT FALSE")
    private boolean expired;

    @Column(name = "REMINDED", columnDefinition = "BOOLEAN DEFAULT FALSE")
    private boolean reminded;

    public boolean getExpired(){
        return this.expired;
    }

    public boolean getReminded(){
        return this.reminded;
    }

}
