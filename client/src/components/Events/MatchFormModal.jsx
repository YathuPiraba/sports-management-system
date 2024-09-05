import React, { useState } from 'react';
import { Button, Table, Modal, Form, Input, DatePicker, Select } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const MatchFormModal = ({ visible, onOk, onCancel, match }) => {
    const [form] = Form.useForm();
  
    return (
      <Modal
        title={match ? "Edit Match" : "Add Match"}
        visible={visible}
        onOk={() => {
          form.validateFields().then((values) => {
            onOk(values);
            form.resetFields();
          });
        }}
        onCancel={onCancel}
      >
        <Form form={form} layout="vertical" initialValues={match}>
          <Form.Item
            name="team1"
            label="Team 1"
            rules={[{ required: true, message: 'Please select Team 1!' }]}
          >
            <Select>
              {/* Add options for teams */}
            </Select>
          </Form.Item>
          <Form.Item
            name="team2"
            label="Team 2"
            rules={[{ required: true, message: 'Please select Team 2!' }]}
          >
            <Select>
              {/* Add options for teams */}
            </Select>
          </Form.Item>
          <Form.Item
            name="dateTime"
            label="Date and Time"
            rules={[{ required: true, message: 'Please select the date and time!' }]}
          >
            <DatePicker showTime className="w-full" />
          </Form.Item>
        </Form>
      </Modal>
    );
  };

export default MatchFormModal