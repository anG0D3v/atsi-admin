'use client';
import React, {
  type ChangeEvent,
  useCallback,
  useLayoutEffect,
  useState,
} from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Form, Tabs,  type TabsProps } from 'antd';
import _ from 'lodash';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { FormItem } from 'react-hook-form-antd';
import { BsFileEarmarkPerson } from 'react-icons/bs';
import { MdDelete } from 'react-icons/md';
import { PiPlus } from 'react-icons/pi';
import { RiDeleteBin5Fill } from 'react-icons/ri';
import { type z } from 'zod';
import { CustomLabel, CustomButton, CustomInput, CustomTable, CustomTag, CustomModal } from '@/components';
import { ACTIONS } from '@/config/utils/constants';
import {  useDebounce, dateFormatter } from '@/config/utils/util';
import { type IUserDTO } from '@/interfaces/global';
import UserListSevices from '@/services/userList';
import userValidator from '@/validations/user';
import useStore from '@/zustand/store/store';
import {
  fetchUserList, selector,
  deleteUser,
  addUser
} from '@/zustand/store/store.provider';

type TValidationSchema = z.infer<typeof userValidator>;

export default function page() {
  const [filter, setFilter] = useState({
    username: '',
    status: '',
    type:''
  });
  const [open, setOpen] = useState(false);
  const users = useStore(selector('userList'));
  const [action, setAction] = useState<string>(ACTIONS.ADD);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const { handleSubmit, control, reset } =
  useForm<TValidationSchema>({
    defaultValues: {
      username:'',
      email:'',
      password: ''
    },
    resolver: zodResolver(userValidator),
  });

  const items: TabsProps['items'] = [
    {
      key: '',
      label: 'All',
    },
    {
      key: 'Administrator',
      label: 'Administrator',
    },
    {
      key: 'User',
      label: 'User',
    },
  ];

  const showModal = useCallback((act:string) => {
    setOpen(true);
    setAction(act)
  }, []);

  const userMutation = useMutation({
    mutationFn:
      async (info: object) => await addUser(info),
    onSuccess: () => {
      setOpen(false);
      reset({
        username:'',
        email:'',
        password: '',
      });
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const onSubmit: SubmitHandler<TValidationSchema> = useCallback(
    (data) => {
        userMutation.mutate(data);
    },
    [],
  );

  const { data: userlistData, isLoading } = useQuery({
    queryKey: ['userList', filter],
    queryFn: async () => await UserListSevices.fetchAll(filter),
  });
  const onHandleClose = useCallback(() => {
    setOpen(false);
    reset({
      username:'',
      email:'',
      password: ''
    });
  }, []);

  const onChangeTab = (key: string) => {
    setFilter((prevState) => ({
      ...prevState,
      type: key,
    }));
  };

  useLayoutEffect(() => {
    if (!isLoading) {
      loadCategories(userlistData?.data?.data);
    }
  }, [isLoading, userlistData]);

  const loadCategories = async (payload: IUserDTO[]) => {
    fetchUserList(payload);
  };

  const onSetFilter = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilter((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }, []);

  const renderModalContent = () => (
    <Form onFinish={handleSubmit(onSubmit)} className="mt-5">
      <FormItem name="username" control={control}>
        <CustomInput
          size="large"
          label="Username"
          placeholder="Ex. Johny"
          type="text"
        />
      </FormItem>
      <FormItem name="email" control={control}>
        <CustomInput
          size="large"
          label="Email"
          placeholder="Ex. abc@gmail.com"
          type="text"
        />
      </FormItem>
      <FormItem name="password" control={control}>
        <CustomInput
          size="large"
          label="Password"
          placeholder="Ex. password"
          type="text"
        />
      </FormItem>

      <Form.Item>
        <div className="mt-5 p-0 mb-0 w-full flex items-center justify-end">
          <CustomButton
            htmlType="submit"
            loading={users?.loading}
            type="primary"
            children={'Submit'}
          />
        </div>
      </Form.Item>
    </Form>
  );

  const columns = [
    {
      key: 0,
      dataIndex: 'username',
      title: 'Username',
    },
    {
      key: 1,
      dataIndex: 'email',
      title: 'Email',
    },
    {
      key: 2,
      dataIndex: 'status',
      title: 'Status',
      render: (data: string, index: number) => (
        <CustomTag
          key={index}
          children={data}
          color={data === 'Active' ? 'green' : 'red'}
        />
      ),
    },
    {
      key: 3,
      dataIndex: 'createdAt',
      title: 'Date Added',
      render: (data: any, index: number) => (
        <span key={index}>{dateFormatter(data)}</span>
      ),
    },
    {
      key: 4,
      dataIndex: 'updatedAt',
      title: 'Date Modified',
      render: (data: any, index: number) => (
        <span key={index}>{!_.isNil(data) ? dateFormatter(data) : 'N/A'}</span>
      ),
    },
    {
      key: 5,
      title: 'Action',
      render: (data: any, index: number) => (
        <div className="flex flex-row items-center gap-2 w-full" key={index}>
          <CustomButton
            type="primary"
            children={data.status === 'Active' ? 'Active' : 'Inactive'}
            onClick={async() => await deleteUser(data)}
          />
          <CustomButton
            type="dashed"
            danger
            children={<RiDeleteBin5Fill />}
            onClick={async() => await deleteUser(data)}
          />
        </div>
      ),
    },
  ];

  const onSelectChange = (selectedRows: any) => {
    setSelectedRowKeys(selectedRows);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange
  };
  const userData = users?.list?.map(data => ({
    ...data,
    key:data.id
  }))
  console.log(action)
  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="w-full flex items-center space-x-3">
          <div className="p-3 rounded-full bg-blue-500/20 border border-blue-400">
            <BsFileEarmarkPerson size={40} className="text-blue-500" />
          </div>
          <div className="flex flex-col">
            <CustomLabel
              variant="text"
              classes="font-semibold text-5xl"
              children="User Management"
            />
            <CustomLabel
              variant="text"
              classes="text-base text-gray-400"
              children="This section allows you to view, add, edit, and delete a certain user"
            />
          </div>
        </div>

        <CustomButton
          icon={<PiPlus />}
          size="large"
          children="Add User"
          onClick={() => showModal(ACTIONS.ADD)}
        />
      </div>
      <div className="mt-14 space-y-5">
        <Tabs defaultActiveKey="0" items={items} onChange={onChangeTab} />
        <div className="flex relative w-full">
          {selectedRowKeys.length > 0 &&
            <CustomButton
            icon={<MdDelete />}
            size="large"
            danger
            children="Delete Selected"
            onClick={() => showModal(ACTIONS.MULTIDELETE)}
          />
          }
          <div className='w-full flex justify-end text-right'>
          <CustomInput
            placeholder="Search brand name"
            size="large"
            classes="w-52"
            name="name"
            onChange={useDebounce(onSetFilter)}
          />
          </div>
        </div>
        <CustomTable
          columns={columns}
          loading={isLoading}
          datasource={!isLoading ? userData : []}
          rowSelection={rowSelection}
        />
      </div>
      <CustomModal
        onCancel={onHandleClose}
        title={'Add User Account'
        }
        footer={null}
        isOpen={open}
        children={renderModalContent()}
      />
    </div>
  );
}
