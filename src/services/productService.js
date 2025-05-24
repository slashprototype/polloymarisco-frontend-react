import api from './api';


export const getProducts = async()=>{
    try{
        const response = await api.get('/api/v1/products/');
        //console.debug('Response products [getProductsService]: ', response);
        return response.data;
    }catch(error){
        throw new Error('Failed to get products');
    }
};

export const getProductById = async(id)=>{
    try{
        const response = await api.get('/api/v1/products/' + id +'/');
        //console.debug('Res products by ID: [getProductByIdService]', response);
        return response.data;
    }catch(error){
        throw new Error('Failed to get products');
    }
};