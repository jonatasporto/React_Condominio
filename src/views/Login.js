import React, { useState } from 'react'
import useAPi from '../services/api';
import { useHistory } from 'react-router-dom';
import {
  CAlert,
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CInput,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CRow
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

const Login = () => {
  const api = useAPi();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [load, setLoad] = useState(false);
  const history = useHistory();

  const clickDoBtnEntrar = async()=>{
    if (email && senha){
      setLoad(true);
      //alert('email: '+ email + ' senha: '+senha);
      const result = await api.login(email,senha);
      setLoad(false);
      if (result.error ===''){
        console.log("token do login: "+ result.token);
        //console.log("return do login: "+result);
        localStorage.setItem('token', result.token);
        history.push('/')
      }else{
        setError(result.error); 
      }

    }else {
      setError('Digite os dados!!!');
    }
  }

  return (
    
    <div className="c-app c-default-layout flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md="5">
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm>
                    <h1>Login!!!</h1>
                    <p className="text-muted">Acesse sua conta.</p>
                    {error !=='' && <CAlert color='danger'>{error}</CAlert>}
                    <CInputGroup className="mb-3">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-user" />
                        </CInputGroupText>
                      </CInputGroupPrepend>

                      <CInput disabled={load} type="text" placeholder="E-mail" value={email} onChange={e=>setEmail(e.target.value)} />
                    </CInputGroup>

                    <CInputGroup className="mb-4">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-lock-locked" />
                        </CInputGroupText>

                      </CInputGroupPrepend>
                      <CInput disabled={load} type="password" placeholder="Senha" value={senha} onChange={e=>setSenha(e.target.value)}/>
                    </CInputGroup>

                    <CRow>
                      <CCol xs="6">
                        <CButton color="primary" className="px-4" onClick={clickDoBtnEntrar} disabled={load}>
                          {load ? 'Carregando...' : 'Entrar !'}
                          </CButton>
                      </CCol>
                    </CRow>

                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
