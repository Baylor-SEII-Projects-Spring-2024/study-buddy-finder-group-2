package studybuddy.api.endpoint;

import jakarta.websocket.OnClose;
import jakarta.websocket.OnOpen;
import jakarta.websocket.Session;
import jakarta.websocket.server.ServerEndpoint;

import java.io.IOException;
import java.util.HashMap;
import java.util.Set;
import java.util.concurrent.CopyOnWriteArraySet;

@ServerEndpoint(value = "/api/notification/{username}")
public class NotificationEndpoint {
    private Session session;
    private static Set<NotificationEndpoint> notificationEndpointSet = new CopyOnWriteArraySet<>();
    private static HashMap<String, String> users = new HashMap<>();
    @OnOpen
    public void onOpen(Session session) throws IOException{
        // Get session and WebSocket connection

    }

    @OnClose
    public void onClose(Session session) throws IOException {
        // WebSocket connection closes

    }

}
