import React, { use, useEffect, useRef } from "react";
import { Card, Col, Row, Statistic, Image } from "antd";
import { getSalesSummary } from "../../../../services/salesService";
import { formatDate } from "../../../../utils/formatDate";



const path = 'https://www.polloymariscoezm.com';

const ProductsComponent = (props) => {

    //console.debug('Props received [productsComponent]: ', props);
    const pathImage = path+props.productData.image;
    const [showInfo, setShowInfo] = React.useState(false);
    const [productName, setProductName] = React.useState(props.productData.name);
    const [sales, setSales] = React.useState();
    const hasFetched = useRef(false);
    //console.log('Path Image: ', pathImage);

    const getSales = async (params) => {
      try {
        //console.debug('Params to get sales summary[Dashboard]: ', params);
        
        let data = await getSalesSummary(params);
        //console.debug('Response products summary[productsComponent]: ', data);
        //sales.current = data;
        setSales(data);
        //! Se esta generando problema al hacer el setSales
        //console.debug('Sales [productsComponent]:', sales);
        //setProductSells(sales.details);
        
      } catch (error) {
       //throw new Error('Failed to get sales summary');
        console.error('Failed to get sales summary[productsComponent]:', error);
      }
    };

    useEffect(() => {
      if(!hasFetched.current){
        hasFetched.current = true; // try no repeat runs
        const data = {
          startDate: formatDate(props.startDate),
          endDate: formatDate(props.endDate),
          from: 'productsComponent'
        };
        getSales(data);
      }
      if(props.productData.name !== productName){
        setProductName(props.productData.name);
      }
      setShowInfo(false);
    }, [props.startDate, props.endDate, props.productData.name]);
  return (
 
      <Col  xs={8} sm={12} md={8} lg={4} xl={3} style={{ margin: "12px" }}>
        <Card variant="borderless" className="card-product" style={{ width: "160px", maxHeight: "310px", minHeight: "280px", margin:"8px" }}         hoverable
        onClick={() => setShowInfo(!showInfo)}>
          <Statistic
            title="Producto"
            value={props.productData.name}
            valueStyle={{
              color: "#037bfc", fontSize: "18px"
            }}
          />
          {showInfo ? (
            <>
              {props.productData.price_menudeo !== null ? (
                <Statistic
                title="Menudeo"
                value={props.productData.price_menudeo}
                valueStyle={{
                  color: "#3f8600", fontSize: "18px"
                }}
              />) :(<div></div>)}


              {props.productData.price_medio_mayoreo !== null ? (
                <Statistic
                title="Medio Mayoreo"
                value={props.productData.price_medio_mayoreo}
                valueStyle={{
                  color: "#3f8600", fontSize: "18px"
                }}
              />) :(<div></div>)
              }

              {props.productData.price_mayoreo !== null ? (
                <Statistic
                title="Mayoreo"
                value={props.productData.price_mayoreo}
                valueStyle={{
                  color: "#3f8600", fontSize: "18px"
                }}
              />) :(<div></div>)
              }
              {props.productData.price_gran_mayoreo !== null ? (
                <Statistic
                title="Gran Mayoreo"
                value={props.productData.price_gran_mayoreo}
                valueStyle={{
                  color: "#3f8600", fontSize: "18px"
                }}
              />) :(<div></div>)
              }
             
            </>
          ) : (
            <Image
            style={{ marginTop: "5px", marginBottom: "30px" }}
              width={120}
              src={pathImage}
            />
          )}
        </Card>
      </Col>
 
  );
};

export default ProductsComponent;
