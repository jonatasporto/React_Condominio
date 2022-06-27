const baseUrl = 'https://api.b7web.com.br/devcond/api/admin';

const requisicao = async (method, endpoint, params, token=null) => {
    method = method.toLowerCase();
    let fullUrl = `${baseUrl}${endpoint}`;
    let body = null;
    switch(method){
        case 'get':
            let queryString = new URLSearchParams(params).toString();
            fullUrl += `?${queryString}`;
        break;
        case 'post':
        case 'put':
        case 'delete':
            body = JSON.stringify(params);
        break;
    }
    
    let headers = {'Content-Type':'application/json'};
    if (token){
        headers.Autorization = `Bearer ${token}`;
    }
    let req = await fetch(fullUrl,{method,headers,body});

    let json = await req.json();
    return json;
 }
export default ()=>{
    return {
        getToken: ()=>{
            return localStorage.getItem('token');
        },
        validadeToken: async ()=>{
            let token = localStorage.getItem('token');
            console.log("Token na validação do token: "+token);
            let json = await requisicao('post','/auth/validate/',{},token);
            console.log("RETORNO do back end: "+json.error);
            return json;
        },
        login: async (email, password)=>{
                let json = await requisicao('post','/auth/login/',{email,password});
                return json;
        },
        logout: async ()=>{
            let token = localStorage.getItem('token');
            let json = await requisicao('post','/auth/logout/',{},token);
            localStorage.removeItem('token');
            return json;
        },
        // CRUD WALL
        getwall: async()=>{
            let token = localStorage.getItem('token');
            let json = await requisicao('get','/walls',{},token);
            return json;
        },
        updateWall: async(id,dados)=>{
            let token = localStorage.getItem('token');
            let json = await requisicao('put',`/wall/${id}`,dados,token);
            return json;
        },
        addWall: async(dados)=>{
            let token = localStorage.getItem('token');
            let json = await requisicao('post',`/walls`,dados,token);
            return json;  
        },
        deleteWall: async(id)=>{
            let token = localStorage.getItem('token');
            let json = await requisicao('delete',`/wall/${id}`,{},token);
            return json;  
        },
        // CRUD DOCUMENTS
        getDocuments: async()=>{
            let token = localStorage.getItem('token');
            let json = await requisicao('get','/docs',{},token);
            return json;
        },
        updateDocuments: async(id,dados)=>{
            let token = localStorage.getItem('token');
            
            let formData = new FormData();
            formData.append('title', dados.title);
            if (dados.file){
                formData.append('file',dados.file);
            } 

            let req = await fetch(`${baseUrl}/doc/${id}`,{
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            let json = await req.json();
            return json; 
        },

        addDocuments: async(dados)=>{
            let token = localStorage.getItem('token');
            
            let formData = new FormData();
            formData.append('title', dados.title);
            if (dados.file){
                formData.append('file',dados.file);
            } 

            let req = await fetch(`${baseUrl}/docs`,{
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            let json = await req.json();
            return json;  
        },
        
        deleteDocuments: async(id)=>{
            let token = localStorage.getItem('token');
            let json = await requisicao('delete',`/doc/${id}`,{},token);
            return json;  
        },

        // CRUD DE RESERVAS
        getReservation: async()=>{
            let token = localStorage.getItem('token');
            let json = await requisicao('get','/reservations',{},token);
            return json;
        },
        updateReservation: async(id,dados)=>{
            let token = localStorage.getItem('token');
            let json = await requisicao('put',`/reservations/${id}`,dados,token);
            return json;
        },
        addReservation: async(dados)=>{
            let token = localStorage.getItem('token');
            let json = await requisicao('post',`/reservations`,dados,token);
            return json;  
        },
        deleteReservation: async(id)=>{
            let token = localStorage.getItem('token');
            let json = await requisicao('delete',`/reservations/${id}`,{},token);
            return json;  
        },
        
        // CRUD DE OCORRENCIAS (Warnings)
        getWarnings: async()=>{
            let token = localStorage.getItem('token');
            let json = await requisicao('get','/warnings',{},token);
            return json;
        },
        updateWarning: async(id)=>{
            let token = localStorage.getItem('token');
            let json = await requisicao('put',`/warnings/${id}`,{},token);
            return json;
        },
        addWarnings: async(dados)=>{
            let token = localStorage.getItem('token');
            let json = await requisicao('post',`/warnings`,dados,token);
            return json;  
        },
        deleteWarnings: async(id)=>{
            let token = localStorage.getItem('token');
            let json = await requisicao('delete',`/warnings/${id}`,{},token);
            return json;  
        },
        // CRUD DE ACHADO E PERDIDOS 
        getFoundAndLost: async()=>{
            let token = localStorage.getItem('token');
            let json = await requisicao('get','/foundandlost',{},token);
            return json;
        },
        updateFoundAndLost: async(id)=>{
            let token = localStorage.getItem('token');
            let json = await requisicao('put',`/foundandlost/${id}`,{},token);
            return json;
        },
        addFoundAndLost: async(dados)=>{
            let token = localStorage.getItem('token');
            let json = await requisicao('post',`/foundandlostt`,dados,token);
            return json;  
        },
        deleteFoundAndLost: async(id)=>{
            let token = localStorage.getItem('token');
            let json = await requisicao('delete',`/foundandlost/${id}`,{},token);
            return json;  
        },
        // CRUD DE USUARIOS
        getUsers: async()=>{
            let token = localStorage.getItem('token');
            let json = await requisicao('get','/users',{},token);
            return json;
        },
        updateUsers: async(id,dados)=>{
            let token = localStorage.getItem('token');
            let json = await requisicao('put',`/user/${id}`,dados,token);
            return json;
        },
        addUsers: async(dados)=>{
            let token = localStorage.getItem('token');
            let json = await requisicao('post',`/users`,dados,token);
            return json;  
        },
        deleteUser: async(id)=>{
            let token = localStorage.getItem('token');
            let json = await requisicao('delete',`/user/${id}`,{},token);
            return json;  
        },
         // CRUD DE AREAS COMUNS
         getAreas: async ()=>{
            let token = localStorage.getItem('token');
            let json = await requisicao('get',`/areas/`,{},token);
            return json;
        },
        updateAreas: async(id,dados)=>{
            let token = localStorage.getItem('token');
            
            let formData = new FormData();
            for(let i in dados){
                formData.append(i,dados[i]);
            }

            let req = await fetch(`${baseUrl}/area/${id}`,{
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            let json = await req.json();
            return json;  
        },
        updateRetiraAreaDeOperacao: async(id)=>{
            let token = localStorage.getItem('token');
            let json = await requisicao('put',`/area/${id}/allowed`,{},token);
            return json;
        },
        addAreas: async(dados)=>{
            let token = localStorage.getItem('token');
            
            let formData = new FormData();
            for(let i in dados){
                formData.append(i,dados[i]);
            }

            let req = await fetch(`${baseUrl}/areas`,{
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            let json = await req.json();
            return json;  
        },

        deleteAreas: async(id)=>{
            let token = localStorage.getItem('token');
            let json = await requisicao('delete',`/area/${id}`,{},token);
            return json;  
        },
        //CRUD de UNIDADES

        getUnits: async ()=>{
            let token = localStorage.getItem('token');
            let json = await requisicao('get',`/units/`,{},token);
            return json; 
        },

        BuscaUsuarios: async(query)=>{
            let token = localStorage.getItem('token');
            let json = await requisicao('get','/users/search',{q: query},token);
            return json;
        },
        updateUnit: async(id,dados)=>{
            let token = localStorage.getItem('token');
            let json = await requisicao('put',`/unit/${id}`,dados,token);
            return json;
        },
        addUnit: async(dados)=>{
            let token = localStorage.getItem('token');
            let json = await requisicao('post',`/units`,dados,token);
            return json;  
        },
        deleteUnit: async(id)=>{
            let token = localStorage.getItem('token');
            let json = await requisicao('delete',`/unit/${id}`,{},token);
            return json;  
        }
    };
}


