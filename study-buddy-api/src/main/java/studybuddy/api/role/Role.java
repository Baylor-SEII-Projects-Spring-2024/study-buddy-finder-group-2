package studybuddy.api.role;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.*;

/**
 * NOTE
 * I think the roles reflect the inheritance from a "person"
 * that we originally listed.
 * Currently, we have just a string to identify userType, so
 * save this for later??
 *
 * emma
 * 2/23/2024
 */

@Getter
@Setter
@Entity
@Table(name = "roles")
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
}
