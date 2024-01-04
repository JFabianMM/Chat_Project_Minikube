import { put, call, takeEvery, all } from 'redux-saga/effects';
import {gql} from '@apollo/client';
import client from '../../app';
import { updateUserData, updateToken, updateContacts, updateGroups, updateNotifications, updateGroupNotifications, updateRooms, updateMessages, updatePage, updateRequesters, updateGroupRequesters, addRooms, addNewContactMessage, updateErrorNotification, updateAvatar, updateReceivedStatus, updateLanguage, updateCurrentRoom, updateCurrentChat } from '../slice';
import { select } from 'redux-saga/effects';   
import { getUserUpdate } from '../../app/actions/actions';

import { QUERY_USER, QUERY_CONTACT, QUERY_GROUPS, QUERY_LOGIN, QUERY_TOKEN_LOGIN, MUTATION_SIGNUP, QUERY_NOTIFICATION, QUERY_GROUP_NOTIFICATION, MUTATION_CREATE_NOTIFICATION, CREATE_GROUP_NOTIFICATION, CREATE_CONTACT, DELETE_NOTIFICATION, DELETE_GROUP_NOTIFICATION, CREATE_GROUP, MUTATION_UPDATE_USER_DATA, NEW_MESSAGE, NEW_STATUS, NEW_LANGUAGE, EDIT_GROUP, LEAVE_GROUP, DELETE_CONTACT } from '../../app/actionTypes/actionTypes';

  const Get_User = gql`
  query user($email: String!){
    user(email: $email) {
      _id
      email
      firstName
      lastName
      avatar
    }
  }
`;

async function getUserFunction (email){
  const result = await client.query({
    query: Get_User,
    variables: {email: email},
    errorPolicy: "all",
  })
  return result  
}

function* queryUserFunction(action) {
  try{
    let { errors, data } = yield call(getUserFunction, action.email);
    if (data.user){
      yield put(getUserUpdate(data));
      yield put(updateReceivedStatus('Loaded'));
    }
    if (errors){
      let data={user:{email:''}};
      yield put(getUserUpdate(data));
      yield put(updateReceivedStatus('Loaded'));
    }
  }catch(e){
  }  
}  

function* queryUser(){
  yield takeEvery(QUERY_USER, queryUserFunction)
}  

// -----------------------------------------------
const Get_Contact = gql`
  query getContact ($id: String){
    contacts( id: $id) {
        identification
        contacts{
            id
            room
            email
            firstName
            lastName
            avatar
    }
  }
}
`;

function getContactFunction (){
  const result = client.query({
    query: Get_Contact
  })
  return result
}

function* queryContactFunction() {
  try{
    const { data } = yield call(getContactFunction);
    if (data.contacts.contacts){
        yield put(updateContacts(data.contacts.contacts));
    }
  }catch(e){
  }  
}  

function* queryContact(){
  yield takeEvery(QUERY_CONTACT, queryContactFunction)
}  

// -----------------------------------------------

const Get_Groups = gql`
  query groups ($id: String){
    groups( id: $id) {
      room
      creator
      members{
          id
          email
          firstName
          lastName
          avatar
      }
      name
     }
}
`;

function getGroupsFunction (){
  const result = client.query({
    query: Get_Groups
  })
  return result
}

function* queryGroupsFunction() {
  try{
    const { data } = yield call(getGroupsFunction);
    const getMessages = (state) => state.messages
    let messages = yield select(getMessages);
    const getContacts = (state) => state.contacts
    let contacts = yield select(getContacts);
    const getRooms = (state) => state.rooms
    let rooms = yield select(getRooms);
   
    let messagesRooms=[];
    let messagesLen=messages.length;
    for (let i=0; i<messagesLen; i++){
        let foundContact = contacts.find(element => element.room == messages[i].room);
        let foundGroup = data.groups.find(element => element.room == messages[i].room);
        if (!foundContact && !foundGroup){
          messagesRooms=messagesRooms.concat(messages[i].room);
        }
    }

    let messagesRoomsLen=messagesRooms.length;
    for (let j=0; j<messagesRoomsLen; j++){
        messages= messages.filter((el) => {
            return el.room != messagesRooms[j];
        });
        rooms= rooms.filter((el) => {
          return el.room != messagesRooms[j];
      });
    }
    
    yield put(updateCurrentRoom([]));
    yield put(updateCurrentChat([]));
    yield put(updateMessages(messages));
    yield put(updateRooms(rooms));
    yield put(updateGroups(data.groups));

  }catch(e){
  }
}  

function* queryGroups(){
  yield takeEvery(QUERY_GROUPS, queryGroupsFunction)
}  
// ----------------------------------------------- 

const Get_LogIn = gql`
query login ($email: String!, $password: String!){
  login( input: {
      email: $email,
      password: $password
  }) {
      user {
          _id
          email
          firstName
          lastName
          avatar
      }
      token
      language
      contact {
        identification
        contacts {
          id
          room
          status
          email
          firstName
          lastName
          avatar
        }
      }
      notification {
        _id
        notifications {
          id
        }
      }
      groupNotification {
        room
        members {
          id
        }
        name
      }
      group {
        room
        creator
        members {
          id
          email
          firstName
          lastName
          avatar
        }
        name
      }
      messages {
        alreadyread
        room
        users {
          id
        }
        name
        messages {
          origin
          firstName
          lastName
          message
          time
        }
      }
  }
}
`;

function getLogInFunction (email, password){
  const result = client.query({
    query: Get_LogIn,
    variables: {email: email, password: password}
  })
  return result
}

function* queryLogInFunction(action) {
    try{
      const { errors, data } = yield call(getLogInFunction, action.email, action.password);
      if (data.login){
          let lan;
          if (data.login.language){
              lan=data.login.language;
          }else{
              let navLang = navigator.language.substring(0, 2);
              if (navLang=='es' || navLang=='en' || navLang=='fr'){
                lan=navLang;
              }else{
                lan='en';
              } 
          }
          yield put(updateLanguage(lan));
          yield put(updateUserData(data.login.user))
          yield put(updateToken(data.login.token));
          yield put(updateAvatar(data.login.user.avatar));
          yield put(updateContacts(data.login.contact.contacts));
            
          let addedRooms=[];
          let newRoom={};
          let contacts=data.login.contact.contacts;
          contacts.map((contact) =>{ 
              newRoom={
                  id:contact.id,
                  room:contact.room
              }
              addedRooms = addedRooms.concat(newRoom);
          })
    
          yield put(updateNotifications(data.login.notification.notifications.length));
          yield put(updateGroupNotifications(data.login.groupNotification.length));
          yield put(updateGroups(data.login.group));

          let groups=data.login.group;
          newRoom={};
          groups.map((group) =>{ 
              newRoom={
                  id:group.room,
                  room:group.room
              }
              addedRooms = addedRooms.concat(newRoom);
          })


          let lenMessages=data.login.messages.length;
          let formatedMessages=[];
          for(let i=0; i<lenMessages; i++){
              let formatedTimeMessages=[];
              let numberMessages=data.login.messages[i].messages.length;
              for(let j=0;j<numberMessages; j++){ 
                  let time=data.login.messages[i].messages[j].time;               
                  let date = new Date(time)
                  let local=date.toLocaleString();
                  let d = new Date(local);
                  let hours = d.getHours();
                  let minutes = d.getMinutes();
                  let formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
                  let formatedTime=hours+':'+formattedMinutes;
                  let messageObj={
                      origin: data.login.messages[i].messages[j].origin, 
                      firstName: data.login.messages[i].messages[j].firstName,
                      lastName: data.login.messages[i].messages[j].lastName,
                      message: data.login.messages[i].messages[j].message,
                      time: formatedTime
                  }
                  formatedTimeMessages.push(messageObj);
          } 
          let obj={
              alreadyread:data.login.messages[i].alreadyread,
              room:data.login.messages[i].room,
              users:data.login.messages[i].users,
              name:data.login.messages[i].name,
              messages:formatedTimeMessages
          }
          formatedMessages.push(obj);
        }
        yield put(updateMessages(formatedMessages));
        yield put(updateRooms(addedRooms));
        yield put(updatePage('chat'));
      }
  
      if (errors){
          if (errors[0].message=='Do not exist' || errors[0].message=='Do not match'){
            yield put(updatePage('signIn'));
            yield put(updateErrorNotification('doesnotexist'));
          }
      }
    }catch(e){
    }  
}  

function* queryLogIn(){
  yield takeEvery(QUERY_LOGIN, queryLogInFunction)
}  

// ----------------------------------------------- 

const Get_Token_LogIn = gql`
query tokenLogin ($token: String){
  tokenLogin( input: {
      token: $token
  }) {
      user {
          _id
          email
          firstName
          lastName
          avatar
      }
      token
      language
      contact {
        identification
        contacts {
          id
          room
          status
          email
          firstName
          lastName
          avatar
        }
      }
      
      notification {
        _id
        notifications {
          id
        }
      }
      groupNotification {
        room
        members {
          id
        }
        name
      }
      group {
        room
        creator
        members {
          id
          email
          firstName
          lastName
          avatar
        }
        name
      }
      messages {
        alreadyread
        room
        users {
          id
        }
        name
        messages {
          origin
          firstName
          lastName
          message
          time
        }
      }
  }
}
`;

function getTokenLogInFunction (){
  const result = client.query({
    query: Get_Token_LogIn
  })
  return result
}

function* queryTokenLogInFunction() {
  try{
    let { errors, data } = yield call(getTokenLogInFunction);
    if (data.tokenLogin){
        let contactsNew=[];
        data.tokenLogin.contact.contacts.map((contact) =>{ 
            contactsNew = contactsNew.concat(contact);
        })
        let groupNew=data.tokenLogin.group; 
        let messages =data.tokenLogin.messages;
  
        messages.forEach(element => {
            let contact_alreadyread=element.alreadyread;

            if (!contact_alreadyread){
              contact_alreadyread='true';
            }
            let contact_room=element.room;
            let index=-1;
            index = contactsNew.findIndex(function (el){
                return el.room == contact_room;
            });
            if (index>=0){
                if (contactsNew[index].alreadyread=='false' || contactsNew[index].alreadyread=='true'){
                }else{
                    if (!contact_alreadyread){
                      contactsNew[index].alreadyread='true';
                    }else{
                      contactsNew[index].alreadyread=contact_alreadyread;
                    }
                }
            }
            index=-1;
            index = groupNew.findIndex(function (el){
                return el.room == contact_room;
            });
            if (index>=0){
                if (groupNew[index].alreadyread=='false' || groupNew[index].alreadyread=='true'){
                }else{
                  if (!contact_alreadyread){
                      groupNew[index].alreadyread=='true';
                  }else{
                      groupNew[index].alreadyread=contact_alreadyread;
                  }                  
                }
            }
        });
        let lan;
        if (data.tokenLogin.language){
            lan=data.tokenLogin.language;
        }else{
            lan='es';
        }
        yield put(updateLanguage(lan));
        yield put(updateUserData(data.tokenLogin.user))
        yield put(updateAvatar(data.tokenLogin.user.avatar));
        yield put(updateToken(data.tokenLogin.token));
        yield put(updateContacts(contactsNew));
        let addedRooms=[];
        let newRoom={};
        let contacts=data.tokenLogin.contact.contacts;
        contacts.map((contact) =>{ 
            newRoom={
                id:contact.id,
                room:contact.room
            }
            addedRooms = addedRooms.concat(newRoom);
        })
        yield put(updateNotifications(data.tokenLogin.notification.notifications.length));
        yield put(updateGroupNotifications(data.tokenLogin.groupNotification.length));
        yield put(updateGroups(groupNew));    
        let groups=data.tokenLogin.group;
        newRoom={};
        groups.map((group) =>{ 
            newRoom={
                id:group.room,
                room:group.room
            }
            addedRooms = addedRooms.concat(newRoom);
        })    

        let lenMessages=messages.length;
          let formatedMessages=[];
          for(let i=0; i<lenMessages; i++){
              let formatedTimeMessages=[];
              let numberMessages=messages[i].messages.length;
              for(let j=0;j<numberMessages; j++){ 
                  let time=messages[i].messages[j].time;               
                  let date = new Date(time)
                  let local=date.toLocaleString();
                  let d = new Date(local);
                  let hours = d.getHours();
                  let minutes = d.getMinutes();
                  let formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
                  let formatedTime=hours+':'+formattedMinutes;
                  let messageObj={
                      origin: messages[i].messages[j].origin, 
                      firstName: messages[i].messages[j].firstName,
                      lastName: messages[i].messages[j].lastName,
                      message: messages[i].messages[j].message,
                      time: formatedTime
                  }
                  formatedTimeMessages.push(messageObj);
          } 
          let obj={
              alreadyread:messages[i].alreadyread,
              room:messages[i].room,
              users:messages[i].users,
              name:messages[i].name,
              messages:formatedTimeMessages
          }
          formatedMessages.push(obj);
        }
        yield put(updateMessages(formatedMessages));
        yield put(updateRooms(addedRooms));
        yield put(updatePage('chat'));
    }

    if (errors){
        let str=errors[0].message;
        let res=str.includes('Boolean cannot represent a non boolean value');
        if (res){
        }else{
          yield put(updatePage('signIn'));
        }
    }
  }catch(e){
  }  
}

function* queryTokenLogIn(){
  yield takeEvery(QUERY_TOKEN_LOGIN, queryTokenLogInFunction)
}  

// -----------------------------------------------

const Put_SignUp = gql`
mutation createUser ($email: String!, $password: String!, $firstName: String!, $lastName: String!){
  createUser( input: {
        email: $email,
        password: $password,
        firstName: $firstName,
        lastName: $lastName
  }) {
        _id
        email
        firstName
        lastName
        tokens {
            token
        }
        }
  }
`
;

function putSignUpFunction (email, password, firstName, lastName){
  const result = client.mutate({
    mutation: Put_SignUp,
    variables: {email, password, firstName, lastName}
  })
  return result
}

function* mutationSignUpFunction(action) {
  try{
    const { errors, data } = yield call(putSignUpFunction, action.email, action.password, action.firstName, action.lastName);
    if (!errors){
      yield put(updatePage('signIn'));
    }
  }catch(e){
    yield put(updateErrorNotification('exist'));
  }
}  

function* mutationSignUp(){
  yield takeEvery(MUTATION_SIGNUP, mutationSignUpFunction)
}  
 
// ----------------------------------------------- 

const Get_Notification = gql`
query notification($id: String){
  notification( id: $id) {
    _id
    notifications {
      id
      email
      firstName
      lastName
      avatar
      room
    }
  }
}
`;

function getNotificationFunction (){
  const result = client.query({
    query: Get_Notification
  })
  return result
}
  function* queryNotificationFunction() {
    try{
      const { data }  = yield call(getNotificationFunction);
      yield put(updateRequesters(data.notification.notifications));
    }catch(e){
    }
}  

function* queryNotification(){
  yield takeEvery(QUERY_NOTIFICATION, queryNotificationFunction)
}  
// -----------------------------------------------

const Get_Group_Notification = gql`
query groupNotifications($id: String){
  groupNotifications(id: $id) {
    room
    creator
    members{
      id
      email
      firstName
      lastName
      avatar
    }
    name
  }
}
`;

function getGroupNotificationFunction (){
  const result = client.query({
    query: Get_Group_Notification
  })
  return result
}
function* queryGroupNotificationFunction() {
  try{
    const { data } = yield call(getGroupNotificationFunction);
    yield put(updateGroupRequesters(data.groupNotifications));
    yield put(updateGroupNotifications(data.groupNotifications.length));
  }catch(e){
  }
}  

function* queryGroupNotification(){
  yield takeEvery(QUERY_GROUP_NOTIFICATION, queryGroupNotificationFunction)
}  

// ----------------------------------------------- 

const Put_CreateNotification = gql`
mutation createNotification($id: String!){
  createNotification( id: $id) {
    user {
        identification
        contacts {
            id
            room
            status
            email
            firstName
            lastName
            avatar
        }
    }
    contactId
    number
  }
}
`;

function putCreateNotificationFunction (id){
  const result = client.mutate({
    mutation: Put_CreateNotification,
    variables: {id}
  })
  return result
}
  function* mutationCreateNotificationFunction(action) {
    try{
      const { data } = yield call(putCreateNotificationFunction, action.id);
      let len=data.createNotification.user.contacts.length;
      let contactFirstName=data.createNotification.user.contacts[len-1].firstName;
      let contactLastName=data.createNotification.user.contacts[len-1].lastName;
      let contactIdentification=data.createNotification.user.contacts[len-1].id;
      const getUser = (state) => state.userData;
      const userData = yield select(getUser);

      function addNewChat(contact){
           let room=contact.room;
           let users=[{id:userData._id, firstName: userData.firstName, lastName: userData.lastName},{id:contactIdentification, firstName:contactFirstName, lastName: contactLastName}];
           let messages=[];
           let contactRoom={
               new:'true',
               room:room, 
               users:users,
               name:'',
               messages:messages
           }
           return contactRoom;
      }
    
      let contactData=data.createNotification.user.contacts;
      let contactId=data.createNotification.contactId;
    
      let newRoom = contactData.filter(function (el){
              return el.id == contactId;
      });
    
      let addedRoom={
               id:newRoom[0].id,
               room:newRoom[0].room
      }
    
      let chat=[];
      chat= chat.concat(addNewChat(newRoom[0])); 
      yield put(addRooms(addedRoom));
      yield put(updateContacts(contactData));
      yield put(addNewContactMessage(addNewChat(newRoom[0])));
    }catch(e){
    }
  }  

  function* mutationCreateNotification(){
    yield takeEvery(MUTATION_CREATE_NOTIFICATION, mutationCreateNotificationFunction)
  }  

// ----------------------------------------------- 

const Put_CreateGroupNotification = gql`
mutation createGroupAndNotifications($input: [newmember], $name: String) {
  createGroupAndNotifications( input: {
            group:
                    {
                       members: $input
                   },
            name: $name       
     }) {
            room
            creator
            members{
               id
               email
               firstName
               lastName
               avatar
            }
            name
       }
   }
`
;

function putCreateGroupNotificationFunction (input, name){
  const result = client.mutate({
    mutation: Put_CreateGroupNotification,
    variables: {input, name}
  })
  return result
}
  function* mutationCreateGroupNotificationFunction(action) {
    try{
      const { data } = yield call(putCreateGroupNotificationFunction, action.input, action.name);
      yield put(updateGroups(data.createGroupAndNotifications));
      let len=data.createGroupAndNotifications.length;
      let newRoom={
        id: data.createGroupAndNotifications[len-1].room,
        room: data.createGroupAndNotifications[len-1].room
      }

      yield put(addRooms(newRoom));
      function addNewGroupChat(group){
        let room=group.room;
        let creator=group.creator;
        let users=group.members;
        let messages=[];
        let name=group.name;        
        let contactRoom={
            new:true,
            room:room,
            creator:creator, 
            users:users,
            name:name,
            messages:messages
        }
        return contactRoom;
      }

      let group=data.createGroupAndNotifications[len-1];
      yield put(addNewContactMessage(addNewGroupChat(group)));
      
   }catch(e){
   }
}  

  function* mutationCreateGroupNotification(){
    yield takeEvery(CREATE_GROUP_NOTIFICATION, mutationCreateGroupNotificationFunction)
  }  

// ----------------------------------------------- 

const Put_CreateContact = gql`
mutation createaContact ($contactid: String!, $room: String!){
  createContact( input: {
      contactid: $contactid,
      room: $room
  }) {
      user {
          identification
          contacts {
              id
              room
              email
              firstName
              lastName
              avatar
          }
      }
      contactId
      number
  }
}
`;

function putCreateContactFunction (contactid, room){
  const result = client.mutate({
    mutation: Put_CreateContact,
    variables: {contactid, room}
  })
  return result
}

function* mutationCreateContactFunction(action) {
  try{
    const { data } = yield call(putCreateContactFunction, action.contactid, action.room);  
    const getUser = (state) => state.userData;
    const userData = yield select(getUser);

    function addNewChat(contact){
        let room=contact.room;
        let users=[{id:userData._id, firstName: userData.firstName, lastName: userData.lastName},{id:contact.id, firstName:contact.firstName, lastName: contact.lastName}];
        let messages=[];
        let contactRoom={
            new:true,
            room, 
            users,
            name:'',
            messages
        }
        return contactRoom;
    }
  
      let contactData=data.createContact.user.contacts;
      let contactId=data.createContact.contactId;
  
      let newRoom = contactData.filter(function (el){
           return el.id == contactId;
      });
      
      let addedRoom={
            id:newRoom[0].id,
            room:newRoom[0].room
      } 
      
      yield put(addRooms(addedRoom));
      yield put(updateContacts(contactData));
      yield put(addNewContactMessage(addNewChat(newRoom[0])));
      yield put(updateNotifications(data.createContact.number));
  }catch(e){
  }  
}  

function* mutationCreateContact(){
  yield takeEvery(CREATE_CONTACT, mutationCreateContactFunction)
}  

// ----------------------------------------------- 

const Put_DeleteNotification = gql`
mutation deleteNotification ($contactid: String!, $room: String!){
  deleteNotification( input: {
    contactid: $contactid,
    room: $room
}) {
    number
  } 
}
`;

function putDeleteNotificationFunction (contactid, room){
  const result = client.mutate({
    mutation: Put_DeleteNotification,
    variables: {contactid, room}
  })
  return result
}
function* mutationDeleteNotificationFunction(action) {
  try{
    const { data } = yield call(putDeleteNotificationFunction, action.contactid, action.room);
    yield put(updateNotifications(data.deleteNotification.number));
  }catch(e){
  }
}  

function* mutationDeleteNotification(){
  yield takeEvery(DELETE_NOTIFICATION, mutationDeleteNotificationFunction)
}  

// ----------------------------------------------- 

const Put_DeleteGroupNotification = gql`
mutation deleteGroupNotification($room: String, $input: [newmember], $name: String ) {
  deleteGroupNotification( input: {
      group:
              {
                 room: $room,
                 members: $input,
             }
      name: $name
}) {
     number
 }
}
`;


function putDeleteGroupNotificationFunction (room, input, name){
  const result = client.mutate({
    mutation: Put_DeleteGroupNotification,
    variables: {room, input, name}
  })
  return result
}

function* mutationDeleteGroupNotificationFunction(action) {
  try{
    const { data } = yield call(putDeleteGroupNotificationFunction, action.room, action.input, action.name);
    yield put(updateGroupNotifications(data.deleteGroupNotification.number));
  }catch(e){

  }
}  

function* mutationDeleteGroupNotification(){
  yield takeEvery(DELETE_GROUP_NOTIFICATION, mutationDeleteGroupNotificationFunction)
}  

// ----------------------------------------------- 

const Put_CreateGroup = gql`
mutation createGroup($room: String, $input: [newmember], $name: String ) {
  createGroup( input: {
      group:
              {
                 room: $room,
                 members: $input,
             }
      name: $name
}) {
    group {
      room
      creator
      members {
        id
        email
        firstName
        lastName
        avatar
      }
      name
    }
    len
 }
}
`;

function putCreateGroupFunction (room, input, name){
  const result = client.mutate({
    mutation: Put_CreateGroup,
    variables: {room, input, name}
  })
  return result
}
function* mutationCreateGroupFunction(action) {
  try{
    const { data } = yield call(putCreateGroupFunction, action.room, action.input, action.name);
    yield put(updateGroups(data.createGroup.group));
    let len=data.createGroup.group.length;
    let newRoom={
        id: data.createGroup.group[len-1].room,
        room: data.createGroup.group[len-1].room
    }
    yield put(addRooms(newRoom));
    yield put(updateGroupNotifications(data.createGroup.len));
  
    function addNewGroupChat(group){
        let room=group.room;
        let creator=group.creator;
        let users=group.members;
        let name=group.name;
        let messages=[];
        let contactRoom={
            new:true,
            room, 
            creator,
            users,
            name,
            messages
        }
        return contactRoom;
      }
    let group=data.createGroup.group[len-1];
    yield put(addNewContactMessage(addNewGroupChat(group)));
    yield put(updatePage('chat'));
  }catch(e){
  }   
}  

function* mutationCreateGroup(){
  yield takeEvery(CREATE_GROUP, mutationCreateGroupFunction)
}  

// ----------------------------------------------- 

const Put_Upload = gql`
mutation singleUpload($file: String!) {
  singleUpload(file: $file){
    result
}
 }
`;

function putUploadFunction (file){
  const result = client.mutate({
    mutation: Put_Upload,
    variables: {file}
  })
  return result
}
function* mutationUploadFunction(action) {
  try{
    yield call(putUploadFunction, action.file);
  }catch(e){
  }
}  

function* mutationUpload(){
  yield takeEvery('UPLOAD', mutationUploadFunction)
}  

// ----------------------------------------------- 

const Put_UpdateUserData = gql`
mutation updateUserData($password: String, $firstName: String, $lastName: String) {
  updateUserData(input: {
      password: $password,
      firstName: $firstName,
      lastName: $lastName
}) {
    _id
    email
    firstName
    lastName
    avatar
  } 
}
`;

function putUpdateUserDataFunction (password, firstName, lastName){
  const result = client.mutate({
    mutation: Put_UpdateUserData,
    variables: {password, firstName, lastName}
  })
  return result
}
function* mutationUpdateUserDataFunction(action) {
  try{
    const {data} = yield call(putUpdateUserDataFunction, action.password, action.firstName, action.lastName);
    yield put(updateUserData(data.updateUserData));
  }catch(e){
  }
}  

function* mutationUpdateUserData(){
  yield takeEvery(MUTATION_UPDATE_USER_DATA, mutationUpdateUserDataFunction)
}  

// ----------------------------------------------- 

const Put_NewMessage = gql`
mutation newMessage($room: String, $message: String) {
  newMessage( input: {
            room: $room,
            message: $message,       
     }) {
        id
        room
        origin
        firstName 
        lastName
        message
        time 
       }
   }
`
;
function putNewMessageFunction (room, message){
  const result = client.mutate({
    mutation: Put_NewMessage,
    variables: {room, message}
  })

  return result
}

  function* mutationNewMessageFunction(action) {
    try{
      const { data } = yield call(putNewMessageFunction, action.room, action.inputmessage);   
      if (data){
        const getContacts = (state) => state.contacts;
        let contacts = yield select(getContacts);
          
        let index=-1;
        index = contacts.findIndex(function (el){
            return el.room == data.newMessage.room;
        });

        if (index>=0){
            let cont=[];
            contacts.map((contact) =>{ 
                let newContact={
                    id:contact.id,
                    room:contact.room,
                    email:contact.email,
                    firstName:contact.firstName,
                    lastName:contact.lastName,
                    alreadyread:contact.alreadyread,
                    avatar:contact.avatar
                }
                cont= cont.concat(newContact);
            })
            cont[index].alreadyread = true;
            yield put(updateContacts(cont));
        }  

           
        const getGroups = (state) => state.groups;
        let groups = yield select(getGroups);
        index=-1;
        index = groups.findIndex(function (el){
            return el.room == data.newMessage.result;
        });
        if (index>=0){
            let gro=[];
            groups.map((group) =>{ 
                let newGroup={
                    room:group.room,
                    creator:group.creator,
                    members:group.members,
                    name:group.name,
                    alreadyread:group.alreadyread
                }
                gro= gro.concat(newGroup);
            })
            gro[index].alreadyread = true;
            yield put(updateGroups(gro));
        } 
      }
   }catch(e){
   }
}
  
function* mutationNewMessage(){
  yield takeEvery(NEW_MESSAGE, mutationNewMessageFunction)
}  

// ----------------------------------------------- 

const Put_NewStatus = gql`
mutation newStatus($id: String, $room: String, $status: String) {
  newStatus( input: {
            id: $id,
            room: $room,
            status: $status   
     }) {
          room
          status
       }
   }
`
;
function putNewStatusFunction (id, room, status){
  const result = client.mutate({
    mutation: Put_NewStatus,
    variables: {id, room, status}
  })
  return result
}
  function* mutationNewStatusFunction(action) {
    try{
      const {data } = yield call(putNewStatusFunction, action.id, action.room, action.status);    
    }catch(e){
    }
  }  

  function* mutationNewStatus(){
    yield takeEvery(NEW_STATUS, mutationNewStatusFunction)
  }  

// ----------------------------------------------- 

const Put_NewLanguage = gql`
mutation newLanguage($language: String!) {
  newLanguage(language: $language) {
          language
       }
   }
`
;
function putNewLanguageFunction (language){
  const result = client.mutate({
    mutation: Put_NewLanguage,
    variables: {language}
  })

  return result
}
  function* mutationNewLanguageFunction(action) {
    try{
      const { data } = yield call(putNewLanguageFunction, action.language);  
      const lan=data.newLanguage.language;
      yield put(updateLanguage(lan));  
   }catch(e){
   }
}  

  function* mutationNewLanguage(){
    yield takeEvery(NEW_LANGUAGE, mutationNewLanguageFunction);
  }  

// ----------------------------------------------- 

const Put_EditGroup = gql`
mutation editGroup($room: String, $input: [newmember], $name: String) {
  editGroup( input: {
            group:
                    {
                      room: $room,
                      members: $input,
                   },
            name: $name       
     }) {
          room
          creator
          members{
               id
               email
               firstName
               lastName
               avatar
          }
          name
       }
   }
`
;

function putEditGroupFunction (room, input, name){
  const result = client.mutate({
    mutation: Put_EditGroup,
    variables: {room, input, name}
  })
  return result
}
  function* mutationEditGroupFunction(action) {
    try{
      const {data } = yield call(putEditGroupFunction, action.room, action.input, action.name);
      yield put(updateGroups(data.editGroup));
   }catch(e){
   }
}  

  function* mutationEditGroup(){
    yield takeEvery(EDIT_GROUP, mutationEditGroupFunction)
  }  

// ----------------------------------------------- 

const Put_LeaveGroup = gql`
mutation leaveGroup($room: String, $input: [newmember]) {
  leaveGroup( input: {
            group:
                    {
                      room: $room,
                      members: $input,
                   },   
     }) {
          room
          creator
          members{
               id
               email
               firstName
               lastName
               avatar
          }
          name
       }
   }
`
;

function putLeaveGroupFunction (room, input){
  const result = client.mutate({
    mutation: Put_LeaveGroup,
    variables: {room, input}
  })
  return result
}
  function* mutationLeaveGroupFunction(action) {
    try{
      const { data } = yield call(putLeaveGroupFunction, action.room, action.input);
      const getMessages = (state) => state.messages
      let messages = yield select(getMessages);
      const getRooms = (state) => state.rooms
      let rooms = yield select(getRooms);
      let messagesRooms=[];
      let dataLen=data.leaveGroup.length;
      for (let i=0; i<dataLen; i++){
          let foundGroup = messages.find(element => element.room == data.leaveGroup[i].room);
          if (!foundGroup){
            messagesRooms=messagesRooms.concat(data.leaveGroup[i].room);
          }
      }
      let messagesRoomsLen=messagesRooms.length;
      for (let j=0; j<messagesRoomsLen; j++){
          messages= messages.filter((el) => {
              return el.room != messagesRooms[j];
          });
          rooms= rooms.filter((el) => {
            return el.room != messagesRooms[j];
          });
      }
      yield put(updateCurrentRoom([]));
      yield put(updateCurrentChat([]));
      yield put(updateMessages(messages));
      yield put(updateRooms(rooms));
      yield put(updateGroups(data.leaveGroup));
    }catch(e){
    }
}  

  function* mutationLeaveGroup(){
    yield takeEvery(LEAVE_GROUP, mutationLeaveGroupFunction)
  }  

// ----------------------------------------------- 

const Put_DeleteContact = gql`
mutation deleteContact ($contactid: String!, $room: String!){
  deleteContact( input: {
    contactid: $contactid,
    room: $room
}) {
    number
  } 
}
`;

function putDeleteContactFunction (contactid, room){
  const result = client.mutate({
    mutation: Put_DeleteContact,
    variables: {contactid, room}
  })
  return result
}
function* mutationDeleteContactFunction(action) {
  try{
    const { data } = yield call(putDeleteContactFunction, action.contactid, action.room);
    yield put(updateNotifications(data.deleteContact.number));
  }catch(e){
  }
}  

function* mutationDeleteContact(){
  yield takeEvery(DELETE_CONTACT, mutationDeleteContactFunction)
}  

// ----------------------------------------------- 

export default function* rootSaga() {
    yield all([
      queryUser(),         
      queryContact(),  
      queryGroups(),    
      queryLogIn(),        
      queryTokenLogIn(),   
      mutationSignUp(), 
      queryNotification(),               
      queryGroupNotification(),
      mutationCreateNotification(),
      mutationCreateGroupNotification(),
      mutationCreateContact(),
      mutationDeleteNotification(),
      mutationDeleteContact(),
      mutationDeleteGroupNotification(),
      mutationCreateGroup(),
      mutationUpload(), 
      mutationUpdateUserData(),
      mutationNewMessage(), 
      mutationNewStatus(),
      mutationEditGroup(),
      mutationLeaveGroup(),
      mutationNewLanguage(),
    ])
  }