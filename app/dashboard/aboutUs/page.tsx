/* eslint-disable @typescript-eslint/promise-function-async */
'use client';
import React, {
  useCallback,
  useState,
  useLayoutEffect,
} from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery,useQueryClient } from '@tanstack/react-query';
import { Form,type TableColumnsType  } from 'antd';
import _ from 'lodash';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { FormItem } from 'react-hook-form-antd';
import { MdDelete } from 'react-icons/md';
import { PiPlus } from 'react-icons/pi';
import { TbBrandFramerMotion } from 'react-icons/tb';
import { type z } from 'zod';
import {
  CustomButton,
  CustomLabel,
  CustomModal,
  CustomTable,
  CustomTag,
  CustomTextArea,
} from '@/components';
import { ACTIONS } from '@/config/utils/constants';
import { type IWebDTO } from '@/interfaces/global';
import AboutUsServices from '@/services/aboutUs';
import brandValidator from '@/validations/brand';
import type webValidator from '@/validations/Web';
import useStore from '@/zustand/store/store';
import {
  selector,
  fetchAbouts,
  addAbouts,
  updateAbouts,
  deleteAbouts,
  restoreAbouts,
  setInactiveActive,
} from '@/zustand/store/store.provider';

type ValidationSchema = z.infer<typeof webValidator>;

export default function page() {
    const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
    const user = useStore(selector('user'));
    const queryClient = useQueryClient();
    const { handleSubmit, control, reset, setValue, getValues} =
      useForm<ValidationSchema>({
        defaultValues: {
          id: '',
          content: '',
          status: '',
          createdBy: user?.info?.id,
          updatedBy: ''
        },
        resolver: zodResolver(brandValidator),
      });
  
    const aboutsUs = useStore(selector('Abouts'));
  
    const [action, setAction] = useState<string>(ACTIONS.ADD);

    const handleActiveInactive = async(data:any):Promise<void> =>{
      const formData = new FormData();
      formData.append('updatedBy',user?.info?.id)
      formData.append('id',data.id)
      await setInactiveActive(formData,data.status)
      queryClient.invalidateQueries({ queryKey: ['abouts'] });
    }
    const columns: TableColumnsType = [
      {
        key: 0,
        dataIndex: 'content',
        title: 'Content',
      },
      {
        key: 1,
        title: 'Status',
        render: (data: any, index: number) => (
          data.isDeleted ? <CustomTag color='red'>Deleted</CustomTag> : <div key={index}>
            {data.status === 'Active' ? <CustomButton children='Set Inactive'
             onClick={() => handleActiveInactive(data)}
             
            /> 
            : <CustomButton children='Set Active'
            onClick={() => handleActiveInactive(data)}
            />}
          </div>
        ),
      },
      {
        key: 2,
        dataIndex: 'createdByUser',
        title: 'Added By',
        render: (data: any, index: number) => (
          <span key={index}>{data?.username ?? 'N/A'}</span>
        ),
      },
      {
        key: 3,
        title: 'Action',
        render: (data: any, index: number) => (
          <div className="flex flex-row items-center gap-2 w-full" key={index}>
            <CustomButton
              type="primary"
              children="Edit"
              onClick={() => showModal(ACTIONS.EDIT, data)}
            />
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
  
    const { data: aboutUsData, isLoading } = useQuery({
      queryKey: ['abouts'],
      queryFn: async () => await AboutUsServices.fetchAll(),
    });
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  
    useLayoutEffect(() => {
      if (!isLoading) {
        fetchAboutsData(aboutUsData?.data?.data);
      }
    }, [ aboutUsData,isLoading]);
    const fetchAboutsData = async (payload: IWebDTO[]) => {
      fetchAbouts(payload);
    };
  
    const showModal = useCallback(
      (act: string, data?: any) => {
        setIsOpenModal(true);
        console.log(data)
        setAction(act);
        if (act === ACTIONS.EDIT || act === ACTIONS.DELETE || act === ACTIONS.RESTORE) {
          setValue('id', data?.id);
          setValue('content', data?.content);
          setValue('updatedBy', user?.info?.id);
          setValue('status', data?.status);
        }
      },
      [setValue],
    );
    const onHandleClose = useCallback(() => {
      setIsOpenModal(false);
      reset({
        id: '',
        content: '',
        status: '',
        createdBy: user?.info?.id,
        updatedBy: ''
      });
      setSelectedRowKeys([])
    }, []);
  
    const contentMutation = useMutation({
      mutationFn:
        action === ACTIONS.ADD
          ? async (info: object) => await addAbouts(info)
          : action === ACTIONS.EDIT
          ? async (info: object) => await updateAbouts(info)
          : (action === ACTIONS.DELETE || action === ACTIONS.MULTIDELETE) 
          ? async (info: object) => await deleteAbouts(info)
          : async (info: object) => await restoreAbouts(info),
      onSuccess: (response) => {
        setIsOpenModal(false);
        reset({
          id: '',
          content: '',
          status: '',
          createdBy: user?.info?.id,
          updatedBy: ''
        });
        setSelectedRowKeys([])
        queryClient.invalidateQueries({ queryKey: ['abouts'] });
      },
      onError: (error) => {
        console.log(error);
      },
    });
    const onSubmit: SubmitHandler<ValidationSchema> = useCallback(
      (data) => {
          console.log(data)
        const formData = new FormData();
        if(action !== ACTIONS.DELETE && action !== ACTIONS.RESTORE && action !== ACTIONS.MULTIDELETE) {
          formData.append('content', getValues('content'));
        }
  
        if (action === ACTIONS.ADD) {
          formData.append('createdBy', data?.createdBy);
          
        } else if (action === ACTIONS.EDIT) {
          formData.append('id', data?.id);
          formData.append('updatedBy', data?.updatedBy);
        }else if(action === ACTIONS.DELETE || action === ACTIONS.RESTORE){
          formData.append('updatedBy', data?.updatedBy);
          formData.append('ids[]',data?.id)
        }else if(action === ACTIONS.MULTIDELETE){
          formData.append('updatedBy', user?.info?.id);
          selectedRowKeys.map(item =>formData.append('ids[]',item))
        }
  
        contentMutation.mutate(formData);
      },
      [action]
    );
  
    // Rendered Components
    const renderModalContent = () => (
      <Form layout='vertical' onFinish={handleSubmit(onSubmit)} className="mt-5">
        {(action !== ACTIONS.DELETE && action !== ACTIONS.RESTORE && action !== ACTIONS.MULTIDELETE) ? (
          <>
            <FormItem name="content" control={control}>
              <CustomTextArea
                size="large"
                placeholder="Some content here"
                label="Content"
                type="text"
                classes="resize-none"
              />
            </FormItem>
          </>
        ) : action === ACTIONS.MULTIDELETE ? (
          <div>
            <CustomLabel
              variant="text"
              children={
                <span>
                  {' '}
                  Are you sure? Do you really want to{' '}
                  delete{' '}
                  all selected blogs{' '}
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
                  {action === ACTIONS.DELETE
                    ? 'delete'
                    : 'restore'}{' '}
                  this content{' '}
                  <span className="font-semibold">{getValues('title')}</span>
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
              loading={aboutsUs?.loading}
              type="primary"
              danger={
                (action === ACTIONS.DELETE)
              }
              children={
                action === ACTIONS.ADD
                  ? 'Submit'
                  : action === ACTIONS.EDIT
                  ? 'Save Changes'
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
    const aboutData = aboutsUs?.list?.map((data: { id: any; }) => ({
      ...data,
      key:data.id
    }))
  return (
    <div className="">
      <div className="flex items-center justify-between">
        <div className="w-full flex items-center space-x-3">
          <div className="p-3 rounded-full bg-blue-500/20 border border-blue-400">
            <TbBrandFramerMotion size={40} className="text-blue-500" />
          </div>
          <div className="flex flex-col">
            <CustomLabel
              variant="text"
              classes="font-semibold text-5xl"
              children="About us"
            />
          </div>
        </div>

        <CustomButton
          icon={<PiPlus />}
          size="large"
          children="Add Content"
          onClick={() => showModal(ACTIONS.ADD)}
        />
      </div>
      <div className="mt-14 w-full space-y-5">
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

        </div>
        <CustomTable
          columns={columns}
          loading={isLoading}
          rowSelection={rowSelection}
          datasource={!isLoading ? aboutData : []}
        />
      </div>
      <div>
        <CustomModal
          onCancel={onHandleClose}
          title={
            _.isEqual(action, ACTIONS.ADD)
              ? 'Add a content'
              : _.isEqual(action, ACTIONS.EDIT)
              ? 'Edit a content'
              : _.isEqual(action, ACTIONS.DELETE)
              ? 'Delete a content'
              : _.isEqual(action, ACTIONS.MULTIDELETE)
              ? 'Delete  multiple content'
              : 'Restore a content'
          }
          footer={null}
          isOpen={isOpenModal}
          children={renderModalContent()}
        />
      </div>
    </div>
  )
}
