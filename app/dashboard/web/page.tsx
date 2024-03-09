'use client';
import React, {
  useCallback,
  useState,
  useLayoutEffect,
  type ChangeEvent,
} from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery,useQueryClient } from '@tanstack/react-query';
import { Form, Image, type TableColumnsType  } from 'antd';
import { type RcFile } from 'antd/es/upload';
import _ from 'lodash';
import Highlighter from 'react-highlight-words';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { FormItem } from 'react-hook-form-antd';
import { MdDelete } from 'react-icons/md';
import { PiPlus } from 'react-icons/pi';
import { TbBrandFramerMotion } from 'react-icons/tb';
import { type z } from 'zod';
import {
  CustomButton,
  CustomInput,
  CustomLabel,
  CustomModal,
  CustomNextImage,
  CustomTable,
  CustomTag,
  CustomTextArea,
  CustomUploader,
} from '@/components';
import { ACTIONS } from '@/config/utils/constants';
import { useDebounce } from '@/config/utils/util';
import { type IWebDTO } from '@/interfaces/global';
import WebServices from '@/services/web';
import brandValidator from '@/validations/brand';
import type webValidator from '@/validations/Web';
import useStore from '@/zustand/store/store';
import {
  fetchBlogs,
  selector,
  addBlogs,
  updateBlogs,
  deleteBlogs,
  restoreBlogs,
} from '@/zustand/store/store.provider';

type ValidationSchema = z.infer<typeof webValidator>;
export default function page() {
  // Initialization
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [filter, setFilter] = useState({
    name: '',
    status: '',
  });

  const user = useStore(selector('user'));
  const queryClient = useQueryClient();
  const [changeLogo, setChangeLogo] = useState<boolean>(false);
  const { handleSubmit, control, reset, setValue, getValues} =
    useForm<ValidationSchema>({
      defaultValues: {
        id: '',
        title: '',
        content: '',
        status: '',
        file: [],
        createdBy: user?.info?.id,
        updatedBy: ''
      },
      resolver: zodResolver(brandValidator),
    });

  const blogs = useStore(selector('Blogs'));

  const [action, setAction] = useState<string>(ACTIONS.ADD);
  const columns: TableColumnsType = [
    {
      key: 0,
      dataIndex: 'title',
      title: 'Title',
      render: (data: string, index: number) => (
        <Highlighter
          searchWords={[filter?.name]}
          autoEscape={true}
          key={index}
          textToHighlight={data}
        />
      ),
    },
    {
      key: 1,
      dataIndex: 'imageUrl',
      title: 'Image',
      render: (data: string, index: number) =>
        data ? (
          <Image
            loading="eager"
            key={index}
            width={100}
            height="auto"
            src={process.env.BASE_IMAGE_URL + data}
            alt={data}
          />
        ) : (
          <CustomNextImage
            url="/assets/no-image.jpg"
            width={100}
            height={100}
          />
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
      dataIndex: 'createdByUser',
      title: 'Added By',
      render: (data: any, index: number) => (
        <span key={index}>{data?.username ?? 'N/A'}</span>
      ),
    },
    {
      key: 4,
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

  const { data: blogsData, isLoading } = useQuery({
    queryKey: ['blogs', filter],
    queryFn: async () => await WebServices.fetchAll(filter),
  });
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  useLayoutEffect(() => {
    if (!isLoading) {
        fetchBlogsData(blogsData?.data?.data);
    }
  }, [ blogsData,isLoading]);
  const fetchBlogsData = async (payload: IWebDTO[]) => {
    fetchBlogs(payload);
  };

  const showModal = useCallback(
    (act: string, data?: any) => {
      setIsOpenModal(true);
      console.log(data)
      setAction(act);
      if (act === ACTIONS.EDIT || act === ACTIONS.DELETE || act === ACTIONS.RESTORE) {
        setValue('id', data?.id);
        setValue('title', data?.title, {
          shouldValidate: true,
          shouldDirty: true,
        });
        setValue('content', data?.content, {
          shouldValidate: true,
          shouldDirty: true,
        });
        setValue('file', data?.imageUrl);
        setValue('updatedBy', user?.info?.id);
        setValue('status', data?.status);
      }
    },
    [setValue],
  );
  const onHandleClose = useCallback(() => {
    setIsOpenModal(false);
    setChangeLogo(false);
    reset({
      id: '',
      title: '',
      content: '',
      status: '',
      file: [],
      createdBy: user?.info?.id,
      updatedBy: ''
    });
    setSelectedRowKeys([])
  }, []);

  const onSetFilter = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilter((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }, []);


  const beforeUpload = (file: RcFile) => {
    return false;
  };

  const blogMutation = useMutation({
    mutationFn:
      action === ACTIONS.ADD
        ? async (info: object) => await addBlogs(info)
        : action === ACTIONS.EDIT
        ? async (info: object) => await updateBlogs(info)
        : (action === ACTIONS.DELETE || action === ACTIONS.MULTIDELETE) 
        ? async (info: object) => await deleteBlogs(info)
        : async (info: object) => await restoreBlogs(info),
    onSuccess: (response) => {
      setIsOpenModal(false);
      reset({
        id: '',
        title: '',
        content: '',
        status: '',
        file: [],
        createdBy: user?.info?.id,
        updatedBy: ''
      });
      setSelectedRowKeys([])
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
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
        formData.append('title', getValues('title'));
        formData.append('content', getValues('content'));
      }
      
      if (
        typeof getValues('file') !== 'string' &&
        !_.isNil(getValues('file')) &&
        'fileList' in getValues('file')
      ) {
        formData.append('file', getValues('file').fileList[0]?.originFileObj);
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

      blogMutation.mutate(formData);
    },
    [action]
  );

  // Rendered Components
  const renderModalContent = () => (
    <Form onFinish={handleSubmit(onSubmit)} className="mt-5">
      {(action !== ACTIONS.DELETE && action !== ACTIONS.RESTORE && action !== ACTIONS.MULTIDELETE) ? (
        <>
          <FormItem name="file" control={control}>
            {typeof getValues('file') === 'string' &&
            action === ACTIONS.EDIT ? (
              changeLogo ? (
                <CustomUploader
                  name="logo"
                  beforeUpload={(file) => beforeUpload(file)}
                  label="Blog Image (optional)"
                  fileList={getValues('file')?.fileList}
                  maxCount={1}
                  listType="picture-circle"
                >
                  <div className="flex flex-col items-center justify-center">
                    <PlusOutlined />
                    <CustomLabel variant="text" children="Upload" />
                  </div>
                </CustomUploader>
              ) : (
                <div className="flex flex-col justify-start">
                  <CustomLabel
                    children="Blog Image (optional)"
                    variant="text"
                    classes="font-semibold mb-2"
                  />
                  <Image
                    src={process.env.BASE_IMAGE_URL + getValues('file')}
                    width={100}
                    height={100}
                    className="rounded-full border border-blue-500"
                  />
                  <CustomButton
                    type="link"
                    children="Change Image"
                    classes="w-12"
                    block={false}
                    onClick={() => setChangeLogo(true)}
                  />
                </div>
              )
            ) : (
              <CustomUploader
                name="file"
                beforeUpload={(file) => beforeUpload(file)}
                label="Blog Image (optional)"
                maxCount={1}
                listType="picture-circle"
              >
                <div className="flex flex-col items-center justify-center">
                  <PlusOutlined />
                  <CustomLabel variant="text" children="Upload" />
                </div>
              </CustomUploader>
            )}
          </FormItem>
          <FormItem name="title" control={control}>
            <CustomInput
              size="large"
              label="Title"
              placeholder="Type blog title"
              type="text"
            />
          </FormItem>
          <FormItem name="content" control={control}>
            <CustomTextArea
              size="large"
              placeholder="Some content here"
              label="Content (optional)"
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
                this blog{' '}
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
            loading={blogs?.loading}
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
  const blogData = blogs?.blogs?.map((data: { id: any; }) => ({
    ...data,
    key:data.id
  }))

  console.log(blogs)

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
              children="Blogs"
            />
            <CustomLabel
              variant="text"
              classes="text-base text-gray-400"
              children="This section allows you to view, add, edit, and delete a certain blogs"
            />
          </div>
        </div>

        <CustomButton
          icon={<PiPlus />}
          size="large"
          children="Add Blogs"
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
          <div className='w-full flex justify-end text-right'>
          <CustomInput
            placeholder="Search blog"
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
          rowSelection={rowSelection}
          datasource={!isLoading ? blogData : []}
        />
      </div>

      <div>
        <CustomModal
          onCancel={onHandleClose}
          title={
            _.isEqual(action, ACTIONS.ADD)
              ? 'Add a blog'
              : _.isEqual(action, ACTIONS.EDIT)
              ? 'Edit a blog'
              : _.isEqual(action, ACTIONS.DELETE)
              ? 'Delete a blog'
              : _.isEqual(action, ACTIONS.MULTIDELETE)
              ? 'Delete  multiple blogs'
              : 'Restore a blog'
          }
          footer={null}
          isOpen={isOpenModal}
          children={renderModalContent()}
        />
      </div>
    </div>
  );
}
