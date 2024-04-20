package studybuddy.api.dto;

import lombok.Data;
import studybuddy.api.school.School;

@Data
public class LoginDto {
    private String username;
    private String password;
    private String firstName;
    private String lastName;
    private String userType;
    private String emailAddress;
    //private String school;
}
