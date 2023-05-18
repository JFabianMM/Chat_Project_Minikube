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
  let { errors, data } = yield call(getUserFunction, action.email);
  if (data.user){
    yield put({ type: 'GET_USER_UPDATE', data })
  }
  if (errors){
    let data={user:{email:''}};
    yield put({ type: 'GET_USER_UPDATE', data })
  }
}  

function* queryUser(action){
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
  const { errors, data } = yield call(getContactFunction);
  if (data.contacts.contacts){
    yield put(updateContacts(data.contacts.contacts));
  }
}  

function* queryContact(){
  yield takeEvery('QUERY_CONTACT', queryContactFunction)
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
          id
          origin
          firstName
          lastName
          message
          position
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
    const { errors, data } = yield call(getLogInFunction, action.email, action.password);
  
    if (data.login){
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
          id
          origin
          firstName
          lastName
          message
          position
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
    const { errors, data } = yield call(getTokenLogInFunction);
    if (data.tokenLogin){
        let contactsNew=data.tokenLogin.contact.contacts; 
        let groupNew=data.tokenLogin.group; 
        data.tokenLogin.messages.forEach(element => {
            let contact_alreadyread=element.alreadyread;
            let contact_room=element.room;
            let index=-1;
            index = contactsNew.findIndex(function (el){
                return el.room == contact_room;
            });
            if (index>=0){
                if (contactsNew[index].alreadyread==false || contactsNew[index].alreadyread==true){
                }else{
                    contactsNew[index].alreadyread=contact_alreadyread;
                }
            }
            index=-1;
            index = groupNew.findIndex(function (el){
                return el.room == contact_room;
            });
            if (index>=0){
                if (groupNew[index].alreadyread==false || groupNew[index].alreadyread==true){
                }else{
                    groupNew[index].alreadyread=contact_alreadyread;
                }
            }
        });

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
    
        yield put(updateMessages(data.tokenLogin.messages));
        yield put(updateRooms(addedRooms));
        yield put(updatePage('chat'));
    }

    if (errors){
        yield put(updatePage('signIn'));  
    }

}

function* queryTokenLogIn(){
  yield takeEvery('QUERY_TOKEN_LOGIN', queryTokenLogInFunction)
}  

// -----------------------------------------------

const Put_SignUp = gql`
mutation createaUser ($email: String!, $password: String!, $firstName: String!, $lastName: String!){
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
    variables: {email: email, password: password, firstName: firstName, lastName: lastName}
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

function* mutationSignUp(action){
  yield takeEvery('MUTATION_SIGNUP', mutationSignUpFunction)
}  

// ----------------------------------------------- 
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
    notifications {
      id
    }
  }
}
`
;


function putCreateNotificationFunction (id){
  const result = client.mutate({
    mutation: Put_CreateNotification,
    variables: {id: id}
  })
  return result
}
  function* mutationCreateNotificationFunction(action) {
    try{
      const { data } = yield call(putCreateNotificationFunction, action.id);
    }catch(e){
    }
  }  

  function* mutationCreateNotification(action){
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
    variables: {input: input, name: name}
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

  function* mutationCreateGroupNotification(action){
    yield takeEvery('CREATE_GROUP_NOTIFICATION', mutationCreateGroupNotificationFunction)
  }  

// ----------------------------------------------- 

const Put_CreateContact = gql`
mutation createaContact ($userid: String!, $contactid: String!){
  createContact( input: {
      userid: $userid,
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


function putCreateContactFunction (userid, contactid){
  const result = client.mutate({
    mutation: Put_CreateContact,
    variables: {userid: userid, contactid:contactid}
  })
  return result
}

function* mutationCreateContactFunction(action) {
  try{
    const { data } = yield call(putCreateContactFunction, action.userid, action.contactid);

    function addNewChat(contact){
        let room=contact.room;
        let users=[{id:action.userid, firstName: action.userfirstName, lastName: action.userlastName},{id:contact.id, firstName:contact.firstName, lastName: contact.lastName}];
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

function* mutationCreateContact(action){
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
    variables: {contactid:contactid}
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

function* mutationDeleteNotification(action){
  yield takeEvery('DELETE_NOTIFICATION', mutationDeleteNotificationFunction)
}  

// ----------------------------------------------- 

const Put_DeleteGroupNotification = gql`
mutation deleteGroupNotification ($room: String!){
  deleteGroupNotification( room: $room) {
    number
  } 
}
`;

function putDeleteGroupNotificationFunction (room){
  const result = client.mutate({
    mutation: Put_DeleteGroupNotification,
    variables: {room:room}
  })
  return result
}
function* mutationDeleteGroupNotificationFunction(action) {
  try{
    const { data } = yield call(putDeleteGroupNotificationFunction, action.room );
    yield put(updateGroupNotifications(data.deleteGroupNotification.number));
  }catch(e){
  }
}  

function* mutationDeleteGroupNotification(action){
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

function* mutationCreateGroup(action){
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
    const { data } = yield call(putUploadFunction, action.file);
  }catch(e){
  }
}  

function* mutationUpload(action){
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
    const { data } = yield call(putUpdateUserDataFunction, action.email, action.password, action.firstName, action.lastName);
  }catch(e){
  }
}  

function* mutationUpdateUserData(action){
  yield takeEvery('MUTATION_UPDATE_USER_DATA', mutationUpdateUserDataFunction)
}  

// ----------------------------------------------- 
// ----------------------------------------------- 
const Put_CreateNewMessage = gql`
mutation createNewMessage($id: String, $room: String, $idNumber: Int, $origin: String, $firstName: String, $lastName: String, $position: String, $message: String, $time: String) {
  createNewMessage( input: {
            id: $id,
            room: $room,
            idNumber: $idNumber,
            origin: $origin, 
            firstName: $firstName, 
            lastName: $lastName, 
            position: $position,
            message: $message, 
            time: $time       
     }) {
          result
       }
   }
`
;
function putCreateNewMessageFunction (id, room, newMessage){
  let ids=newMessage.id;
  let origin=newMessage.origin;
  let firstName= newMessage.firstName;
  let lastName= newMessage.lastName;
  let position= newMessage.position;
  let message= newMessage.message;
  let time= newMessage.time;
  const result = client.mutate({
    mutation: Put_CreateNewMessage,
    variables: {id, room, idNumber: ids, origin, firstName, lastName, position, message, time}
  })

  return result
}
  function* mutationCreateNewMessageFunction(action) {
    try{
      const { data } = yield call(putCreateNewMessageFunction, action.id, action.room, action.newMessage);   
      if (data){
        const getContacts = (state) => state.contacts
        let contacts = yield select(getContacts);       
        let index=-1;
        index = contacts.findIndex(function (el){
            return el.room == data.createNewMessage.result;
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
            return el.room == data.createNewMessage.result;
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

  function* mutationCreateNewMessage(action){
    yield takeEvery('CREATE_NEW_MESSAGE', mutationCreateNewMessageFunction)
  }  

// ----------------------------------------------- 

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
      const { data } = yield call(putCreateNewStatusFunction, action.id, action.room, action.status);   
    }catch(e){
    }
  }  

  function* mutationCreateNewStatus(action){
    yield takeEvery('CREATE_NEW_STATUS', mutationCreateNewStatusFunction)
  }  

// ----------------------------------------------- 


export default function* rootSaga() {
    yield all([
      queryUser(),         
      queryContact(),      
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
      mutationCreateNewMessage(), 
      mutationCreateNewStatus()
    ])
  }