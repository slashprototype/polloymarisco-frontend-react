import api from './api';

export const getSellers = async()=>{
    try{
        const response = await api.get('/api/v1/sellers/');
        //console.debug('Response products [getProductsService]: ', response);
        return response.data;
    }catch(error){
        throw new Error('Failed to get products');
    }
};