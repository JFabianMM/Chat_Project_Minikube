import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { SignIn } from "./components/SignIn";
import { SignUp } from "./components/SignUp";
import { Chat } from "./components/Chat";
import {useSelector} from 'react-redux';
import {useDispatch} from 'react-redux';
import { getCookie } from './functions/getCookie';
import { updateLanguage } from '../redux/slice/languageSlice';
import "../public/css/styles.css";

export function App() {
    const { t, i18n } = useTranslation();
    const page = useSelector(state => state.page);
    const language = useSelector(state => state.language);
    const Dispatch = useDispatch();

    useEffect(() => {
        let languageData = sessionStorage.getItem("language");
        // console.log('languageData', languageData);
        if (languageData){
            if (languageData=='en' || languageData=='es' || languageData=='fr'){
                i18n.changeLanguage(languageData);
                Dispatch(updateLanguage(languageData));
            }else{
                i18n.changeLanguage(language);
                Dispatch(updateLanguage(language));
            }
        }else{
            i18n.changeLanguage(language);
            Dispatch(updateLanguage(language));
        }
        // i18n.changeLanguage(language);
      }, [language]);

    let token = getCookie("token");
    let flag=0;
    if (token != '' && page ==''){
         Dispatch({type: 'QUERY_TOKEN_LOGIN'});
         flag=1;
    }
    if (page=='signIn' || page=='' && flag==0){
        return (
            <div>
                <SignIn i18n={i18n} t={t} />
            </div>
        );
    }
    if (page=='signUp'){
        return (
            <div>
                <SignUp i18n={i18n} t={t} /> 
            </div>
        )       
    }
    if (page=='chat'){
        return (
            <div>
                <Chat i18n={i18n} t={t} />
            </div>
        )       
    }
}

export default App;
