import React from 'react';
import { Modal, Form, Input, DatePicker } from 'antd';


const EventFormModal = ({ visible, onOk, onCancel, event }) => {
    const [form] = Form.useForm();
  
    return (
      <Modal
        title={event ? "Edit Event" : "Add Event"}
        visible={visible}
        onOk={() => {
          form.validateFields().then((values) => {
            onOk(values);
            form.resetFields();
          });
        }}
        onCancel={onCancel}
      >
        <Form form={form} layout="vertical" initialValues={event}>
          <Form.Item
            name="name"
            label="Event Name"
            rules={[{ required: true, message: 'Please input the event name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="startDate"
            label="Start Date"
            rules={[{ required: true, message: 'Please select the start date!' }]}
          >
            <DatePicker className="w-full" />
          </Form.Item>
          <Form.Item
            name="endDate"
            label="End Date"
            rules={[{ required: true, message: 'Please select the end date!' }]}
          >
            <DatePicker className="w-full" />
          </Form.Item>
        </Form>
      </Modal>
    );
  };

export default EventFormModal