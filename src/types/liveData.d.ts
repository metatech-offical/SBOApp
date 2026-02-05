interface FromUser {
    userName: string;
    userID: string;
}

interface OriginalMessage {
    fromUser: FromUser;
    messageID: number;
    sendTime: number;
    message: string;
}

interface OriginalData {
    roomID: string;
    messageList: OriginalMessage[];
}

interface ConvertedMessage {
    username: string;
    id: string;
    message: string;
    timestamp: number;
}
