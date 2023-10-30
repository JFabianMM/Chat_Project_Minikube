import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { SignIn, SignUp, Chat } from "./components";
import {useSelector, useDispatch} from 'react-redux';
import { getCookie } from './functions/getCookie';
import { updateLanguage } from '../redux/slice/languageSlice';
import "../public/css/styles.css";
import { queryTokenLogin } from './actions/actions';

export function App() {
    const { t, i18n } = useTranslation();
    const page = useSelector(state => state.page);
    const language = useSelector(state => state.language);
    const Dispatch = useDispatch();

    let  navLang = navigator.language.substring(0, 2);

    useEffect(() => {
        let languageData = sessionStorage.getItem("language");
        if (languageData){
            if (languageData=='en' || languageData=='es' || languageData=='fr'){
                i18n.changeLanguage(languageData);
                Dispatch(updateLanguage(languageData));
            }else{
                i18n.changeLanguage(language);
                Dispatch(updateLanguage(language));
            }
        }else{
            if (navLang=='es' || navLang=='en' || navLang=='fr'){
                i18n.changeLanguage(navLang);
                Dispatch(updateLanguage(navLang));
            }else{
                i18n.changeLanguage(language);
                Dispatch(updateLanguage(language));
            }
        }
      }, [language]); 

    let token = getCookie("token");
    let flag=0;
    if (token != '' && page ==''){
         Dispatch(queryTokenLogin());
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
