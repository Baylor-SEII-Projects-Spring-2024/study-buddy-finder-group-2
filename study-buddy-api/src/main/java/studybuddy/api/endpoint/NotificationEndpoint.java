package studybuddy.api.endpoint;

import jakarta.websocket.OnClose;
import jakarta.websocket.OnOpen;
import jakarta.websocket.Session;
import jakarta.websocket.server.ServerEndpoint;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Set;
import java.util.concurrent.CopyOnWriteArraySet;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import studybuddy.api.connection.Connection;
import studybuddy.api.notifications.Notification;
import studybuddy.api.notifications.NotificationService;
import studybuddy.api.user.UserService;

@RestController
@CrossOrigin(origins = "http://localhost:3000") // for local testing
//@CrossOrigin(origins = "http://34.16.169.60:3000")
public class NotificationEndpoint {

    @Autowired
    NotificationService notificationService;

    @Autowired
    UserService userService;
    @RequestMapping(
            value = "/api/notification/getNotifications/{username}",
            method = RequestMethod.GET
    )
    public ResponseEntity<List<Notification>> getUsersNotifications(@PathVariable String username){
        return ResponseEntity.ok(notificationService.getNotificationsByRecieverUsername(username));
    }

    @RequestMapping(
            value = "/api/notification/switchNotificationReadStatus",
            method = RequestMethod.POST,
            consumes = "application/json",
            produces = "application/json"
    )
    public ResponseEntity<Notification> switchReadStatus(@RequestBody Notification notification){
        return ResponseEntity.ok(notificationService.changeReadStatus(notification));
    }


    @RequestMapping(
            value = "/api/notification/deleteNotification",
            method = RequestMethod.POST,
            consumes = "application/json",
            produces = "application/json"
    )
    public ResponseEntity<Notification> removeNotification(@RequestBody Notification notification){
        return ResponseEntity.ok(notificationService.deleteNotificationById(notification));
    }

    @RequestMapping(
            value = "/api/notification/getNotificationCount/{username}",
            method = RequestMethod.GET
    )
    public int getNotificationCount(@PathVariable String username){
        Long userId = userService.findByUsernameExists(username).getId();
        return notificationService.getUnreadNotificationCount(userId);
    }
}
