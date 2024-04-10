package studybuddy.api.notifications;

import org.aspectj.weaver.ast.Not;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    public List<Notification> findNotificationsByReciever_IdOrderByTimestampDesc(Long reciever_id);

    public List<Notification> findNotificationsByReciever_UsernameOrderByTimestampDesc(String reciever_username);

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM notifications WHERE notification_id = ?1", nativeQuery = true)
    public void removeNotificationByNotificationId(long id);

}
