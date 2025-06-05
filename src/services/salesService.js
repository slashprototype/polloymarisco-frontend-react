import api from './api';

export const getSales = async(id)=>{
    try{
        const response = await api.get('/api/v1/products/');
        //console.debug('Response products:[getSalesService] ', response);
        return response.data;
    }catch(error){
        console.error("Error en getSales Service: ", error)
    }
};

export const getSalesSummary = async(data)=>{
    /*
    {
  "startDate": "2025-05-21T20:11:37.835Z",
  "endDate": "2025-05-21T20:11:37.835Z"
}
==> Params: 
//**v1/sales-summary/?end_date=2025-05-21&start_date=2025-05-01'
    */
    try{
        //console.debug('==> Params [getSalesSummary]:', data);
        let args='';
        if(data.startDate !== undefined || data.endDate !== undefined){
            //console.debug('Date to filter on service');
            let sd = data.startDate.$y + '-' + (data.startDate.$M +1)+ '-' + data.startDate.$D;
            let ed = data.endDate.$y + '-' + (data.endDate.$M +1)+ '-' + data.endDate.$D;
            //console.debug('Start date: ', sd);
            //console.debug('End date: ', ed);
            //args = '?end_date=' + ed + '&start_date=' + sd;
            args = '?end_date=' + data.endDate + '&start_date=' + data.startDate;
           //console.debug('Args on service summary: ', args);
        }else{
            console.error('No dates provided for sales summary or Dates are undefined');
        }
        //console.debug('Args on service SalesSummary: ', args);
        const response = await api.get('/api/v1/sales-summary/'+args, {
            params: data
        });
        //console.debug('Res summary on Service: ', response.data);
        return response.data;
    }catch(error){

        console.error('Failed to get Sales [SalesSumamary Service]:', error);
    }
};

export const getSalesTickets = async(data)=>{
    /* !
    {
  *"startDate": "2025-05-21T20:11:37.835Z",
  *"endDate": "2025-05-21T20:11:37.835Z"
  * solo poner fechasa ademas de que solo estaan dos vendedores
}
    */
   //console.debug('==> on service tickets', data);
    try{
        
        let args='';
        if(data.startDate !== undefined || data.endDate !== undefined){
            let month;
            //console.debug('Date to filter on service');
            if(data.startDate.$M < 10){
                month = '0' + (data.startDate.$M + 1);
            }
            if(data.endDate.$M < 10){
                month = '0' + (data.endDate.$M + 1);
            }
            if (data.startDate.$D < 10){
                data.startDate.$D = '0' + data.startDate.$D;
            }
            if (data.endDate.$D < 10){
                data.endDate.$D = '0' + data.endDate.$D;
            }
            //console.debug('Start date: ', data.startDate);
            let sd = data.startDate.$y + '-' + month +'-' + data.startDate.$D;
            let ed = data.endDate.$y + '-' + month + '-' + data.endDate.$D;
            //console.debug('Start date: ', sd);
            //console.debug('End date: ', ed);
            args = '?end_date=' + data.endDate + '&start_date=' + data.startDate;
           
        }else{
            console.error('No dates provided for sales tickets or Dates are undefined');
        }
        //console.debug('Args on service tickets: ', args);
        const response = await api.get('/api/v1/sales-tickets/'+args, {
            params: data
        });
        //console.debug('Res tickets on Service: ', response.data);
        return response.data;
    }catch(error){
        //throw new Error('Failed to get products');
        console.error('Failed to get Sales Tickets', error);
    }
}