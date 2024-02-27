package studybuddy.api.dto;

import lombok.Data;

@Data
public class RegisterDto {
    private String username;
    private String password;
    private String name;
    private String userType;
    private String emailAddress;
}
