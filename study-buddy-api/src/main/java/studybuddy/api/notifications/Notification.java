package studybuddy.api.notifications;

import jakarta.persistence.*;
import lombok.Data;
import studybuddy.api.user.User;

import java.util.Date;

@Data
@Entity
@Table(name = studybuddy.api.notifications.Notification.TABLE_NAME)
public class Notification {
    public static final String TABLE_NAME = "notifications";
    @Id
    @GeneratedValue(generator = TABLE_NAME + "_GENERATOR")
    @SequenceGenerator(
            name = TABLE_NAME + "_GENERATOR",
            sequenceName = TABLE_NAME + "_SEQUENCE"
    )
    @Column(name = "NOTIFICATION_ID")
    private Long notificationId;

    @Column(name = "NOTIFICATION_CONTENT")
    private String notificationContent;

    @Column(name = "NOTIFICATION_URL")
    private String notificationUrl;

    @Column(name = "NOTIFICATION_READ")
    private boolean isRead;

    @Column(name = "NOTIFICATION_TIMESTAMP")
    private Date timestamp;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "SENDER")
    private User sender;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "RECIEVER")
    private User reciever;
}
