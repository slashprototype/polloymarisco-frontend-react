import React, { useState, useMemo, useEffect } from "react";

import { useOutletContext } from "react-router-dom";

import {
  Button,
  Input,
  Typography,
  Divider,
  Card,
  Space,
  FloatButton,
  Tooltip,
  Col,
  Row,
  DatePicker,
  Statistic
} from "antd";
import dayjs from "dayjs";
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  UserOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";

import { getSalesSummary } from "../../services/salesService";
// import components child
import ProductsComponent from "./components/productsView/productsComponent";
import ChartMoreSell from "./components/chartMoreSell";

const { Title, Text } = Typography;
const path = "https://www.polloymariscoezm.com/";
const textToolTipAddTask = <span>Add Task</span>;

/* 
  Total aamount ess el totaal de venta en pesos
  Filtrar por price_type y sumar los aaamount de menudeo, maayoreo, etc.
  Precio, es por cantidad kilos, paquetes, unitarios

*/
const DashboardPage = () => {
  const [searchText, setSearchText] = useState("");
  const { sharedData, updateSharedData } = useOutletContext(); // receive data Products
  const [waitToPlot, setWaitToPlot] = useState(true);
  

  const [startDate, setStartDate] = useState(dayjs());
  const [endDate, setEndDate] = useState(dayjs());
  const [sales, setSales] = useState();
  const [totalAmount, setTotalAmount] = useState(0); // total sells


  const handleUpdate = () => {
    updateSharedData("Updated Data");
  };

  const onSelectDate = (date, dateString) => {
    console.log(date, dateString);
  };
  const getSales = async (params) => {
    try {
      let data = await getSalesSummary(params);
      console.debug("Response products summary [Dashboard]: ", data);
      setSales(data);
      setTotalAmount(data.total_amount);
      //! Se esta generando problema al hacer el setSales
      //console.debug("Sales [Dashboard]:", sales);
      //setProductSells(sales.details);
    } catch (error) {
      throw new Error("Failed to get sales summary");
    }
  };
  useEffect(() => {
    getSales({ startDate: startDate, endDate: endDate });
  }, [startDate, endDate]);

  setTimeout(() => {
    if (waitToPlot) {
      setWaitToPlot(false);
      const formatted = new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      }).format(parseFloat(totalAmount));
      setTotalAmount(formatted);
      
    }
  }, 2000);

  return (
    <div>
      <h3>Dashboard Page</h3>


      <Row>
        <Col span={20}>
          <Row className="row-products">
            {sharedData.map((item) => (
              <ProductsComponent productData={item} startDate={startDate} endDate={endDate} />
            ))}
          </Row>
        </Col>
        <Col span={4}>
          <h3>Venta total</h3>
                  <Statistic value={totalAmount} valueStyle={{ color: '#3f8600' }} />
          <h3>Fecha inicio</h3>
          <DatePicker
            //onChange={onSelectDate}
            value={startDate}
            onChange={setStartDate}
            format="YYYY-MM-DD"
          />
          <h3>Fecha fin</h3>
          <DatePicker
            //onChange={onSelectDate}
            value={endDate}
            onChange={setEndDate}
            format="YYYY-MM-DD"
          />
          <h3> PC 1</h3>
          <div style={{ paadding: "2px" }}>
            <Input
              addonBefore="Venta Total"
              type="text"
              style={{
                width: 180,
              }}
            />
            <Input
              addonBefore="Kilos"
              type="text"
              style={{
                width: 180,
              }}
            />
            <Input
              addonBefore="Unitario totales"
              type="text"
              style={{
                width: 180,
              }}
            />
            <h3>PC 2</h3>
            <Input
              addonBefore="Venta total"
              type="text"
              style={{
                width: 180,
              }}
            />
            <Input
              addonBefore="Kilos totales"
              type="text"
              style={{
                width: 180,
              }}
            />
            <Input
              addonBefore="Unitario totales"
              type="text"
              style={{
                width: 180,
              }}
            />
            <h3>PC 3</h3>
            <Input
              addonBefore="Venta total"
              type="text"
              style={{
                width: 180,
              }}
            />
            <Input
              addonBefore="Kilos totales"
              type="text"
              style={{
                width: 180,
              }}
            />
            <Input
              addonBefore="Unitario totales"
              type="text"
              style={{
                width: 180,
              }}
            />
          </div>
        </Col>
      </Row>
              <br />  <br />
      <Row>
        {!waitToPlot && (
          <Col span={12}>
            <ChartMoreSell sales={sales} />
          </Col>
        )}

        <Col span={12}>{/* <ChartMoreSell /> */}</Col>
      </Row>
    </div>
  );
};

export default DashboardPage;
