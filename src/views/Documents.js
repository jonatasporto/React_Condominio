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
    const [modalFileField,setModalFileField] = useState('');
    const [modalId, setModalId] = useState('');

    const fields = [
        {label:'Título', key:'title'},
        {label:'Ações', key:'actions', _style:{width: '1px'}}
    ];


    useEffect(()=>{
        getList();
    },[]);

    const getList = async ()=>{
        setLoading(true);
        const result = await api.getDocuments();
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
        setModalFileField(list[index]['body']);
        setShowModal(true);
    }


    const noClickDoExcluir = async(id)=>{
        if (window.confirm("Tem certeza que deseja excluir o aviso?")){
            const result = await api.deleteDocuments(id);
            if (result.error ===''){
                getList();
            }else{
                alert(result.error);
            }
        }
        
    }

    const noClickDoSalvar = async()=>{
        if (modalFileField && modalTitleField){
            setModalLoading(true);
            let result;
            let data=  {
                title: modalTitleField
            }

            if (modalId ===''){
                if (modalFileField){
                    data.file= modalFileField;
                    result = await api.addDocuments(data);
                }else{
                    alert("É necessario selecionar um arquivo.");
                    setModalLoading(false);
                    return;
                }
            }else{
                if (modalFileField){
                    data.file= modalFileField;
                }
                result = await api.updateDocuments(modalId,data); 
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
        //setModalFileField('');
        showModal(true);
    }

    const noClickDoDownlodDeDocs = (id)=>{
        let index = list.findIndex(v=>v.id===id);
        window.open(list[index]['fileurl']);
    }

    return(
        <>
            <CRow>
                <CCol>
                    <h2>Mural de documentos</h2>
                    <CCard>
                        <CCardHeader>
                            <CButton color="primary" onClick={noClickDoNovoAviso}>
                                <CIcon name="cil-check"/> Novo Documentos
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
                                                        <CButton color="success" onClick={noClickDoDownlodDeDocs(item.id)}><CIcon name="cil-cloud-download"/></CButton>
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
                <CModalHeader closeButton>{modalId==='' ? 'Novo ' : 'Editar '}  Documento</CModalHeader>
                <CModalBody>
                    <CFormGroup>
                        <CLabel htmlFor="modal-file">Arquivo</CLabel>
                        <CInput type="text" id="modal-file" placeholder="Digite um título para o documento" value={modalTitleField} onChange={e=>setModalTitleField(e.target.value)} disabled={modalLoading}/>
                    </CFormGroup>

                    <CFormGroup>
                        <CLabel htmlFor="modal-body">Corpo do Aviso</CLabel>
                        <CInput type="file" id="modal-file" name="file" placeholder="Escolha um arquivo"
                        onChange={e=>setModalFileField(e.target.files[0])}/>
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