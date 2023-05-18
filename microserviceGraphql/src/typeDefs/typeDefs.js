const typeDefs = `
    type loginResponse {
        user: user
        token: String
        contact: userContact
        notification: userNotification
        groupNotification: [groupNotification]
        group: [group]
        messages: [messages]
    }
    type messages {
        alreadyread: Boolean
        room: String
        users: [messagesUser]
        name: String
        messages: [messagesByUser]
    }
    type messagesUser {
        id: String
        firstName: String
        lastName: String
    }
    type messagesByUser {
        id: Int
        origin: String
        firstName: String
        lastName: String
        message: String
        position: String
        time: String
    }
    type createContactResponse {
        user: userContact
        contactId: String
        number: Int
    }
    type deleteNotificationResponse {
        number: Int
    }
    type user {
        _id: ID
        email:String
        firstName: String
        lastName: String
        tokens: [token]
        avatar: String
    }
    type token {
        token:String
    }

    type groupNotification {
        room: String
        members: [member]
        name: String
    }

    type member {
        id: String
        email: String
        firstName: String
        lastName: String
        avatar: String
    }
    
    type group {
        room: String
        members: [member]
        name: String
    }
    type userNotification {
        _id: ID
        notifications: [notification]
    }
    type notification {
        id: String
    }

    type resultNotification {
        _id: ID
        notifications: [resNotification]
    }

    type resNotification {
        id: String
        email: String
        firstName: String
        lastName: String
        avatar: String
    }

    type userContact {
        identification: ID
        contacts: [contact]
    }  
    
    type contact {
        id: String
        room: String
        email: String
        firstName: String
        lastName: String
        avatar: String
    }
    input userInput {
        email:String!
        password: String!
        firstName: String!
        lastName: String!
    }
    
    input loginInput {
        email:String!
        password: String!
    }
    input tokenLoginInput {
        token:String
    }
    input contactInput {
        userid:String
        contactid: String
    }
    input groupInput {
        group: newGroup
        name: String
    }
    input newGroup {
        room: String
        members: [newmember]
    }
    input newmember {
        id: String
    }

    type result {
        result: String
    }
    input updateInput {
        email: String
        password: String
        firstName: String
        lastName: String
    }
    input newMessageInput {
        id: String
        room: String
        idNumber: Int
        origin: String
        firstName: String 
        lastName: String 
        position: String 
        message: String
        time: String 
    }
    input newStatusInput {
        id: String
        room: String
        status: String
    }
    type statusResult {
        room: String
        status: String
    }

    type Query {
        login(input: loginInput): loginResponse
        tokenLogin(input: tokenLoginInput): loginResponse
        user(email: String!): user
        contacts(id: String): userContact
        notification(id: String): resultNotification
        groupNotifications(id: String): [groupNotification]
        groups(id: String!): [group]
    }
    type Mutation {
        createUser(input: userInput): user
        createNotification(id: String!): userNotification
        deleteNotification(contactid: String!): deleteNotificationResponse
        deleteGroupNotification(room: String!): deleteNotificationResponse
        createContact(input: contactInput): createContactResponse 
        createGroup(input: groupInput): [group]    
        createGroupAndNotifications(input: groupInput): [group]
        singleUpload(file: String!): result
        updateUserData(input: updateInput): user
        createNewMessage(input: newMessageInput): result
        createNewStatus(input: newStatusInput): statusResult
    }
`;

module.exports = typeDefs;