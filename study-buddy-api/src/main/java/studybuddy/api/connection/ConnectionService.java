package studybuddy.api.connection;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ConnectionService {
    @Autowired
    ConnectionRepository connectionRepository;
    public void deleteStudyBuddy(String thisUser, String otherUser){
        connectionRepository.deleteStudyBuddy(thisUser,otherUser);
    }

    public List<String> getStudyBuddies(String thisUser){
        return connectionRepository.getStudyBuddies(thisUser);
    }

    public List<String> getStudyBuddyRequesters(String thisUser){
        return connectionRepository.getStudyBuddyRequesters(thisUser);
    }

    public List<String> getStudyBuddyRequests(String thisUser){
        return connectionRepository.getStudyBuddyRequests(thisUser);
    }

    public Connection saveConnection(Connection connection) {
        return connectionRepository.save(connection);
    }

    public Optional<Connection> findConnection(String requester, String requested) {
        return connectionRepository.findConnection(requester, requested);
    }

    public List<Connection> getConnections(String username) {
        return connectionRepository.getConnections(username);
    }

}
