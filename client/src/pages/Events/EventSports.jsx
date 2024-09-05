import React, { useState } from 'react';
import { Button, Table, Modal, Form, Input, DatePicker, Select } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

// Page: /admin/events/:eventId/sports
const EventSports = ({ eventId }) => {
    const [sports, setSports] = useState([]);
    const [isSportModalVisible, setIsSportModalVisible] = useState(false);
    const [selectedSport, setSelectedSport] = useState(null);
    
    // ... (similar structure to EventManagementDashboard)
    
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Sport Management</h1>
        {/* ... (similar structure to EventManagementDashboard) */}
      </div>
    );
    };
export default EventSports