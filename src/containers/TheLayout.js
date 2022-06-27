import React, { useEffect, useState } from 'react'
import {
  TheContent,
  TheSidebar,
  TheFooter
} from './index'
import  useApi from '../services/api';
import { useHistory } from 'react-router-dom';


const TheLayout = () => {
  const api = useApi();
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  useEffect(()=>{
    const checkLogin = async ()=>{
      if (api.getToken()){
        const result = await api.validadeToken(); 
        alert("ln 20 - em TheLayout - pós validateToken() - error: "+result.error);
        if (result.error === ""){
          setLoading(false);  
        }
        else{
          alert("TheLayout - useEfect | "+result.error);
          history.push('/login');
        }
      }else{
        history.push('/login');
      }
    }
    checkLogin();
  },[]);

  
  return (
    <div className="c-app c-default-layout">
      {!loading &&
        <>
          <TheSidebar/>
          <div className="c-wrapper">
            <div className="c-body">
              <TheContent/>
            </div>
            <TheFooter/>
          </div>
        </>
       }
    </div>
  )
}

export default TheLayout
