package studybuddy.api.rating;
import jakarta.persistence.*;
import lombok.Data;
import studybuddy.api.user.User;

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
    private Long ratingId;

    @ManyToOne
    @JoinColumn(name = "RATING_USER", referencedColumnName = "username")
    private User ratingUser;

    @ManyToOne
    @JoinColumn(name = "RATED_USER", referencedColumnName = "username")
    private User ratedUser;

    @Column(name = "RATINGS")
    private Double rating;

    @Column(name = "REVIEW", nullable = true)
    private String review = null;
}
