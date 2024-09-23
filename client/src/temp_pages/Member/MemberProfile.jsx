import React from 'react';
import { Tabs, Card, Table } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const PlayerProfile = ({ playerDetails }) => {
  // Use optional chaining (?.) to safely access nested properties
  const infoItems = [
    {
      label: "Height / Weight",
      value: `${playerDetails?.height || 'N/A'} / ${playerDetails?.weight || 'N/A'}`,
    },
    { label: "Born", value: playerDetails?.born || 'N/A' },
    { label: "Net Worth", value: playerDetails?.netWorth || 'N/A' },
    { label: "NBA Draft", value: playerDetails?.draft || 'N/A' },
    { label: "NBA Champ.", value: playerDetails?.championships || 'N/A' },
    { label: "Nationality", value: playerDetails?.nationality || 'N/A' },
  ];

  const recentGamesColumns = [
    { title: 'Date', dataIndex: 'date', key: 'date' },
    { title: 'Opp', dataIndex: 'opponent', key: 'opponent' },
    { title: 'Result', dataIndex: 'result', key: 'result' },
    { title: 'Min', dataIndex: 'minutes', key: 'minutes' },
    { title: 'Pts', dataIndex: 'points', key: 'points' },
    { title: 'Reb', dataIndex: 'rebounds', key: 'rebounds' },
    { title: 'Ast', dataIndex: 'assists', key: 'assists' },
    { title: 'Stl', dataIndex: 'steals', key: 'steals' },
    { title: 'Blk', dataIndex: 'blocks', key: 'blocks' },
  ];

  // Define tab items with checks for undefined data
  const tabItems = [
    {
      label: "PLAYER INFO",
      key: "1",
      children: (
        <Table
          dataSource={playerDetails?.recentGames || []} // Use empty array if data is undefined
          columns={recentGamesColumns}
          pagination={false}
          size="small"
        />
      ),
    },
    {
      label: "STATS",
      key: "2",
      children: (
        <div>
          {/* Add stats content here */}
          <p>Stats Content</p>
        </div>
      ),
    },
    {
      label: "NEWS",
      key: "3",
      children: (
        <div>
          {/* Add news content here */}
          <p>News Content</p>
        </div>
      ),
    },
    {
      label: "COMPARISONS",
      key: "4",
      children: (
        <div>
          {/* Add comparisons content here */}
          <p>Comparisons Content</p>
        </div>
      ),
    },
    {
      label: "BIO",
      key: "5",
      children: (
        <div>
          {/* Add bio content here */}
          <p>Bio Content</p>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-blue-900 p-4 text-white">
      <div className="flex items-center space-x-4 mb-4">
        {playerDetails?.image ? (
          <img
            src={playerDetails.image}
            alt={playerDetails.name}
            className="w-24 h-24 rounded-full"
          />
        ) : (
          <UserOutlined className="text-6xl" />
        )}
        <div>
          <h2 className="text-2xl font-bold">{playerDetails?.name || 'Unknown Player'}</h2>
          <p>{playerDetails?.team || 'Unknown Team'}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        {infoItems.map((item, index) => (
          <Card key={index} className="bg-blue-800 text-white">
            <p className="text-sm text-blue-300">{item.label}</p>
            <p className="font-semibold">{item.value}</p>
          </Card>
        ))}
      </div>

      <Card className="bg-white">
        {/* Ant Design Tabs with items */}
        <Tabs defaultActiveKey="1" items={tabItems} />
      </Card>
    </div>
  );
};

export default PlayerProfile;
