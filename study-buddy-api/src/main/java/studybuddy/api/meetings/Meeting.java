package studybuddy.api.meetings;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
//import java.time.ZonedDateTime;

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

    @Column(name = "TITLE")
    String title;

    @Column(name = "DESCRIPTION")
    String description;

    @Column(name = "SUBJECT")
    String subject;

    @Column(name = "DATE")
    LocalDateTime date;

    @Column(name = "LOCATION")
    String location;
}
