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
import { FiLink } from 'react-icons/fi';
import { MdDelete } from 'react-icons/md';
import { PiPlus } from 'react-icons/pi';
import { type z } from 'zod';
import {
  CustomButton,
  CustomInput,
  CustomLabel,
  CustomModal,
  CustomTable,
  CustomTag,
} from '@/components';
import { ACTIONS } from '@/config/utils/constants';
import SocialMediaServices from '@/services/socialMedia';
import brandValidator from '@/validations/brand';
import type socialValidator from '@/validations/social';
import useStore from '@/zustand/store/store';
import {
  selector,
  addSocialLinks,
  updateSocialLinks,
  deleteSocialLinks,
  restoreSocialLinks,
  fetchSocialLinks,
  setInactiveActiveLinks,
} from '@/zustand/store/store.provider';


type ValidationSchema = z.infer<typeof socialValidator>;

export default function page() {
    const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
    const user = useStore(selector('user'));
    const queryClient = useQueryClient();
    const { handleSubmit, control, reset, setValue, getValues} =
      useForm<ValidationSchema>({
        defaultValues: {
          id: '',
          address: '',
          email: '',
          createdBy: user?.info?.id,
          facebook: '',
          viber:'',
          whatsapp:'',
        },
        resolver: zodResolver(brandValidator),
      });
  
    const socialLinks = useStore(selector('socialLinks'));
  
    const [action, setAction] = useState<string>(ACTIONS.ADD);

    const handleActiveInactive = async(data:any):Promise<void> =>{
      const formData = new FormData();
      formData.append('updatedBy',user?.info?.id)
      formData.append('id',data.id)
      await setInactiveActiveLinks(formData,data.status)
      queryClient.invalidateQueries({ queryKey: ['social'] });
    }
    const columns: TableColumnsType = [
      {
        key: 0,
        title: 'Social Links',
        render:(data:any) =>(
            <div>
                {data.address && <p>Address: {data.address}</p>}
                {data.email && <p>Email: {data.email}</p>}
                {data.facebook && <p>Facebook: {data.facebook}</p>}
                {data.viber && <p>Viber: {data.viber}</p>}
                {data.whatsapp && <p>WhatsApp: {data.whatsapp}</p>}
            </div>
        )
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
  
    const { data: socialData, isLoading } = useQuery({
      queryKey: ['social'],
      queryFn: async () => await SocialMediaServices.fetchAll(),
    });
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  
    useLayoutEffect(() => {
      if (!isLoading) {
        fetchSocial(socialData?.data?.data);
      }
    }, [ socialData,isLoading]);
    const fetchSocial = async (payload: any) => {
      fetchSocialLinks(payload);
    };
  
    const showModal = useCallback(
      (act: string, data?: any) => {
        setIsOpenModal(true);
        setAction(act);
        if (act === ACTIONS.EDIT || act === ACTIONS.DELETE || act === ACTIONS.RESTORE) {
          setValue('id', data?.id);
          setValue('address', data?.address);
          setValue('updatedBy', user?.info?.id);
          setValue('email', data?.email);
          setValue('facebook', data?.facebook);
          setValue('viber', data?.viber);
          setValue('whatsapp', data?.whatsapp);
        }
      },
      [setValue],
    );
    const onHandleClose = useCallback(() => {
      setIsOpenModal(false);
      reset({
        id: '',
        address: '',
        email: '',
        createdBy: user?.info?.id,
        facebook: '',
        viber:'',
        whatsapp:'',
      });
      setSelectedRowKeys([])
    }, []);
  
    const socialMutation = useMutation({
      mutationFn:
        action === ACTIONS.ADD
          ? async (info: object) => await addSocialLinks(info)
          : action === ACTIONS.EDIT
          ? async (info: object) => await updateSocialLinks(info)
          : (action === ACTIONS.DELETE || action === ACTIONS.MULTIDELETE) 
          ? async (info: object) => await deleteSocialLinks(info)
          : async (info: object) => await restoreSocialLinks(info),
      onSuccess: (response) => {
        setIsOpenModal(false);
        reset({
            id: '',
            address: '',
            email: '',
            createdBy: user?.info?.id,
            facebook: '',
            viber:'',
            whatsapp:'',
        });
        setSelectedRowKeys([])
        queryClient.invalidateQueries({ queryKey: ['social'] });
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
            if(getValues('address')){
             formData.append('address', getValues('address'));
            }
            if(getValues('email')){
            formData.append('email', getValues('email'));
            }
            if(getValues('facebook')){
            formData.append('facebook', getValues('facebook'));
            }
            if(getValues('viber')){
            formData.append('viber',getValues('viber') );
            }
            if(getValues('whatsapp')){
            formData.append('whatsapp', getValues('whatsapp'));
            }
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
  
        socialMutation.mutate(formData);
      },
      [action]
    );
  
    // Rendered Components
    const renderModalContent = () => (
      <Form layout='vertical' onFinish={handleSubmit(onSubmit)} className="mt-5">
        {(action !== ACTIONS.DELETE && action !== ACTIONS.RESTORE && action !== ACTIONS.MULTIDELETE) ? (
          <>
            <FormItem name="address" control={control}>
              <CustomInput label='Address' />
            </FormItem>
            <FormItem name="email" control={control}>
              <CustomInput label='Email' />
            </FormItem>
            <FormItem name="facebook" control={control}>
              <CustomInput label='Facebook Link:' />
            </FormItem>
            <FormItem name="viber" control={control}>
              <CustomInput label='Viber Link:' />
            </FormItem>
            <FormItem name="whatsapp" control={control}>
              <CustomInput label='WhatsApp Link:' />
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
                  all selected social Links{' '}
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
                  this social Links{' '}
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
              loading={socialLinks?.loading}
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
    const aboutData = socialLinks?.link?.map((data: { id: any; }) => ({
      ...data,
      key:data.id
    }))
  return (
    <div className="">
      <div className="flex items-center justify-between">
        <div className="w-full flex items-center space-x-3">
          <div className="p-3 rounded-full bg-blue-500/20 border border-blue-400">
            <FiLink size={40} className="text-blue-500" />
          </div>
          <div className="flex flex-col">
            <CustomLabel
              variant="text"
              classes="font-semibold text-5xl"
              children="Social Media"
            />
          </div>
        </div>

        <CustomButton
          icon={<PiPlus />}
          size="large"
          children="Add social links"
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
              ? 'Add a Social Links'
              : _.isEqual(action, ACTIONS.EDIT)
              ? 'Edit a Social Links'
              : _.isEqual(action, ACTIONS.DELETE)
              ? 'Delete a Social Links'
              : _.isEqual(action, ACTIONS.MULTIDELETE)
              ? 'Delete  multiple Social Links'
              : 'Restore a Social Links'
          }
          footer={null}
          isOpen={isOpenModal}
          children={renderModalContent()}
        />
      </div>
    </div>
  )
}
