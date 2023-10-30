import { configureStore } from "@reduxjs/toolkit";
import { tokenReducer, userDataReducer, searchMessageReducer, roomsReducer, requestersReducer, receivedStatusReducer, pageReducer, notificationsReducer, messagesReducer, languageReducer, groupsReducer, groupRequestersReducer, groupNotificationsReducer, groupNameReducer, fileReducer, errorNotificationReducer, currentRoomReducer, currentChatReducer, contactsReducer, avatarReducer, getContactReducer, getUserReducer } from "./redux/slice";
import createSagaMiddleware from "redux-saga";
import rootSaga from './redux/sagas/sagas';

const sagaMiddleware = createSagaMiddleware();
const middlewares = [sagaMiddleware];

export const store =configureStore({
     reducer: {
         token: tokenReducer,
         userData: userDataReducer,
         contacts: contactsReducer,
         groups: groupsReducer,
         notifications: notificationsReducer,
         groupNotifications: groupNotificationsReducer,
         rooms: roomsReducer,
         messages: messagesReducer,
         currentRoom: currentRoomReducer,
         currentChat: currentChatReducer,
         page: pageReducer,
         getUser: getUserReducer,
         getContact: getContactReducer,
         requesters: requestersReducer,
         groupRequesters: groupRequestersReducer,
         errorNotification: errorNotificationReducer,
         groupName: groupNameReducer,                
         language: languageReducer,
         file: fileReducer,
         avatar: avatarReducer,
         receivedStatus: receivedStatusReducer,
         searchMessage: searchMessageReducer
     },
        middleware: (getDefaultMiddleware) => {
            const middleware = [
                ...getDefaultMiddleware({ thunk: false }),
                ...middlewares,
            ];
        return middleware;
    },
})

sagaMiddleware.run(rootSaga);