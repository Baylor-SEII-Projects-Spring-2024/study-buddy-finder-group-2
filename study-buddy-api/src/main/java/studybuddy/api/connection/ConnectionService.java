package studybuddy.api.connection;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ConnectionService {
    @Autowired
    ConnectionRepository connectionRepository;
    public void deleteConnection(String thisUser, String otherUser){
        connectionRepository.deleteConnection(thisUser,otherUser);
    }

    public void delete(Long id){
        connectionRepository.deleteById(id);
    }

    public Connection saveConnection(Connection connection) {
        // only save connection if it is not between the user and herself
        if(!connection.getRequester().equals(connection.getRequested())) {
            return connectionRepository.save(connection);
        }
        else {
            return connection;
        }
    }

    public Optional<Connection> findConnection(String requester, String requested) {
        return connectionRepository.findConnection(requester, requested);
    }

    public Connection getConnection(String requester, String requested) {
        return connectionRepository.getConnection(requester, requested);
    }

    public List<Connection> getConnections(String username) {
        return connectionRepository.getConnections(username);
    }

}
