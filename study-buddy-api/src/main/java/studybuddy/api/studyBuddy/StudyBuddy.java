package studybuddy.api.studyBuddy;

import jakarta.persistence.*;
import lombok.Data;



@Data
@Entity
@Table(name = StudyBuddy.TABLE_NAME)
public class StudyBuddy {
    public static final String TABLE_NAME = "studyBuddy";

    @Id
    @GeneratedValue(generator = TABLE_NAME + "_GENERATOR")
    @SequenceGenerator(
            name = TABLE_NAME + "_GENERATOR",
            sequenceName = TABLE_NAME + "_SEQUENCE"
    )
    @Column(name = "REQUESTER")
    String requester;

    @Column(name = "RECEIVER")
    String receiver;

    public StudyBuddy(String requester, String receiver){
        this.requester = requester;
        this.receiver = receiver;
    }
    public StudyBuddy() {
    }
    void setRequester(String requester){
        this.requester = requester;
    }
    void setReceiver(String receiver){
        this.receiver = receiver;
    }
}
