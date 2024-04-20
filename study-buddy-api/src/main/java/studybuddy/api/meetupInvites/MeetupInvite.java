package studybuddy.api.meetupInvites;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = MeetupInvite.TABLE_NAME)
public class MeetupInvite {
    public static final String TABLE_NAME = "MEETUP_INVITES";

    @Id
    @GeneratedValue(generator = TABLE_NAME + "_GENERATOR")
    @SequenceGenerator(
            name = TABLE_NAME + "_GENERATOR",
            sequenceName = TABLE_NAME + "_SEQUENCE"
    )
    @Column(name = "MEETUP_INVITE_ID")
    Long id;

    @Column(name = "MEETUP_ID")
    Long meetupId;

    @Column(name = "MEETUP_TITLE")
    String title;

    @Column(name = "CREATOR")
    String creator;

    @Column(name = "INVITEE")
    String invitee;

    @Column(name = "IS_JOINED")
    Boolean isJoined;
}
