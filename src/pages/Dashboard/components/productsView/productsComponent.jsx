import React, { use, useEffect, useRef } from "react";
import { Card, Col, Row, Statistic, Image } from "antd";
import { getSalesSummary } from "../../../../services/salesService";



const path = 'https://www.polloymariscoezm.com';

const ProductsComponent = (props) => {

    console.debug('Props received', props);
    const pathImage = path+props.productData.image;
    const [showInfo, setShowInfo] = React.useState(false);
    const [productName, setProductName] = React.useState(props.productData.name);
    const [sales, setSales] = React.useState();
    const hasFetched = useRef(false);
    //console.log('Path Image: ', pathImage);

    const getSales = async (params) => {
      try {
        
        let data = await getSalesSummary(params);
        //console.debug('Response products summary[productsComponent]: ', data);
        //sales.current = data;
        setSales(data);
        //! Se esta generando problema al hacer el setSales
        //console.debug('Sales [productsComponent]:', sales);
        //setProductSells(sales.details);
        
      } catch (error) {
        throw new Error('Failed to get sales summary');
      }
    };

    useEffect(() => {
      if(!hasFetched.current){
        hasFetched.current = true; // try no repeat runs
        getSales({startDate: props.startDate, endDate:props.endDate});
      }
      if(props.productData.name !== productName){
        setProductName(props.productData.name);
      }
      setShowInfo(false);
    }, [props.startDate, props.endDate, props.productData.name]);
  return (
 
      <Col span={6}>
        <Card variant="borderless" className="card-product" style={{ width: "240px", height: "300px" }}         hoverable
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
                title="Menudeo"
                value={props.productData.price_medio_mayoreo}
                valueStyle={{
                  color: "#3f8600", fontSize: "18px"
                }}
              />) :(<div></div>)
              }

              {props.productData.price_mayoreo !== null ? (
                <Statistic
                title="Menudeo"
                value={props.productData.price_mayoreo}
                valueStyle={{
                  color: "#3f8600", fontSize: "18px"
                }}
              />) :(<div></div>)
              }
              {props.productData.price_gran_mayoreo !== null ? (
                <Statistic
                title="Menudeo"
                value={props.productData.price_gran_mayoreo}
                valueStyle={{
                  color: "#3f8600", fontSize: "18px"
                }}
              />) :(<div></div>)
              }
             
            </>
          ) : (
            <Image
              width={180}
              src={pathImage}
            />
          )}
        </Card>
      </Col>
 
  );
};

export default ProductsComponent;
