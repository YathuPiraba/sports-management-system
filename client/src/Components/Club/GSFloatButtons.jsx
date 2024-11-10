import React from 'react';
import { FloatButton, Tooltip } from 'antd';
import { 
  PhoneOutlined,
  UserOutlined,
  NumberOutlined,
  HomeOutlined,
  InfoCircleOutlined 
} from '@ant-design/icons';

const GSFloatButtons = ({ gsDivision }) => {
  const buttonItems = [
    {
      icon: <PhoneOutlined />,
      tooltip: `Contact: ${gsDivision?.contactNo}`,
      type: "default"
    },
    {
      icon: <HomeOutlined />,
      tooltip: `Division: ${gsDivision?.divisionName}`,
      type: "default"
    },
    {
      icon: <NumberOutlined />,
      tooltip: `Division No: ${gsDivision?.divisionNo}`,
      type: "default"
    },
    {
      icon: <UserOutlined />,
      tooltip: `GS Officer: ${gsDivision?.gs_Name}`,
      type: "default"
    }
  ];

  return (
    <FloatButton.Group
      trigger="click"
      type="primary"
      description="GS"
      style={{
        insetInlineEnd: 24,
      }}
      icon={<InfoCircleOutlined />}
    >
      {buttonItems.map((item, index) => (
        <Tooltip 
          key={index} 
          title={item.tooltip} 
          placement="left"
        >
          <FloatButton
            icon={item.icon}
            type={item.type}
          />
        </Tooltip>
      ))}
    </FloatButton.Group>
  );
};

export default GSFloatButtons;