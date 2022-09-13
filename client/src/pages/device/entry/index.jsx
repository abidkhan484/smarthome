import { useState } from 'react';
import { Button, Form, message } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import ProForm, { ProFormFieldSet, ProFormSelect, ProFormText } from '@ant-design/pro-form';
import { save } from '../service';

const EntryForm = () => {
  const [form] = Form.useForm();
  const [room, setRoom] = useState('');
  const onFinish = async (values) => {
    console.log('Values '.values);
    const result = await save(values);
    console.log(`response ${result}`);

    if (result instanceof Error) {
      message.error(result.message);
    } else {
      message.success(result.message);
      form.resetFields();
    }
  };
  return (
    <PageContainer>
      <ProForm name="new-device" layout="vertical" onFinish={onFinish} form={form}>
        <ProFormFieldSet name="room" label="Add Room">
          <ProFormSelect
            width="md"
            name="room"
            label="Room"
            rules={[{ required: true, message: 'Please select a room' }]}
          />
          <ProFormText
            width="md"
            placeholder="Add new space if not exists"
            // onChange={(e) => {
            //   console.log(e)
            //   setRoom(e.target.value);
            // }}
          />
          <Button
            onClick={() => {
              console.log(room);
            }}
          >
            Add
          </Button>
        </ProFormFieldSet>
        <ProFormText width="md" label="Add Device" placeholder="Add new device" />
      </ProForm>
    </PageContainer>
  );
};

export default EntryForm;
