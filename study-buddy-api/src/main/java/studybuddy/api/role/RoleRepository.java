package studybuddy.api.role;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {
    /**
     * findByName()
     *
     * This function uses the JPA Repository customizable findBy...
     * I think it selects * wherever the given attribute matches.
     *
     * @param name
     * @return User that matches
     *         NULL if no matches
     */
    Optional<Role> findByName(String name);
}
