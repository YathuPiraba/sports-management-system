import React from 'react';
import {  Modal, Form, Input, DatePicker } from 'antd';
import { addEventSportsAPI } from '../../../Services/apiServices';


const SportsFormModal = ({ visible, onOk, onCancel, sport }) => {
  const [form] = Form.useForm();

  return (
    <Modal
      title={sport ? "Edit Sport" : "Add Sport"}
      visible={visible}
      onOk={() => {
        form.validateFields().then((values) => {
          onOk(values);
          form.resetFields();
        });
      }}
      onCancel={onCancel}
    >
      <Form form={form} layout="vertical" initialValues={sport}>
        <Form.Item
          name="name"
          label="Sport Name"
          rules={[{ required: true, message: "Please input the sport name!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="date"
          label="Date"
          rules={[{ required: true, message: "Please select the date!" }]}
        >
          <DatePicker className="w-full" />
        </Form.Item>
        <Form.Item
          name="venue"
          label="Venue"
          rules={[{ required: true, message: "Please input the venue!" }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SportsFormModal;
