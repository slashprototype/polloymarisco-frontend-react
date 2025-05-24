import api from './api';

export const getSales = async(id)=>{
    try{
        const response = await api.get('/api/v1/products/');
        //console.debug('Response products:[getSalesService] ', response);
        return response.data;
    }catch(error){
        throw new Error('Failed to get products');
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
        //console.debug('==> Params:', data.startDate);
        let args='';
        if(data.startDate !== undefined || data.endDate !== undefined){
            //console.debug('Date to filter on service');
            let sd = data.startDate.$y + '-' + data.startDate.$M + '-' + data.startDate.$D;
            let ed = data.endDate.$y + '-' + data.endDate.$M + '-' + data.endDate.$D;
            //console.debug('Start date: ', sd);
            //console.debug('End date: ', ed);
            args = '?end_date=' + ed + '&start_date=' + sd;
           
        }

        const response = await api.get('/api/v1/sales-summary/'+args, {
            params: data
        });
        console.debug('Res summary on Service: ', response.data);
        return response.data;
    }catch(error){
        throw new Error('Failed to get products');
    }
};