package studybuddy.api.notifications;

import org.aspectj.weaver.ast.Not;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {
    @Autowired
    NotificationRepository notificationRepository;

    /**
     * getNotificationsByRecieverId
     *
     *
     * @param reciever_id
     * @return
     */
    public List<Notification> getNotificationsByRecieverId(Long reciever_id){
        return notificationRepository
                .findNotificationsByReciever_IdOrderByTimestampDesc(reciever_id);
    }

    /**
     * getNotificationsByRecieverUsername
     *
     * @param username
     * @return
     */
    public List<Notification> getNotificationsByRecieverUsername(String username){
        return notificationRepository
                .findNotificationsByReciever_UsernameOrderByTimestampDesc(username);
    }


    /**
     * sendNotification
     *
     * @param notification
     * @return
     */
    public Notification sendNotification(Notification notification){
        notification.setRead(false);
        notificationRepository.save(notification);
        return notification;
    }

    public Notification changeReadStatus(Notification notification){
        notification.setRead(!notification.isRead());
        return notificationRepository.save(notification);
    }

}
