import React, {useState, useEffect} from "react";
import useApi from '../services/api';
import { CButton, CButtonGroup, CCard, CCardBody, CCardHeader, CCol, CDataTable, CFormGroup, CInput, 
        CInputCheckbox, CLabel, CModal, CModalBody, CModalFooter, CModalHeader, CRow, CSwitch } from '@coreui/react';
import CIcon from "@coreui/icons-react";


export default ()=>{
    const api = useApi();
    const [loading, setLoading] = useState(true);
    const [list, setList] = useState([]); 
    const [showModal,setShowModal] = useState(false);
    const [modalLoading,setModalLoading] = useState(false);
    const [modalId, setModalId] = useState('');
    const [modalAllowedField, setModalAllowedField] = useState(1);
    const [modalCoverField, setModalcoverField] = useState('');
    const [modalTitleField, setModalTitleField] = useState('');
    const [modaldaysField, setModaldaysField] = useState([]);
    const [modalStartTimeField, setModalStartTimeField] = useState('');
    const [modalEndTimeField, setModalEndTimeField] = useState('');

   
   

   

    const fields = [
        {label:'Ativo', key:'allowed', sorter:false, filter:false},
        {label:'Capa', key:'cover', sorter:false, filter:false},
        {label:'Título', key:'title'},
        {label:'Dias de funcionamento', key:'days'},
        {label:'Hórario de inicio', key:'start_time', filter:false},
        {label:'Hórario de fim', key:'end_time', filter:false},
        {label:'Ações', key:'actions', _style:{width: '1px'}, sorter:false, filter: false}
    ];


    useEffect(()=>{
        getList();
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

    const noCloseDoModal = ()=>{
        setShowModal(false);
    }

    const noClickDoEditar = (id)=>{
        let index = list.findIndex(v=>v.id===id);
        setModalId(list[index]['id']);
        setModalAllowedField(list[index]['allowed'])
        setModalTitleField(list[index]['title'])
        setModalcoverField('')
        setModalStartTimeField(list[index]['start_time']);
        setModalEndTimeField(list[index]['end_time']);
        setModaldaysField(list[index]['days'].split(','));
        setShowModal(true);
    }


    const noClickDoExcluir = async(id)=>{
        
        if (window.confirm("Tem certeza que deseja excluir ?")){
            const result = await api.deleteAreas(id);
            if (result.error ===''){
                getList();
            }else{
                alert(result.error);
            }
        }
        
    }

    const noClickDoSalvar = async()=>{
        if (modalTitleField && modalStartTimeField && modalEndTimeField){
            setModalLoading(true);
            let result;
            let data=  {
                allowed: modalAllowedField,
                title: modalTitleField,
                days: modaldaysField.join(','),
                start_time: modalStartTimeField,
                end_time: modalEndTimeField
            };
            if(modalCoverField){
                data.cover = modalCoverField;
            }

            if (modalId ===''){
                result = await api.addAreas(data);
            }else{
                result = await api.updateAreas(modalId,data); 
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
        setModalAllowedField('');
        setModalTitleField('');
        setModalcoverField('');
        setModalStartTimeField('');
        setModalEndTimeField('');
        setModaldaysField([]);
        showModal(true);
    }

    const naMudancaDoStatus = async(item)=>{
        setLoading(true);
        const result = await api.updateRetiraAreaDeOperacao(item.id);
        setLoading(false);
        if (result.error===''){
            getList();
        }else{
            alert(result.error);
        }
    }
    const naMudancaDoStatusNoModal = ()=>{
        setModalAllowedField(1-modalAllowedField);
    }

    const toogleModalDays = (item, event)=>{
        let days = [...modaldaysField];
        
        if(event.target.checked===false){
            days = days.filter(day=>day!==item);
        }else{
            days.push(item)
        }

        setModaldaysField(days);
    }

    return(
        <>
            <CRow>
                <CCol>
                    <h2>Áreas Comuns</h2>
                    <CCard>
                        <CCardHeader>
                            <CButton color="primary" onClick={noClickDoNovoAviso}>
                                <CIcon name="cil-check"/> Nova Área Comum
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
                                            'allowed': (item)=>(
                                                <td>
                                                    <CSwitch 
                                                        color="success"
                                                        checked={item.allowed}
                                                        onChange={()=>naMudancaDoStatus(item)}
                                                    />
                                                </td>
                                            ),
                                            'cover': (item)=>(
                                                <td>
                                                    <img src={item.cover} width={100}/>
                                                </td>
                                            ),
                                            'days': (item)=>{
                                                let dayswords = ['segunda','Terça','Quarta','Quinta','Sexta','Sábado','Domingo'];
                                                let days = item.days.split(',');
                                                let dayString = [];
                                                for (let i in days){
                                                    if (days[i] && dayswords[days[i]]){
                                                        dayString.push(dayswords[days[i]])
                                                    }
                                                }
                                                 return(
                                                       <td>
                                                        {dayString.join(', ')}
                                                       </td> 
                                                 );
                                            },
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
                <CModalHeader closeButton>{modalId==='' ? 'Nova ' : 'Editar '}  Área Comum</CModalHeader>
                <CModalBody>
                    <CFormGroup>
                    <CLabel htmlFor="modal-allowed">Ativo</CLabel>
                    <CSwitch
                        color="success"
                        checked={modalAllowedField}
                        onChange={naMudancaDoStatusNoModal}
                    />
                    </CFormGroup>

                    <CFormGroup>
                    <CLabel htmlFor="modal-title">Título</CLabel>
                    <CInput type='text' name="title" id="modal-title"  value={modalTitleField}
                            onChange={e=>setModalTitleField(e.target.value)}/>
                            
                    </CFormGroup>

                    <CFormGroup>
                    <CLabel htmlFor="modal-cover">Capa</CLabel>
                    <CInput type='File' name="cover" id="modal-cover" placeholder="Escolha uma imagem"
                            onChange={e=>setModalcoverField(e.target.files[0])}/>
                            
                    </CFormGroup>
                    
                    <CFormGroup>
                        <CLabel htmlFor="modal-days">Dis de funcionamento</CLabel>
                        <div style={{marginLeft:20}}>
                            <div>
                                <CInputCheckbox
                                    id="modal-days-0"
                                    name="modal-days"
                                    value={0}
                                    checked={modaldaysField.includes('0')}
                                    onChange={(e)=>toogleModalDays(0,e)}
                                />
                                <CLabel htmlFor="modal-days-0">Segunda-Feira</CLabel>
                            </div>
                            <div>
                                <CInputCheckbox
                                    id="modal-days-1"
                                    name="modal-days"
                                    value={1}
                                    checked={modaldaysField.includes('1')}
                                    onChange={(e)=>toogleModalDays(1,e)}
                                />
                                <CLabel htmlFor="modal-days-1">Terça-Feira</CLabel>
                            </div>
                            <div>
                                <CInputCheckbox
                                    id="modal-days-2"
                                    name="modal-days"
                                    value={2}
                                    checked={modaldaysField.includes('2')}
                                    onChange={(e)=>toogleModalDays(2,e)}
                                />
                                <CLabel htmlFor="modal-days-2">Quarta-Feira</CLabel>
                            </div>
                            <div>
                                <CInputCheckbox
                                    id="modal-days-3"
                                    name="modal-days"
                                    value={3}
                                    checked={modaldaysField.includes('3')}
                                    onChange={(e)=>toogleModalDays(3,e)}
                                />
                                <CLabel htmlFor="modal-days-3">Quinta-Feira</CLabel>
                            </div>
                            <div>
                                <CInputCheckbox
                                    id="modal-days-4"
                                    name="modal-days"
                                    value={4}
                                    checked={modaldaysField.includes('4')}
                                    onChange={(e)=>toogleModalDays(4,e)}
                                />
                                
                                <CLabel htmlFor="modal-days-4">Sexta-Feira</CLabel>
                            </div>
                            <div>
                                <CInputCheckbox
                                    id="modal-days-5"
                                    name="modal-days"
                                    value={5}
                                    checked={modaldaysField.includes('5')}
                                    onChange={(e)=>toogleModalDays(5,e)}
                                />
                                <CLabel htmlFor="modal-days-5">Sábado</CLabel>
                            </div>
                            <div>
                                <CInputCheckbox
                                    id="modal-days-6"
                                    name="modal-days"
                                    value={6}
                                    checked={modaldaysField.includes('6')}
                                    onChange={(e)=>toogleModalDays(6,e)}
                                />
                                <CLabel htmlFor="modal-days-6">Domingo</CLabel>
                            </div>
                        </div>
                    </CFormGroup>

                    <CFormGroup>
                        <CLabel htmlFor="modal-start-time">Horário de Início</CLabel>
                        <CInput type="time" id="modal-start-time" name="start_time" value={modalStartTimeField}
                                onChange={e=>setModalStartTimeField(e.target.value)}/>
                    </CFormGroup>

                    <CFormGroup>
                        <CLabel htmlFor="modal-end-time">Horário de Fim</CLabel>
                        <CInput type="time" id="modal-end-time" name="end_time" value={modalEndTimeField}
                                onChange={e=>setModalEndTimeField(e.target.value)}/>
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