import { put, call, takeEvery, all } from 'redux-saga/effects';
import {gql} from '@apollo/client';
import client from '../../app';
import { updateUserData } from '../slice/userDataSlice';
import { updateToken } from '../slice/tokenSlice';
import { updateContacts } from '../slice/contactsSlice';
import { updateGroups } from '../slice/groupsSlice';
import { updateNotifications } from '../slice/notificationsSlice';
import { updateGroupNotifications } from '../slice/groupNotificationsSlice';
import {eliminateGroupNotification} from '../slice/groupNotificationsSlice';
import { updateRooms } from '../slice/roomsSlice';
import { updateMessages } from '../slice/messagesSlice';
import { updatePage } from '../slice/pageSlice';
import {updateRequesters} from '../slice/requestersSlice';
import { updateGroupRequesters } from '../slice/groupRequestersSlice';
import {addRooms} from '../slice/roomsSlice';
import {addNewContactMessage} from '../slice/messagesSlice';
import { updateErrorNotification } from '../slice/errorNotificationSlice';
import { updateAvatar } from '../slice/avatarSlice';
import { updateReceivedStatus } from '../slice/receivedStatusSlice';
import { select } from 'redux-saga/effects';   
import { updateLanguage } from '../slice/languageSlice';

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
      yield put({ type: 'GET_USER_UPDATE', data })
      yield put(updateReceivedStatus('Loaded'));
    }
    if (errors){
      let data={user:{email:''}};
      yield put({ type: 'GET_USER_UPDATE', data })
      yield put(updateReceivedStatus('Loaded'));
    }
  }catch(e){
  }  
}  

function* queryUser(){
  yield takeEvery('QUERY_USER', queryUserFunction)
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
  yield takeEvery('QUERY_CONTACT', queryContactFunction)
}  

// -----------------------------------------------

const Get_Groups = gql`
  query groups ($id: String){
    groups( id: $id) {
      room
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
    yield put(updateGroups(data.groups));
  }catch(e){
  }
}  

function* queryGroups(action){
  yield takeEvery('QUERY_GROUPS', queryGroupsFunction)
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
              lan='es';
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

          yield put(updateMessages(data.login.messages));
          yield put(updateRooms(addedRooms));
          yield put(updatePage('chat'));
      }
  
      if (errors){
          if (errors[0].message=='Do not exist'){
              yield put(updatePage('signIn'));
              yield put(updateErrorNotification('doesnotexist'));
          }
          if (errors[0].message=='Do not match'){
              yield put(updatePage('signIn'));
              yield put(updateErrorNotification('doesnotmatch'));
          }
      }
    }catch(e){
    }  
}  

function* queryLogIn(){
  yield takeEvery('QUERY_LOGIN', queryLogInFunction)
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
        yield put(updateMessages(messages));
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
  yield takeEvery('QUERY_TOKEN_LOGIN', queryTokenLogInFunction)
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
  yield takeEvery('MUTATION_SIGNUP', mutationSignUpFunction)
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
  yield takeEvery('QUERY_NOTIFICATION', queryNotificationFunction)
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
  }catch(e){
  }
}  

function* queryGroupNotification(){
  yield takeEvery('QUERY_GROUP_NOTIFICATION', queryGroupNotificationFunction)
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
    yield takeEvery('MUTATION_CREATE_NOTIFICATION', mutationCreateNotificationFunction)
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
        let users=group.members;
        let messages=[];
        let name=group.name;        
        let contactRoom={
            new:true,
            room:room, 
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
    yield takeEvery('CREATE_GROUP_NOTIFICATION', mutationCreateGroupNotificationFunction)
  }  

// ----------------------------------------------- 

const Put_CreateContact = gql`
mutation createaContact ($contactid: String!){
  createContact( input: {
      contactid: $contactid
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


function putCreateContactFunction (contactid){
  const result = client.mutate({
    mutation: Put_CreateContact,
    variables: {contactid}
  })
  return result
}

function* mutationCreateContactFunction(action) {
  try{
    const { data } = yield call(putCreateContactFunction, action.contactid);  
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
  yield takeEvery('CREATE_CONTACT', mutationCreateContactFunction)
}  

// ----------------------------------------------- 

const Put_DeleteNotification = gql`
mutation deleteNotification ($contactid: String!){
  deleteNotification( contactid: $contactid) {
    number
  } 
}
`;

function putDeleteNotificationFunction (contactid){
  const result = client.mutate({
    mutation: Put_DeleteNotification,
    variables: {contactid}
  })
  return result
}
function* mutationDeleteNotificationFunction(action) {
  try{
    const { data } = yield call(putDeleteNotificationFunction, action.contactid);
    yield put(updateNotifications(data.deleteNotification.number));
  }catch(e){
  }
}  

function* mutationDeleteNotification(){
  yield takeEvery('DELETE_NOTIFICATION', mutationDeleteNotificationFunction)
}  

// ----------------------------------------------- 

const Put_DeleteGroupNotification = gql`
mutation deleteGroupNotification ($room: String!){
  deleteGroupNotification(room: $room) {
    number
  } 
}
`;

function putDeleteGroupNotificationFunction (room){
  const result = client.mutate({
    mutation: Put_DeleteGroupNotification,
    variables: {room}
  })
  return result
}

function* mutationDeleteGroupNotificationFunction(action) {
  try{
    const { data } = yield call(putDeleteGroupNotificationFunction, action.room);
    yield put(updateGroupNotifications(data.deleteGroupNotification.number));
  }catch(e){
  }
}  

function* mutationDeleteGroupNotification(){
  yield takeEvery('DELETE_GROUP_NOTIFICATION', mutationDeleteGroupNotificationFunction)
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
     room
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
    yield put(updateGroups(data.createGroup));
    let len=data.createGroup.length;
  
      let newRoom={
          id: data.createGroup[len-1].room,
          room: data.createGroup[len-1].room
      }
  
      yield put(addRooms(newRoom));
      yield put(eliminateGroupNotification());
  
      function addNewGroupChat(group){
          let room=group.room;
          let users=group.members;
          let name=group.name;
          let messages=[];
          let contactRoom={
              new:true,
              room, 
              users,
              name,
              messages
          }
          return contactRoom;
      }
  
    let group=data.createGroup[len-1];
    yield put(addNewContactMessage(addNewGroupChat(group)));
    yield put(updatePage('chat'));
  }catch(e){
  }   
}  

function* mutationCreateGroup(){
  yield takeEvery('CREATE_GROUP', mutationCreateGroupFunction)
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
mutation updateUserData($email: String, $password: String, $firstName: String, $lastName: String) {
  updateUserData(input: {
      email: $email,
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

function putUpdateUserDataFunction (email, password, firstName, lastName){
  const result = client.mutate({
    mutation: Put_UpdateUserData,
    variables: {email, password, firstName, lastName}
  })
  return result
}
function* mutationUpdateUserDataFunction(action) {
  try{
    yield call(putUpdateUserDataFunction, action.email, action.password, action.firstName, action.lastName);
  }catch(e){
  }
}  

function* mutationUpdateUserData(){
  yield takeEvery('MUTATION_UPDATE_USER_DATA', mutationUpdateUserDataFunction)
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
  yield takeEvery('NEW_MESSAGE', mutationNewMessageFunction)
}  

// ----------------------------------------------- 

const Put_CreateNewStatus = gql`
mutation createNewStatus($id: String, $room: String, $status: String) {
  createNewStatus( input: {
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
function putCreateNewStatusFunction (id, room, status){
  const result = client.mutate({
    mutation: Put_CreateNewStatus,
    variables: {id, room, status}
  })
  return result
}
  function* mutationCreateNewStatusFunction(action) {
    try{
      const {data } = yield call(putCreateNewStatusFunction, action.id, action.room, action.status);    
    }catch(e){
    }
  }  

  function* mutationCreateNewStatus(){
    yield takeEvery('CREATE_NEW_STATUS', mutationCreateNewStatusFunction)
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
    yield takeEvery('NEW_LANGUAGE', mutationNewLanguageFunction);
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
      const { data } = yield call(putEditGroupFunction, action.room, action.input, action.name);
      yield put(updateGroups(data.editGroup));
   }catch(e){
   }
}  

  function* mutationEditGroup(){
    yield takeEvery('EDIT_GROUP', mutationEditGroupFunction)
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
      mutationDeleteGroupNotification(),
      mutationCreateGroup(),
      mutationUpload(), 
      mutationUpdateUserData(),
      mutationNewMessage(), 
      mutationCreateNewStatus(),
      mutationEditGroup(),
      mutationNewLanguage(),
    ])
  }