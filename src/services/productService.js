import api from './api';


export const getProducts = async()=>{
    try{
        const response = await api.get('/api/v1/products/');
        //console.debug('Response products [getProductsService]: ', response);
        return response.data;
    }catch(error){

        console.error('Failed to get products (service): ', error);
    }
};

export const getProductById = async(id)=>{
    try{
        const response = await api.get('/api/v1/products/' + id +'/');
        console.debug('Res products by ID: [getProductByIdService]', response);
        return response.data;
    }catch(error){

        console.error('Failed to get product by ID:', error);
    }
};