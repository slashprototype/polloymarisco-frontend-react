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

import { getSalesSummary, getSalesTickets } from "../../services/salesService";
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

  //console.debug("====Start date:", startDate);
  const [endDate, setEndDate] = useState(dayjs());
  const [sales, setSales] = useState();
  const [totalAmount, setTotalAmount] = useState(0); // total sells
  const [salesTickets, setSalesTickets] = useState();


  const handleUpdate = () => {
    updateSharedData("Updated Data");
  };

  const handleChangeDate = (which, date, dateString) => {
  console.debug("Change date:", which, "Date:", date,);
  //console.debug("Selected date:", date, "Date string:", dateString);
  let dateFormat;
  if (date !== null) {
    const year = date.year();
    const month = date.month() ; // 👈 IMPORTANTE: sumar 1
    const day = date.date();

    console.log(`Fecha: ${year}-${month+1}-${day}`);
    dateFormat = `${year}-${month}-${day}`;
  
  }
  if (which === "startDate") {
    setStartDate(date);
  }
  else if (which === "endDate") {
    setEndDate(date);
  }
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

  const getTickets = async (params) => {
    //console.debug("Params to get tickets [Dashboard]: ", params);
    try {
      let data = await getSalesTickets(params);
      setSalesTickets(data);
      console.debug("%%%% Response products tickets [Dashboard]: ", data);
    } catch (error) {
      //throw new Error("Failed to get sales tickets");
      console.error("Failed to get sales tickets [Dashboard]:", error);
    }
  }
  useEffect(() => {

    // Necesario para que se actualice el valor de startDate y endDate y formatear
    //handleChangeDate('startDate', startDate);
    //handleChangeDate('endDate', endDate);
    getSales({ startDate: startDate, endDate: endDate });
    getTickets({ startDate: startDate, endDate: endDate });

  }, [startDate, endDate]);

  setTimeout(() => {
    if (waitToPlot) {
      setWaitToPlot(false);
      const formatted = new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      }).format(parseFloat(totalAmount));
      setTotalAmount(formatted);
      console.debug("Sales tickets [Dashboard]: ", salesTickets);
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
            onChange={(date)=>handleChangeDate('endDate', date, date)}
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
            <ChartMoreSell sales={sales} salesTickets={salesTickets} />
          </Col>
        )}

        <Col span={12}>{/* <ChartMoreSell /> */}</Col>
      </Row>
    </div>
  );
};

export default DashboardPage;
