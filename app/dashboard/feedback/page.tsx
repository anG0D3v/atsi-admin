'use client';
import React, {
  type ChangeEvent,
  useCallback,
  useLayoutEffect,
  useState,
} from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery,useQueryClient } from '@tanstack/react-query';
import { Form, Rate, Tabs,  type TabsProps } from 'antd';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { BsFileEarmarkPerson } from 'react-icons/bs';
import { MdDelete } from 'react-icons/md';
import { type z } from 'zod';
import { CustomLabel, CustomButton, CustomInput, CustomTable, CustomTag, CustomModal } from '@/components';
import { ACTIONS } from '@/config/utils/constants';
import {  useDebounce } from '@/config/utils/util';
import { type IFeedback } from '@/interfaces/global';
import FeedbackServices from '@/services/feedback';
import userValidator from '@/validations/user';
import useStore from '@/zustand/store/store';
import { selector,
  deleteFeedback,
  restoreFeedback,
  loadReviews,
} from '@/zustand/store/store.provider';

type TValidationSchema = z.infer<typeof userValidator>;

export default function page() {
  const [filter, setFilter] = useState({
    userName: '',
    productName: '',
    type:'',
    isDeleted:false
  });
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const user = useStore(selector('user'));
  const feedbackList = useStore(selector('products'));
  const [action, setAction] = useState<string>(ACTIONS.ADD);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const { handleSubmit, reset,setValue } =
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
      key: 'Active',
      label: 'Active',
    },
    {
      key: 'Deleted',
      label: 'Deleted',
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

  const feedbackMutation = useMutation({
    mutationFn:
      (action === ACTIONS.DELETE || action === ACTIONS.MULTIDELETE)
      ? async(info:object) => await deleteFeedback(info)
      : async(info: object) => await restoreFeedback(info),
    onSuccess: () => {
      setOpen(false);
      reset({
        username:'',
        email:'',
        password: '',
      });
      setSelectedRowKeys([])
      queryClient.invalidateQueries({ queryKey: ['feeds'] });
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const onSubmit: SubmitHandler<TValidationSchema> = useCallback(
    (data) => {
        const formData = new FormData();
        if(action === ACTIONS.DELETE || action === ACTIONS.RESTORE){
          formData.append('ids[]',data?.id)
        }else if(action === ACTIONS.MULTIDELETE){
          selectedRowKeys?.map(item => formData.append('ids[]',item))
        }
        formData.append('updatedBy',user?.info?.id)
        feedbackMutation.mutate(formData);
    },
    [action, feedbackMutation, selectedRowKeys],
  );

  const { data: listData, isLoading } = useQuery({
    queryKey: ['feeds', filter],
    queryFn: async () => await FeedbackServices.fetchAll(filter),
  });
  const onHandleClose = useCallback(() => {
    setOpen(false);
    setSelectedRowKeys([])
  }, []);

  const onChangeTab = (key: string) => {
    if(key === 'Active'){
      setFilter((prevState) => ({
        ...prevState,
        isDeleted: false,
      }));
    }else{
      setFilter((prevState) => ({
        ...prevState,
        isDeleted: true,
      }));
    }
  };

  useLayoutEffect(() => {
    if (!isLoading) {
      loadFeedbackData(listData?.data?.data);
    }
  }, [isLoading, listData]);
  const loadFeedbackData = async (payload: IFeedback[]) => {
    loadReviews(payload)
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
      {action === ACTIONS.MULTIDELETE ? (
        <div>
          <CustomLabel
            variant="text"
            children={
              <span>
                {' '}
                Are you sure? Do you really want to{' '}
                delete{' '}
                all selected feedback{' '}
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
                this feedback{' '}
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
            loading={feedbackList?.loading}
            type="primary"
            children={
              action === ACTIONS.DELETE
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
      dataIndex: 'createdByUser',
      title: 'Username',
      render: (data: any, index: number) => (
        <span key={index}>{data.username}</span>
      ),
    },
    {
      key: 1,
      dataIndex: 'createdByUser',
      title: 'Email',
      render: (data: any, index: number) => (
        <span key={index}>{data.email}</span>
      ),
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
      dataIndex: 'product',
      title: 'Product',
      render: (data: any, index: number) => (
        <span key={index}>{data.name}</span>
      ),
    },
    {
      key: 4,
      dataIndex: 'rating',
      title: 'Rate',
      render: (data: any, index: number) => (
          <Rate className='text-nowrap' value={data} />
      ),
    },
    {
      key: 5,
      dataIndex: 'content',
      title: 'Review',
      render: (data: any, index: number) => (
        <span className='line-clamp-5' key={index}>{data}</span>
      ),
    },
    {
      key: 6,
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
  const feedData = feedbackList?.reviews?.map((data: { id: any; }) => ({
    ...data,
    key:data.id
  }))
  console.log(filter)
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
              children="Products Feedback"
            />
            <CustomLabel
              variant="text"
              classes="text-base text-gray-400"
              children="This section allows you to view, and delete a certain feedback"
            />
          </div>
        </div>
      </div>
      <div className="mt-14 space-y-5">
        <Tabs defaultActiveKey="Active" items={items} onChange={onChangeTab} />
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
            <div className='flex  flex-nowrap gap-4'>
            <CustomInput
              placeholder="Search Product Name"
              size="large"
              classes="w-64"
              name="productName"
              onChange={useDebounce(onSetFilter)}
            />
            <CustomInput
              placeholder="Search User Name"
              size="large"
              classes="w-64"
              name="userName"
              onChange={useDebounce(onSetFilter)}
            />
            </div>

          </div>
        </div>
        <CustomTable
          columns={columns}
          loading={isLoading}
          datasource={!isLoading ? feedData : []}
          rowSelection={rowSelection}
        />
      </div>
      <CustomModal
        onCancel={onHandleClose}
        title={action === (ACTIONS.DELETE || ACTIONS.MULTIDELETE) ? 'Delete Feedback' : 'Restore Feedback'}
        footer={null}
        isOpen={open}
        children={renderModalContent()}
      />
    </div>
  );
}
