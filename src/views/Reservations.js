import React, {useState, useEffect} from "react";
import useApi from '../services/api';
import { CButton, CButtonGroup, CCard, CCardBody, CCardHeader, CCol, CDataTable, CFormGroup, CInput, CLabel, CModal, CModalBody, CModalFooter, CModalHeader, CRow, CSelect, CTextarea } from '@coreui/react';
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
    const [modalUnitList, setModalUnitList] = useState([]); 
    const [modalAreaList, setModalAreaList] = useState([]); 
    const [modalUnitId, setModalUnitId] = useState(0);
    const [modalAreaId, setModalAreaId] = useState(0);
    const [modalDateField, setModalDateField] = useState('');

    const fields = [
        {label:'Unidade', key:'name_unit', sorter:false},
        {label:'Área', key:'name_area', sorter:false},
        {label:'Data da reserva', key:'reservation_date'},
        {label:'Ações', key:'actions', _style:{width: '1px'}, sorter:false, filter: false}
    ];


    useEffect(()=>{
        getList();
        getUnitList();
        getAreaList();
    },[]);

    const getList = async ()=>{
        setLoading(true);
        const result = await api.getReservation();
        setLoading(false);
        if (result===''){
            setList(result.list);
        } else{
            alert(result.error);
        }   
    }

    const getUnitList = async ()=>{
        const result = await api.getUnits();
        if (result.error === ''){
            setModalUnitList(result.list);
        }
    }

    const getAreaList = async ()=>{
        const result = await api.getAreas();
        if (result.error === ''){
            setModalAreaList(result.list);
        }
    }

    const noCloseDoModal = ()=>{
        setShowModal(false);
    }

    const noClickDoEditar = (id)=>{
        let index = list.findIndex(v=>v.id===id);
        setModalId(list[index]['id']);
        setModalUnitId(list[index]['id_unit'])
        setModalAreaId(list[index]['id_area '])
        setModalDateField(list[index]['reservation_date']);
        setShowModal(true);
    }


    const noClickDoExcluir = async(id)=>{
        
        if (window.confirm("Tem certeza que deseja excluir a reserva?")){
            const result = await api.deleteReservation(id);
            if (result.error ===''){
                getList();
            }else{
                alert(result.error);
            }
        }
        
    }

    const noClickDoSalvar = async()=>{
        if (modalUnitId && modalAreaId && modalDateField){
            setModalLoading(true);
            let result;
            let data=  {
                id_unit: modalUnitId,
                id_area: modalAreaId,
                reservation_date: modalDateField
            }

            if (modalId ===''){
                result = await api.addReservation(data);
            }else{
                result = await api.updateReservation(modalId,data); 
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
        setModalUnitId(modalUnitList[0]['id']);
        setModalAreaId(modalAreaList[0]['id']);
        setModalDateField('');
        showModal(true);
    }

    return(
        <>
            <CRow>
                <CCol>
                    <h2>Mural de Reservas</h2>
                    <CCard>
                        <CCardHeader>
                            <CButton color="primary" onClick={noClickDoNovoAviso} disabled={modalUnitList.length === 0 || modalAreaList.length===0} >
                                <CIcon name="cil-check"/> Nova Reserva
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
                                            'reservation_date': (item)=>(
                                                <td>{item.reservation_date_formatted}</td>
                                            ),
                                            'actions': (item)=>(
                                                <td>
                                                    <CButtonGroup>
                                                        <CButton color="info" onClick={noClickDoEditar(item.id)} disabled={modalUnitList.length === 0 || modalAreaList.length===0}>Editar</CButton>
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
                    <CLabel htmlFor="modal-unit">Unidade</CLabel>
                    <CSelect id="modal-unit" custom onChange={e=>setModalUnitId(e.target.value)} value={modalUnitId}>
                            {modalUnitList.map((item,index)=>(
                                <option
                                    key={index}
                                    value={item.id}
                                >{item.name}</option>
                            ))}
                    </CSelect>
                    </CFormGroup>

                    <CFormGroup>
                    <CLabel htmlFor="modal-unit">Áreas</CLabel>
                    <CSelect id="modal-area" custom onChange={e=>setModalAreaId(e.target.value)} value={modalAreaId}>
                            {modalAreaList.map((item,index)=>(
                                <option
                                    key={index}
                                    value={item.id}
                                >{item.title}</option>
                            ))}
                    </CSelect>
                    </CFormGroup>

                    <CFormGroup>
                        <CLabel htmlFor="modal-date">Data da reserva</CLabel>
                        <CInput type="text" id="modal-date" value={modalDateField} disabled={modalLoading}
                        onChange={e=>setModalDateField(e.target.value)}/>
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