import React, {useState, useEffect} from "react";
import useApi from '../services/api';
import { CButton, CButtonGroup, CCard, CCardBody, CCardHeader, CCol, CDataTable, CFormGroup, CInput, CLabel, CModal, CModalBody, CModalFooter, CModalHeader, CRow, CTextarea } from '@coreui/react';
import CIcon from "@coreui/icons-react";


export default ()=>{
    const api = useApi();
    const [loading, setLoading] = useState(true);
    const [list, setList] = useState([]); 
    const [showModal,setShowModal] = useState(false);
    const [modalLoading,setModalLoading] = useState(false);
    const [modalTitleField,setModalTitleField] = useState('');
    const [modalBodyField,setModalBodyField] = useState('');
    const [modalId, setModalId] = useState('');

    const fields = [
        {label:'Título', key:'title'},
        {label:'Data de criação', key:'datacreated', _style:{width:'200px'}},
        {label:'Ações', key:'actions', _style:{width: '1px'}}
    ];


    useEffect(()=>{
        getList();
    },[]);

    const getList = async ()=>{
        setLoading(true);
        const result = await api.getwall();
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
        setModalTitleField(list[index]['title']);
        setModalBodyField(list[index]['body']);
        setShowModal(true);
    }
    const noClickDoExcluir = async(id)=>{
        if (window.confirm("Tem certeza que deseja excluir o aviso?")){
            const result = await api.deleteWall(id);
            if (result.error ===''){
                getList();
            }else{
                alert(result.error);
            }
        }
        
    }

    const noClickDoSalvar = async()=>{
        if (modalBodyField && modalTitleField){
            setModalLoading(true);
            let result;
            let data=  {
                title: modalTitleField,
                body: modalBodyField
            }

            if (modalId ===''){
                result = await api.addWall(data);
            }else{
                result = await api.updateWall(modalId,data); 
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
        setModalTitleField('');
        setModalBodyField('');
        showModal(true);
    }

    return(
        <>
            <CRow>
                <CCol>
                    <h2>Mural de avisos</h2>
                    <CCard>
                        <CCardHeader>
                            <CButton color="primary" onClick={noClickDoNovoAviso}>
                                <CIcon name="cil-check"/>Novo Aviso
                            </CButton>
                        </CCardHeader>
                        <CCardBody>
                            <CDataTable
                                    items={list}
                                    fields={fields}
                                    loading={loading}
                                    noItemsViewSlot=" "
                                    hover
                                    striped
                                    bordered
                                    pagination
                                    itemsPerPage={5}
                                    scopedSlots={
                                        { 
                                            'actions': (item)=>(
                                                <td>
                                                    <CButtonGroup>
                                                        <CButton color="info" onClick={noClickDoEditar(item.id)}>Editar</CButton>
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
                <CModalHeader closeButton> {modalId==='' ? 'Novo ' : 'Editar '} Aviso</CModalHeader>
                <CModalBody>
                    <CFormGroup>
                        <CLabel htmlFor="modal-title">Título do Aviso</CLabel>
                        <CInput type="text" id="modal-title" placeholder="Digite um título para o aviso" value={modalTitleField} onChange={e=>setModalTitleField(e.target.value)} disabled={modalLoading}/>
                    </CFormGroup>
                    <CFormGroup>
                        <CLabel htmlFor="modal-body">Corpo do Aviso</CLabel>
                        <CTextarea id="modal-body" placeholder="Digite o conteúdo do aviso" value={modalBodyField} onChange={e=>setModalBodyField(e.target.value)} disabled={modalLoading}/>
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