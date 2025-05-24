import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Button } from "antd";

const ModalAddTask = ({ visible, onClose  }) => {
/*     const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState('Content of the modal');
 */

  const [form] = Form.useForm();




   /*  const showModal = () => {
        setOpen(true);
    };

    const handleOk = () => {
        setModalText('The modal will be closed after two seconds');
        setConfirmLoading(true);
        setTimeout(() => {
          setOpen(false);
          setConfirmLoading(false);
        }, 2000);
      };

      const handleCancel = () => {
        console.log('Clicked cancel button');
        setOpen(false);
      };
 */
    return (
        <>
            
            <Modal
                title="Add New Task"
                visible={visible}
                open={visible}
                //onOk={visible}
                //confirmLoading={confirmLoading}
                onCancel={onClose}
                footer={[
                    <Button key="cancel" onClick={onClose}>
                      Cancel
                    </Button>,
                    <Button key="submit" type="primary" onClick={() => form.submit()}>
                      Submit
                    </Button>,
                  ]}
            >
       
                <Form form={form}  layout="vertical">
        <Form.Item name="name" label="Name" rules={[{ required: true, message: "Please enter a name" }]}>
          <Input />
        </Form.Item>
        <Form.Item name="email" label="Email" rules={[{ required: true, message: "Please enter an email" }]}>
          <Input />
        </Form.Item>
      </Form>
                {/* Add form fields */}
            </Modal>
        </>
    );
};

export default ModalAddTask;