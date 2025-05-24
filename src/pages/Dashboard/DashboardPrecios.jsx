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
  Checkbox,
} from "antd";
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  UserOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";

import './DashboardPrecios.css';

// import components child
import ProductsComponent from "./components/productsView/productsComponent";
import ChartMoreSell from "./components/chartMoreSell";

const { Title, Text } = Typography;
const path = "https://www.polloymariscoezm.com/";
const textToolTipAddTask = <span>Add Task</span>;

const DashboardPrecios = () => {
  const [searchText, setSearchText] = useState("");
  const { sharedData, updateSharedData } = useOutletContext();
  console.log("shared received to plot:", sharedData);

  const [checkedMenudeo, setCheckedMenudeo] = useState(false);
  const [checkedMedioMayoreo, setCheckedMedioMayoreo] = useState(false);
  const [checkedMayoreo, setCheckedMayoreo] = useState(false);
  const [checkedGranMayoreo, setCheckedGranMayoreo] = useState(false);

  const onChangeCheck = (name) => {
    console.debug("name Check = ", name);
    //setCheckedMenudeo(!checkedMenudeo);
    //setChecked(e.target.checked);
  };

  const handleUpdate = () => {
    updateSharedData("Updated Data");
  };

  return (
    <div>
      <h3>Dashboard Page</h3>
      <Button>Refresh</Button>

      <Row>
        <Col span={20}>
          <Row className="row-products">
            {sharedData.map((item) => (
              <ProductsComponent productData={item} />
            ))}
          </Row>
        </Col>
        <Col span={4}>
          <div style={{ paadding: "2px" }}>
            <Space.Compact>
              <Input
                addonBefore={
                    <div className="fixed-addon">
                      Menudeo
                    </div>
                }
                addonAfter={
                  <Checkbox
                    checked={checkedMenudeo}
                    onClick={() => setCheckedMenudeo(!checkedMenudeo)}
                  ></Checkbox>
                }
                type="text"
                style={{
                  width: 250,
                }}
              />
            </Space.Compact>

            <Space.Compact>
                <Input
                    addonBefore={
                        <div className="fixed-addon">
                            Medio Mayoreo
                        </div>
                    }
                    addonAfter={
                    <Checkbox
                        checked={checkedMedioMayoreo}
                        onClick={() => setCheckedMedioMayoreo(!checkedMedioMayoreo)}
                    ></Checkbox>
                    }
                    type="text"
                    style={{
                    width: 250,
                    }}
                />
            </Space.Compact>

            <Space.Compact>
                <Input
                    addonBefore={
                        <div className="fixed-addon">
                            Mayoreo
                        </div>
                    }
                    addonAfter={
                    <Checkbox
                        checked={checkedMayoreo}
                        onClick={() => setCheckedMayoreo(!checkedMayoreo)}
                    ></Checkbox>
                    }
                    type="text"
                    style={{
                    width: 250,
                    }}
                />
            </Space.Compact>    
            <Space.Compact>
                <Input
                    addonBefore={
                        <div className="fixed-addon">
                            Gran Mayoreo
                        </div>
                    }
                    addonAfter={
                    <Checkbox
                        checked={checkedGranMayoreo}
                        onClick={() => setCheckedGranMayoreo(!checkedGranMayoreo)}
                    ></Checkbox>
                    }
                    type="text"
                    style={{
                    width: 250,
                    }}
                />
            </Space.Compact>
            <Divider />

            
          </div>
        </Col>
      </Row>

      <Tooltip title={textToolTipAddTask} placement="left">
        <FloatButton
          shape="circle"
          type="primary"
          style={{ insetInlineEnd: 20 }}
          icon={<PlusCircleOutlined />}
        />
      </Tooltip>

      <Row>
        <Col span={12}>{/*  <ChartMoreSell /> */}</Col>
        <Col span={12}>{/* <ChartMoreSell /> */}</Col>
      </Row>
    </div>
  );
};

export default DashboardPrecios;
