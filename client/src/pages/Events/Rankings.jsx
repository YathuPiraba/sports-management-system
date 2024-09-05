import React, { useState } from 'react';
import { Button, Table, Modal, Form, Input, DatePicker, Select } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

// Page: /admin/events/:eventId/sports/:sportId/rankings
const Rankings = ({ eventId, sportId }) => {
  const [rankings, setRankings] = useState([]);

  const columns = [
    {
      title: "Rank",
      dataIndex: "rank",
      key: "rank",
    },
    {
      title: "Club",
      dataIndex: "club",
      key: "club",
    },
    {
      title: "Points",
      dataIndex: "points",
      key: "points",
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Rankings</h1>
      <Table
        dataSource={rankings}
        columns={columns}
        rowKey="rank"
        className="w-full"
      />
    </div>
  );
};

export default Rankings;
