'use client';
import React, { useCallback, useState, useLayoutEffect } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Form, Image } from 'antd';
import { type RcFile } from 'antd/es/upload';
import _ from 'lodash';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { FormItem } from 'react-hook-form-antd';
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
import { ACTIONS, STATUS } from '@/config/utils/constants';
import { dateFormatter } from '@/config/utils/util';
import { type IBrandDTO } from '@/interfaces/global';
import { BrandServices } from '@/services';
import brandValidator from '@/validations/brand';
import useStore from '@/zustand/store/store';
import {
  loadBrands,
  selector,
  addBrand,
  updateBrand,
  deleteBrand,
} from '@/zustand/store/store.provider';

type ValidationSchema = z.infer<typeof brandValidator>;
export default function page() {
  // Initialization
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const user = useStore(selector('user'));
  const [changeLogo, setChangeLogo] = useState<boolean>(false);
  const { handleSubmit, control, reset, setValue, getValues } =
    useForm<ValidationSchema>({
      defaultValues: {
        id: '',
        name: '',
        description: '',
        status: '',
        logo: [],
        createdBy: user?.info?.id,
        updatedBy: '',
      },
      resolver: zodResolver(brandValidator),
    });

  const brands = useStore(selector('brands'));

  const [action, setAction] = useState<string>(ACTIONS.ADD);
  const columns = [
    {
      key: 0,
      dataIndex: 'name',
      title: 'Name',
    },
    {
      key: 1,
      dataIndex: 'description',
      title: 'Description',
    },
    {
      key: 2,
      dataIndex: 'logo',
      title: 'Logo',
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
      key: 3,
      dataIndex: 'status',
      title: 'Status',
      render: (data: string, index: number) => (
        <CustomTag
          key={index}
          children={data}
          color={data === STATUS.ACTIVE ? 'green' : 'error'}
        />
      ),
    },
    {
      key: 4,
      dataIndex: 'createdByUser',
      title: 'Added By',
      render: (data: any, index: number) => (
        <span key={index}>{data?.username ?? 'N/A'}</span>
      ),
    },
    {
      key: 5,
      dataIndex: 'updatedByUser',
      title: 'Updated By',
      render: (data: any, index: number) => (
        <span key={index}>{data?.username ?? 'N/A'}</span>
      ),
    },
    {
      key: 6,
      dataIndex: 'createdAt',
      title: 'Date Added',
      render: (data: any, index: number) => (
        <span key={index}>{dateFormatter(data)}</span>
      ),
    },
    {
      key: 7,
      dataIndex: 'updatedAt',
      title: 'Date Modified',
      render: (data: any, index: number) => (
        <span key={index}>{dateFormatter(data)}</span>
      ),
    },
    {
      key: 8,
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
            children={data?.status === STATUS.ACTIVE ? 'Delete' : 'Restore'}
            danger={data?.status === STATUS.ACTIVE}
            onClick={() => showModal(ACTIONS.DELETE, data)}
          />
        </div>
      ),
    },
  ];

  const { data: brandsData, isLoading } = useQuery({
    queryKey: ['brands'],
    queryFn: async () => await BrandServices.fetchAll(),
  });

  useLayoutEffect(() => {
    if (!isLoading) {
      fetchBrands(brandsData?.data?.data);
    }
  }, [isLoading]);
  const fetchBrands = async (payload: IBrandDTO[]) => {
    loadBrands(payload);
  };

  const showModal = useCallback(
    (act: string, data?: any) => {
      setIsOpenModal(true);
      setAction(act);
      if (act === ACTIONS.EDIT || act === ACTIONS.DELETE) {
        console.log(data?.logo);
        setValue('id', data?.id);
        setValue('name', data?.name, {
          shouldValidate: true,
          shouldDirty: true,
        });
        setValue('description', data?.description, {
          shouldValidate: true,
          shouldDirty: true,
        });
        setValue('logo', data?.logo);
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
      name: '',
      description: '',
      status: '',
      logo: [],
      createdBy: user?.info?.id,
      updatedBy: '',
    });
  }, []);

  const beforeUpload = (file: RcFile) => {
    return false;
  };

  const brandMutation = useMutation({
    mutationFn:
      action === ACTIONS.ADD
        ? async (info: object) => addBrand(info)
        : action === ACTIONS.EDIT
        ? async (info: object) => updateBrand(info)
        : async (info: object) => deleteBrand(info),
    onSuccess: (response) => {
      setIsOpenModal(false);
      reset({
        id: '',
        name: '',
        description: '',
        status: '',
        logo: [],
        createdBy: user?.info?.id,
        updatedBy: '',
      });
    },
    onError: (error) => {
      console.log(error);
    },
  });
  const onSubmit: SubmitHandler<ValidationSchema> = useCallback(
    (data) => {
      console.log('data: ', data);
      console.log(action);
      const formData = new FormData();
      formData.append('name', data?.name);
      formData.append('description', data?.description);
      if (typeof data?.logo !== 'string' && 'fileList' in data?.logo) {
        formData.append('file', data?.logo?.fileList[0]?.originFileObj);
      }

      if (action === ACTIONS.ADD) {
        formData.append('createdBy', data?.createdBy);
      } else if (action === ACTIONS.EDIT || action === ACTIONS.DELETE) {
        formData.append('id', data?.id);
        formData.append('updatedBy', data?.updatedBy);
      }

      brandMutation.mutate(formData);
    },
    [action],
  );

  // Rendered Components
  const renderModalContent = () => (
    <Form onFinish={handleSubmit(onSubmit)} className="mt-5">
      {action !== ACTIONS.DELETE ? (
        <>
          <FormItem name="logo" control={control}>
            {typeof getValues('logo') === 'string' &&
            action === ACTIONS.EDIT ? (
              changeLogo ? (
                <CustomUploader
                  name="logo"
                  beforeUpload={(file) => beforeUpload(file)}
                  label="Brand Logo (optional)"
                  fileList={getValues('logo')?.fileList}
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
                    children="Brand Logo (optional)"
                    variant="text"
                    classes="font-semibold mb-2"
                  />
                  <Image
                    src={process.env.BASE_IMAGE_URL + getValues('logo')}
                    width={100}
                    height={100}
                    className="rounded-full border border-blue-500"
                  />
                  <CustomButton
                    type="link"
                    children="Change Logo"
                    classes="w-12"
                    block={false}
                    onClick={() => setChangeLogo(true)}
                  />
                </div>
              )
            ) : (
              <CustomUploader
                name="logo"
                beforeUpload={(file) => beforeUpload(file)}
                label="Brand Logo (optional)"
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
          <FormItem name="name" control={control}>
            <CustomInput
              size="large"
              label="Brand Name"
              placeholder="Type brand name"
              type="text"
            />
          </FormItem>
          <FormItem name="description" control={control}>
            <CustomTextArea
              size="large"
              placeholder="Some description here"
              label="Description (optional)"
              type="text"
              classes="resize-none"
            />
          </FormItem>
        </>
      ) : (
        <div>
          <CustomLabel
            variant="text"
            children={
              <span>
                {' '}
                Are you sure? Do you really want to{' '}
                {getValues('status') === STATUS.ACTIVE
                  ? 'delete'
                  : 'restore'}{' '}
                this brand{' '}
                <span className="font-semibold">{getValues('name')}</span>
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
            loading={brands?.loading}
            type="primary"
            danger={
              action === ACTIONS.DELETE && getValues('status') === STATUS.ACTIVE
            }
            children={
              action === ACTIONS.ADD
                ? 'Submit'
                : action === ACTIONS.EDIT
                ? 'Save Changes'
                : getValues('status') === STATUS.ACTIVE
                ? 'Delete'
                : 'Restore'
            }
          />
        </div>
      </Form.Item>
    </Form>
  );

  return (
    <div className="">
      <div className="flex items-center justify-between">
        <div className="w-full flex items-center space-x-3">
          <div className="p-3 rounded-full bg-gray-500/20 border border-gray-400">
            <TbBrandFramerMotion size={40} />
          </div>
          <div className="flex flex-col">
            <CustomLabel
              variant="text"
              classes="font-semibold text-5xl"
              children="Brands"
            />
            <CustomLabel
              variant="text"
              classes="text-base text-gray-400"
              children="This section allows you to view, add, edit, and delete a certain brand"
            />
          </div>
        </div>

        <CustomButton
          icon={<PiPlus />}
          size="large"
          children="Add Brand"
          onClick={() => showModal(ACTIONS.ADD)}
        />
      </div>

      <div className="mt-20 space-y-5">
        <div className="text-right w-full">
          <CustomInput
            placeholder="Search brand name"
            size="large"
            classes="w-1/4"
          />
        </div>
        <CustomTable
          columns={columns}
          loading={isLoading}
          datasource={!isLoading ? brands?.items : []}
        />
      </div>

      <div>
        <CustomModal
          onCancel={onHandleClose}
          title={
            _.isEqual(action, ACTIONS.ADD)
              ? 'Add a brand'
              : _.isEqual(action, ACTIONS.EDIT)
              ? 'Edit a brand'
              : getValues('status') === STATUS.ACTIVE
              ? 'Delete a brand'
              : 'Restore a brand'
          }
          // okText={
          //   action === ACTIONS.ADD
          //     ? 'Submit'
          //     : action === ACTIONS.EDIT
          //     ? 'Save Changes'
          //     : 'Delete'
          // }
          // onOk={() => console.log('ddf')}
          // okButtonProps={{ htmlType: 'submit' }}
          footer={null}
          // okType={action === ACTIONS.DELETE ? 'danger' : 'link'}
          isOpen={isOpenModal}
          children={renderModalContent()}
        />
      </div>
    </div>
  );
}
