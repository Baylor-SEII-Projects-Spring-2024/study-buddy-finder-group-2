package studybuddy.api.messages;

import lombok.Builder;

@Builder
public class Message { //frontend to backend
    private String messageContent;
    private String sender;
    private MessageType type;


    public String getMessageContent() {
        return messageContent;
    }

    public void setMessageContent(String messageContent) {
        this.messageContent = messageContent;
    }

    public String getSender() {
        return sender;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }

    public MessageType getType() {
        return type;
    }

    public void setType(MessageType type) {
        this.type = type;
    }
}
