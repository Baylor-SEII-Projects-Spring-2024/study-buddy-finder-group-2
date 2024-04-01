package studybuddy.api.notifications;

import org.aspectj.weaver.ast.Not;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    public List<Notification> findNotificationsByReciever_IdOrderByTimestampDesc(Long reciever_id);

    public List<Notification> findNotificationsByReciever_UsernameOrderByTimestampDesc(String reciever_username);
}
