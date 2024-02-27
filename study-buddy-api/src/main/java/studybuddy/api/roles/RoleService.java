package studybuddy.api.roles;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class RoleService {
    @Autowired
    private RoleRepository roleRepository;

    public Optional<Role> findByName(String name) {
        return roleRepository.findByName(name);
    };
}
