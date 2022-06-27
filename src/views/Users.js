import React, {useState, useEffect} from "react";
import useApi from '../services/api';
import { CButton, CButtonGroup, CCard, CCardBody, CCardHeader, CCol, CDataTable, CFormGroup, 
        CInput, CLabel, CModal, CModalBody, CModalFooter, CModalHeader, CRow} from '@coreui/react';
import CIcon from "@coreui/icons-react";


export default ()=>{
    const api = useApi();
    const [loading, setLoading] = useState(true);
    const [list, setList] = useState([]); 
    const [showModal,setShowModal] = useState(false);
    const [modalLoading,setModalLoading] = useState(false);
    const [modalId, setModalId] = useState('');
    const [modalNameField, setModalNameField] = useState('');
    const [modalEmailField, setModalEmailField] = useState('');
    const [modalCPFfield, setModalCPFfield] = useState('');
    const [modalPass1Field, setModalPass1Field] = useState('');
    const [modalPass2Field, setModalPass2Field] = useState('');

    const fields = [
        {label:'Nome', key:'name', sorter:false},
        {label:'E-mail', key:'email', sorter:false},
        {label:'CPF', key:'cpf '},
        {label:'Ações', key:'actions', _style:{width: '1px'}, sorter:false, filter: false}
    ];


    useEffect(()=>{
        getList();
    },[]);

    const getList = async ()=>{
        setLoading(true);
        const result = await api.getUsers();
        setLoading(false);
        if (result===''){
            setList(result.list);
        } else{
            alert(result.error);
        }   
    }

    const noCloseDoModal = ()=>{
        setShowModal(false);
    }

    const noClickDoEditar = (id)=>{
        let index = list.findIndex(v=>v.id===id);
        setModalId(list[index]['id']);
        setModalNameField(list[index]['name'])
        setModalEmailField(list[index]['email'])
        setModalCPFfield(list[index]['cpf']);
        setModalPass1Field('');
        setModalPass2Field('');
        setShowModal(true);
    }


    const noClickDoExcluir = async(id)=>{
        let index = list.findIndex(v=>v.id===id);
        if (window.confirm(`Tem certeza que deseja excluir ${(list[index]['name']).toUpperCase()} da base de dados?`)){
            const result = await api.deleteUser(list[index]['id']);
            if (result.error ===''){
                getList();
            }else{
                alert(result.error);
            }
        }
        
    }

    const noClickDoSalvar = async()=>{
        if (modalNameField && modalEmailField && modalCPFfield){
            setModalLoading(true);
            let result;
            let data=  {
                name: modalNameField,
                email: modalEmailField,
                cpf: modalCPFfield
            }
            if (modalPass1Field){
                if (modalPass1Field===modalPass2Field){
                    data.password= modalPass1Field;
                }else{
                    alert("SEnhas não batem!");
                    setModalLoading(false);
                }
            }

            if (modalId ===''){
                result = await api.addUsers(data);
            }else{
                result = await api.updateUsers(modalId,data); 
            }
            setModalLoading(false);
            if (result.error === ''){
                setShowModal(false);
                getList();
            }else{
                alert(result.error);
            }
        }
        else{
            alert('Prenncha os campos.');
        }
    }

    const noClickDoNovoAviso = ()=>{
        setModalId('');
        setModalNameField('');
        setModalEmailField('');
        setModalCPFfield('');
        setModalPass1Field('');
        setModalPass2Field('');
        setShowModal(true);
    }

    return(
        <>
            <CRow>
                <CCol>
                    <h2>Usuários</h2>
                    <CCard>
                        <CCardHeader>
                            <CButton color="primary" onClick={noClickDoNovoAviso} >
                                <CIcon name="cil-check"/> Novo Usuário
                            </CButton>
                        </CCardHeader>
                        <CCardBody>
                            <CDataTable
                                    items={list}
                                    fields={fields}
                                    loading={loading}
                                    noItemsViewSlot=" "
                                    columnFilter
                                    sorter
                                    hover
                                    striped
                                    bordered
                                    pagination
                                    itemsPerPage={5}
                                    scopedSlots={
                                        { 
                                            'actions': (item,index)=>(
                                                <td>
                                                    <CButtonGroup>
                                                        <CButton color="info" onClick={noClickDoEditar(item.id)} >Editar</CButton>
                                                        <CButton color="danger" onClick={noClickDoExcluir(item.id)}>Excluir</CButton>
                                                    </CButtonGroup>
                                                </td>
                                            )
                                        }
                                    }
                            />
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>



            <CModal show={showModal} onClose={noCloseDoModal}>
                <CModalHeader closeButton>{modalId==='' ? 'Novo ' : 'Editar '}  Usuário</CModalHeader>
                
                <CModalBody>
                    
                    <CFormGroup>
                        <CLabel htmlFor="modal-name">Nome: </CLabel>
                        <CInput type="text" id="modal-name" value={modalNameField} disabled={modalLoading}
                        onChange={e=>setModalNameField(e.target.value)}/>
                    </CFormGroup>

                    <CFormGroup>
                        <CLabel htmlFor="modal-email">E-mail: </CLabel>
                        <CInput type="email" id="modal-email" value={modalEmailField} disabled={modalLoading}
                        onChange={e=>setModalEmailField(e.target.value)}/>
                    </CFormGroup>
 
                    <CFormGroup>
                        <CLabel htmlFor="modal-cpf">CPF: </CLabel>
                        <CInput type="text" id="modal-cpf" value={modalCPFfield} disabled={modalLoading}
                        onChange={e=>setModalCPFfield(e.target.value)}/>
                    </CFormGroup>

                    <CFormGroup>
                        <CLabel htmlFor="modal-pass1">Nova Senha: </CLabel>
                        <CInput type="password" placeholder="Digite uma nova senha para o usuário" id="modal-pass1" 
                                value={modalPass1Field} disabled={modalLoading}
                        onChange={e=>setModalPass1Field(e.target.value)}/>
                    </CFormGroup>

                    <CFormGroup>
                        <CLabel htmlFor="modal-pass2">Nova senha (Confirmação)</CLabel>
                        <CInput type="password" placeholder="Confirme a nova senha para o usuário" id="modal-pass2" 
                                value={modalPass2Field} disabled={modalLoading}
                        onChange={e=>setModalPass2Field(e.target.value)}/>
                    </CFormGroup>


                </CModalBody>

                <CModalFooter>
                    <CButton color="primary" onClick={noClickDoSalvar} disabled={modalLoading}>{modalLoading ? 'Carregando...' : 'Salvar'}</CButton>
                    <CButton color="secundary"onClick={noCloseDoModal} disabled={modalLoading}>Cancelar</CButton>
                </CModalFooter>
            </CModal>
        </>
    );
}