const typeDefs = `
    type loginResponse {
        user: user
        token: String
        language: String
        contact: userContact
        notification: userNotification
        groupNotification: [groupNotification]
        group: [group]
        messages: [messages]
    }

    type createGroupResponse {
        group: [group]
        len: Int
    }

    type messages {
        alreadyread: String
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
        origin: String
        firstName: String
        lastName: String
        message: String
        time: String
    }
    type createContactResponse {
        user: userContact
        contactId: String
        number: Int
    }
    type createNotificationResponse {
        user: userContact
        contact: userContact
        number: Int
    }
    type deleteNotificationResponse {
        number: Int
    }

    type deleteContactResponse {
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
        creator: String
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
        creator: String
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
        room: String
    }

    type userContact {
        identification: ID
        contacts: [contact]
    }  
    
    type contact {
        id: String
        room: String
        status: String
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
        contactid: String
        room: String
    }
    input groupInput {
        group: newGroup
        name: String
    }
    input createGroupInput {
        group: newGroupInput
        name: String
    }
    input newGroupInput {
        room: String
        members: [newmember]
    }
    input newGroup {
        room: String
        creator: String
        members: [newmember]
    }
    input newmember {
        id: String
    }

    type result {
        result: String
    }
    input updateInput {
        password: String
        firstName: String
        lastName: String
    }
    input newMessageInput {
        room: String 
        message: String 
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
    type NewMessageResponse {
        id: String
        room: String
        origin: String
        firstName: String 
        lastName: String
        message: String
        time: String 
    }  

    input editGroupInput {
        group: newEditGroup
        name: String
    } 
    input leaveGroupInput {
        group: newEditGroup
    } 
    input newEditGroup {
        room: String
        members: [newmember]
    }
    
    input deleteNotificationInput {
        contactid: String
        room: String
    }
    
    input deleteContactInput {
        contactid: String
        room: String
    }

    input deleteGroupNotificationInput {
        room: String
    }
    type languageResult {
        language: String
    }

    type Query {
        login(input: loginInput): loginResponse
        tokenLogin(input: tokenLoginInput): loginResponse
        user(email: String!): user
        contacts(id: String): userContact
        notification(id: String): resultNotification
        groupNotifications(id: String): [groupNotification]
        groups(id: String): [group]
    }
    type Mutation {
        createUser(input: userInput): user
        createNotification(id: String!): createContactResponse
        deleteNotification(input: deleteNotificationInput): deleteNotificationResponse
        deleteContact(input: deleteContactInput): deleteContactResponse
        deleteGroupNotification(input: createGroupInput): deleteNotificationResponse
        createContact(input: contactInput): createContactResponse 
        createGroup(input: createGroupInput): createGroupResponse    
        createGroupAndNotifications(input: groupInput): [group]
        singleUpload(file: String!): result
        updateUserData(input: updateInput): user
        newMessage(input: newMessageInput): NewMessageResponse
        newStatus(input: newStatusInput): statusResult
        editGroup(input: editGroupInput): [group]
        leaveGroup(input: leaveGroupInput): [group]
        newLanguage(language: String!): languageResult
    }
`;

module.exports = typeDefs;
