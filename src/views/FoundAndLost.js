import React, {useState, useEffect} from "react";
import useApi from '../services/api';
import { CButton,CCard, CCardBody, CCol, CDataTable, CRow, CSwitch } from '@coreui/react';
import Lightbox from "react-image-lightbox";
import 'react-image-lightbox/style.css';


export default ()=>{
    const api = useApi();
    const [loading, setLoading] = useState(true);
    const [list, setList] = useState([]); 
    const [photoURL, setPhotoURL] = useState('');
    
    

    const fields = [
        {label:'Recuperado', key:'status', filter: false},
        {label:'Local encontrado', key:'where', sorter:false},
        {label:'Descrição', key:'description', sorter:false} ,
        {label:'Foto', key:'photo', sorter:false, filter: false},
        {label:'Data', key:'datecreated'},
        //{label:'Ações', key:'actions', _style:{width: '1px'}, sorter:false, filter: false}
    ];


    useEffect(()=>{
        getList();
    },[]);

    const getList = async ()=>{
        setLoading(true);
        const result = await api.getFoundAndLost();
        setLoading(false);
        if (result===''){
            setList(result.list);
        } else{
            alert(result.error);
        }   
    }


    const naMudancaDoSTATUS = async(item)=>{
        setLoading(true);
        const result = await api.updateFoundAndLost(item.id);
        setLoading(false);
        if(result.error === ''){
            getList();
        }else{
            alert(result.error);
        }

    }
    
    const showLigthBox = (url) =>{
        setPhotoURL(url);
    }


    return(
        <>
            <CRow>
                <CCol>
                    <h2>Achados e Perdidos</h2>
                    <CCard>
                        
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
                                           'photo': (item)=>(
                                            <td>{item.photo &&
                                                    <CButton color="success" onClick={()=>showLigthBox(item.photo)}>
                                                       Ver foto
                                                    </CButton>
                                                }
                                            </td>
                                           ),
                                           'datecreated': (item)=>(
                                            <td>{item.datecreated_formated}</td>
                                           ),
                                           'status': (item)=>(
                                            <td>
                                                <CSwitch
                                                    color="success"
                                                    checked={item.status === 'recovered'}
                                                    onChange={(e)=>naMudancaDoSTATUS(item)}
                                                />
                                            </td>
                                           )
                                        }
                                    }
                            />
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>

            { photoURL &&
            <Lightbox
                mainSrc={photoURL}
                onCloseRequest={()=>setPhotoURL('')}
                reactModalStyle={{overlay:{zIndex: 9999}}}
            />
        }
        </>       
    );
}