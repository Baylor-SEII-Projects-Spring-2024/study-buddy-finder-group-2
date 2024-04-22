package studybuddy.api.rating;
import jakarta.persistence.*;
import lombok.Data;
import studybuddy.api.meetings.Meeting;
import studybuddy.api.user.User;

import java.util.Optional;

@Data
@Entity
@Table(name = Rating.TABLE_NAME)
public class Rating {
    public static final String TABLE_NAME = "RATINGS";

    @Id
    @GeneratedValue(generator = TABLE_NAME + "_GENERATOR")
    @SequenceGenerator(
            name = TABLE_NAME + "_GENERATOR",
            sequenceName = TABLE_NAME + "_SEQUENCE"
    )
    @Column(name = "RATING_ID")
    Long ratingId;

    @Column(name = "Meeting_Title")
    String meetingTitle;

    @ManyToOne
    @JoinColumn(name = "RATING_USER", referencedColumnName = "username")
    User ratingUser;

    @ManyToOne
    @JoinColumn(name = "RATED_USER", referencedColumnName = "username")
    User ratedUser;

    @Column(name = "RATING_SCORE", nullable = true)
    Double score;

    @Column(name = "REVIEW", nullable = true)
    String review = null;

    public Rating(String meetingTitle, Optional<User> ratingUser, Optional<User> ratedUser, Double score, String review) {
        this.meetingTitle = meetingTitle;
        this.ratingUser = ratingUser.orElseThrow(() -> new IllegalArgumentException("Rating user must be provided"));
        this.ratedUser = ratedUser.orElseThrow(() -> new IllegalArgumentException("Rated user must be provided"));
        this.score = score;
        this.review = review;
    }

    public Rating() {

    }
}