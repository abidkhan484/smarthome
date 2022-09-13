import { Suspense, useState } from 'react';
import { Col, Dropdown, Menu, Row, Button, Space, message } from 'antd';
import { GridContent, PageContainer } from '@ant-design/pro-layout';
import { useRequest } from 'umi';
import { search, update } from '../service';
import ProTable from '@ant-design/pro-table';
import { useEffect } from 'react';

// const devices = [
//   {
//     "_id": "6316bcdc0d100af1607ee381",
//     "userId": "62d62a7eeff21875139c4d7e",
//     "deviceId": "switch2",
//     "subscribeTopic": "switch2_status",
//     "publishTopic": "switch2",
//     "status": 0
//   },
//   {
//     "_id": "6316bcdc0d100af1607ee383",
//     "userId": "62d62a7eeff21875139c4d7e",
//     "deviceId": "switch4",
//     "subscribeTopic": "switch4_status",
//     "publishTopic": "switch4",
//     "status": 0
//   },
//   {
//     "_id": "6316bcdc0d100af1607ee380",
//     "userId": "62d62a7eeff21875139c4d7e",
//     "deviceId": "switch1",
//     "subscribeTopic": "switch1",
//     "publishTopic": "switch1",
//     "status": 0
//   },
//   {
//     "_id": "6316bcdc0d100af1607ee382",
//     "userId": "62d62a7eeff21875139c4d7e",
//     "deviceId": "switch3",
//     "subscribeTopic": "switch3_status",
//     "publishTopic": "switch3",
//     "status": 0
//   },
// ];

const Device = () => {
  const columns = [
    {
      title: 'Device Id',
      dataIndex: 'deviceId',
      renderText: (_, entity) => `${entity.deviceId}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (_, entity) => {
        const { _id, publishTopic, status } = entity;
        return (
          <>
            <Button
              style={{
                background: '#fa5552',
                fontWeight: 'bold',
              }}
              key={_id}
              onClick={() => {
                const data = {
                  _id: _id,
                  topic: publishTopic,
                  status: !status | 0,
                };
                changeButtonStatus(data);
              }}
            >
              {status ? 'OFF' : 'ON'}
            </Button>
          </>
        );
      },
    },
  ];
  const [devices, setDevices] = useState({ data: [] });

  const fetchResourceData = async () => {
    const hide = message.loading('Loading...');
    try {
      const result = await search();
      hide();
      setDevices(result);
    } catch (error) {
      hide();
      console.log(error);
    }
  };

  const changeButtonStatus = async (data) => {
    const updatedResp = await update(data);
    if (updatedResp.success == true) {
      const newDevices = {
        ...devices,
        data: devices.data.map((device) => {
          return device._id == data._id ? { ...device, status: data.status } : device;
        })
      }
      setDevices(newDevices);
    }
  };

  useEffect(() => {
    fetchResourceData();
  }, []);

  return (
    <>
      <PageContainer>
        <ProTable
          headerTitle="Devices"
          rowKey="_id"
          search={false}
          options={{ reload: false }}
          dataSource={devices.data}
          columns={columns}
        />
      </PageContainer>
    </>
  );
};

export default Device;
