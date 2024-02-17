'use client';
import React, {
  type ChangeEvent,
  useCallback,
  useLayoutEffect,
  useState,
} from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery,useQueryClient } from '@tanstack/react-query';
import { Form, Tabs,  type TabsProps } from 'antd';
import _ from 'lodash';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { FormItem } from 'react-hook-form-antd';
import { BsFileEarmarkPerson } from 'react-icons/bs';
import { MdDelete } from 'react-icons/md';
import { PiPlus } from 'react-icons/pi';
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
  addUser,
  restoreUser
} from '@/zustand/store/store.provider';

type TValidationSchema = z.infer<typeof userValidator>;

export default function page() {
  const [filter, setFilter] = useState({
    username: '',
    status: '',
    type:''
  });
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const users = useStore(selector('userList'));
  const [action, setAction] = useState<string>(ACTIONS.ADD);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const { handleSubmit, control, reset,getValues,setValue } =
  useForm<TValidationSchema>({
    defaultValues: {
      id:'',
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

  const showModal = useCallback((act:string,data?:any) => {
    setOpen(true);
    setAction(act);
    console.log(act)
    if(act === ACTIONS.DELETE || act === ACTIONS.MULTIDELETE || act === ACTIONS.RESTORE){
      setValue('username',data?.username)
      setValue('email',data?.email)
      setValue('password',data?.password)
      setValue('id',data?.id)
    }
    
  }, []);

  const userMutation = useMutation({
    mutationFn:
      action === ACTIONS.ADD
      ? async (info: object) => await addUser(info)
      : (action === ACTIONS.DELETE || action === ACTIONS.MULTIDELETE)
      ? async(info:object) => await deleteUser(info)
      : async(info: object) => await restoreUser(info),
    onSuccess: () => {
      setOpen(false);
      reset({
        username:'',
        email:'',
        password: '',
      });
      setSelectedRowKeys([])
      queryClient.invalidateQueries({ queryKey: ['userList'] });
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const onSubmit: SubmitHandler<TValidationSchema> = useCallback(
    (data) => {
      console.log(data)
      console.log(action)
        const formData = new FormData();
        if(action === ACTIONS.ADD){
          formData.append('username',data.username)
          formData.append('email',data.email)
          formData.append('password',data.password)
        }else if(action === ACTIONS.DELETE || action === ACTIONS.RESTORE){
          console.log('her')
          formData.append('ids[]',data?.id)
        }else if(action === ACTIONS.MULTIDELETE){
          selectedRowKeys?.map(item => formData.append('ids[]',item))
        }
        userMutation.mutate(formData);
    },
    [action, userMutation, selectedRowKeys],
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
    setSelectedRowKeys([])
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
      {(action !== ACTIONS.DELETE && action !== ACTIONS.RESTORE && action !== ACTIONS.MULTIDELETE) ? (<><FormItem name="username" control={control}>
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
      </FormItem></>) : action === ACTIONS.MULTIDELETE ? (
        <div>
          <CustomLabel
            variant="text"
            children={
              <span>
                {' '}
                Are you sure? Do you really want to{' '}
                delete{' '}
                all selected users{' '}
              </span>
            }
            classes="text-lg"
          />
        </div>
      ) : (
        <div>
          <CustomLabel
            variant="text"
            children={
              <span>
                {' '}
                Are you sure? Do you really want to{' '}
                {action === ACTIONS.DELETE ? 'Delete' : 'Restore'} {' '}
                this user{' '}
                <span className="font-semibold">{getValues('username')}</span>
              </span>
            }
            classes="text-lg"
          />
        </div>
      )}

      <Form.Item>
        <div className="mt-5 p-0 mb-0 w-full flex items-center justify-end">
          <CustomButton
            htmlType="submit"
            loading={users?.loading}
            type="primary"
            children={
              action === ACTIONS.ADD
                ? 'Submit'
                : action === ACTIONS.DELETE
                ? 'Delete'
                : action === ACTIONS.MULTIDELETE
                ? 'Delete all selected'
                : 'Restore'
            }
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
      dataIndex: 'isDeleted',
      title: 'Status',
      render: (data: string, index: number) => (
        <CustomTag
          key={index}
          children={!data ? 'Active' : 'Deleted'}
          color={!data ? 'green' : 'error'}
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
            type="dashed"
            children={!data?.isDeleted ? 'Delete' : 'Restore'}
            danger={!data?.isDeleted}
            onClick={() => showModal(!data?.isDeleted ? ACTIONS.DELETE : ACTIONS.RESTORE, data)}
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
    onChange: onSelectChange,
    getCheckboxProps: (record: any) => ({
      disabled: record.isDeleted === true, 
    }),
  };
  const userData = users?.list?.map(data => ({
    ...data,
    key:data.id
  }))
  console.log(getValues())
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
