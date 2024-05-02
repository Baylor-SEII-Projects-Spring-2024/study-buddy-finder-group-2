package studybuddy.api.connection;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = Connection.TABLE_NAME)
public class Connection {
    public static final String TABLE_NAME = "CONNECTION";

    @Id
    @GeneratedValue(generator = TABLE_NAME + "_GENERATOR")
    @SequenceGenerator(
            name = TABLE_NAME + "_GENERATOR",
            sequenceName = TABLE_NAME + "_SEQUENCE"
    )
    @Column(name = "CONNECTION_ID")
    Long id;

    @Column(name = "REQUESTER")
    String requester;

    @Column(name = "REQUESTED")
    String requested;

    @Column(name = "IS_CONNECTED")
    Boolean isConnected;

}
