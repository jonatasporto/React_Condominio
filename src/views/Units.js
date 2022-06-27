import React, {useState, useEffect} from "react";
import useApi from '../services/api';
import { CButton, CButtonGroup, CCard, CCardBody, CCardHeader, CCol, CDataTable, CFormGroup, CInput, CLabel, CModal, CModalBody, CModalFooter, CModalHeader, CRow, CSelect, CTextarea } from '@coreui/react';
import CIcon from "@coreui/icons-react";


let timer;

export default ()=>{
    const api = useApi();
    const [loading, setLoading] = useState(true);
    const [list, setList] = useState([]); 
    const [showModal,setShowModal] = useState(false);
    const [modalLoading,setModalLoading] = useState(false);
    const [modalId, setModalId] = useState('');
    
    const [modalNameField, setModalNameField] = useState('');
    const [modalOwnerSearchField, setModalOwnerSearchField] = useState('');
    const [modalOwnerList, setModalOwnerList] = useState([]);
    const [modalOwnerField, setModalOwnerField] = useState(null);


    
    const fields = [
        {label:'Unidade', key:'name', sorter:false},
        {label:'Proprietário', key:'name_owner', sorter:false},
        {label:'Ações', key:'actions', _style:{width: '1px'}, sorter:false, filter: false}
    ];


    useEffect(()=>{
        getList();
    },[]);

    useEffect(()=>{
        if (modalOwnerSearchField !==''){
            clearTimeout(timer);
            timer= setTimeout(BuscaUsuario,1500);
        }
    },[modalOwnerSearchField]);

    const BuscaUsuario = async()=>{
        if (modalOwnerSearchField !==''){
            const  result= await api.BuscaUsuarios(modalOwnerSearchField);
            if (result.error===''){
                setModalOwnerList(result.list);
            }else{
                alert(result.error)
            }
        }
    }

    const getList = async ()=>{
        setLoading(true);
        const result = await api.getUnits();
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
        setModalOwnerList([])
        setModalOwnerSearchField('');
        if(list[index]['name_owner']){
            setModalOwnerField({
                name: list[index]['name_owner'],
                id: list[index]['id_owner']
            });
        }else{
            setModalOwnerField(null);
        }        
        setShowModal(true);
    }


    const noClickDoExcluir = async(id)=>{
        
        if (window.confirm("Tem certeza que deseja excluir a unidade?")){
            const result = await api.deleteUnit(id);
            if (result.error ===''){
                getList();
            }else{
                alert(result.error);
            }
        }
        
    }

    const noClickDoSalvar = async()=>{
        if (modalNameField){
            setModalLoading(true);
            let result;
            let data=  {
                name: modalNameField,
                id_owner: modalOwnerField.id
            }

            if (modalId ===''){
                result = await api.addUnit(data);
            }else{
                result = await api.updateUnit(modalId,data); 
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
        setModalOwnerField(null);
        setModalOwnerList([]);
        setModalOwnerSearchField('');
        showModal(true);
    }

    const TratandoAselecaoDoProprietario = (id)=>{
         let item = modalOwnerList.find(item=> item.id == id);

         setModalOwnerField(item);
         setModalOwnerList([]);
         setModalOwnerSearchField('');
    }

    return(
        <>
            <CRow>
                <CCol>
                    <h2>Unidades</h2>
                    <CCard>
                        <CCardHeader>
                            <CButton color="primary" onClick={noClickDoNovoAviso}  >
                                <CIcon name="cil-check"/> Nova Unidade
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
                                            'name_owner': (item)=>(
                                                <td>{item.name_owner ?? '-'}</td>
                                            ),
                                            'actions': (item)=>(
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
                <CModalHeader closeButton>{modalId==='' ? 'Novo ' : 'Editar '}  Documento</CModalHeader>

                <CModalBody>
                    
                    <CFormGroup>
                        <CLabel htmlFor="modal-name">Nome da Unidade</CLabel>
                        <CInput type="text" id="modal-name" value={modalNameField}
                        onChange={e=>setModalNameField(e.target.value)}/>
                    </CFormGroup>

                    <CFormGroup>
                        <CLabel htmlFor="modal-Owner">Proprietário (Nome, CPF ou Email)</CLabel>
                        
                        {modalOwnerField === null &&
                            <>
                                <CInput type="text" id="modal-Owner" value={modalOwnerSearchField}
                                        onChange={e=>TratandoAselecaoDoProprietario(e.target.value)}/>
                                
                                {modalOwnerList.length > 0 &&
                                    <CSelect sizeHtml={5} onChange={e=>setModalOwnerField(e.target.value)}>
                                        {modalOwnerList.map((item,index)=>(
                                                                            <option key={index} value={item.id}>{item.name}</option> 
                                                                           ))}
                                    </CSelect>
                                }
                            </>
                        }

                        { modalOwnerField ==! null &&
                            <>
                                <br/>
                                <CButton size="sm" color="danger" onClick={()=>setModalOwnerField(null)}>X</CButton>
                                {modalOwnerField.name}
                            </>
                        }
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