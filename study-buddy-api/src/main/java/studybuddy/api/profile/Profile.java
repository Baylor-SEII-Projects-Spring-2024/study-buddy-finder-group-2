package studybuddy.api.profile;

import jakarta.persistence.*;
import lombok.Data;
@Data
@Entity
@Table(name = Profile.TABLE_NAME)
public class Profile { //ok
    public static final String TABLE_NAME = "PROFILES";

    @Id
    @GeneratedValue(generator = TABLE_NAME + "_GENERATOR")
    @SequenceGenerator(
            name = TABLE_NAME + "_GENERATOR",
            sequenceName = TABLE_NAME + "_SEQUENCE"
    )
    @Column(name = "PROFILE_ID")
    Long id;

    @Column(name = "PICTURE_URL")
    String pictureUrl;

    @Column(name = "USERNAME")
    String username;

    @Column(name = "BIO")
    String bio;
}
