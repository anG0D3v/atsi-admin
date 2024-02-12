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
import { Form, Image, Tabs, type TabsProps, type TableColumnsType  } from 'antd';
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
import { ACTIONS, STATUS } from '@/config/utils/constants';
import { dateFormatter, useDebounce } from '@/config/utils/util';
import { type IBrandDTO } from '@/interfaces/global';
import { BrandServices, CategoryServices } from '@/services';
import brandValidator from '@/validations/brand';
import useStore from '@/zustand/store/store';
import {
  loadBrands,
  selector,
  addBrand,
  updateBrand,
  deleteBrand,
  fetchCategories,
  restoreBrand,
} from '@/zustand/store/store.provider';

type ValidationSchema = z.infer<typeof brandValidator>;
export default function page() {
  // Initialization
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [filter, setFilter] = useState({
    name: '',
    status: '',
  });

  const items: TabsProps['items'] = [
    {
      key: '',
      label: 'All',
    },
    {
      key: STATUS.ACTIVE,
      label: 'Active',
    },
    {
      key: STATUS.INACTIVE,
      label: 'Inactive',
    },
  ];
  const user = useStore(selector('user'));
  const queryClient = useQueryClient();
  const [changeLogo, setChangeLogo] = useState<boolean>(false);
  const { handleSubmit, control, reset, setValue, getValues} =
    useForm<ValidationSchema>({
      defaultValues: {
        id: '',
        name: '',
        description: '',
        status: '',
        logo: [],
        createdBy: user?.info?.id,
        updatedBy: ''
      },
      resolver: zodResolver(brandValidator),
    });

  const brands = useStore(selector('brands'));

  const [action, setAction] = useState<string>(ACTIONS.ADD);
  const columns: TableColumnsType = [
    {
      key: 0,
      dataIndex: 'name',
      title: 'Name',
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
      dataIndex: 'updatedByUser',
      title: 'Updated By',
      render: (data: any, index: number) => (
        <span key={index}>{data?.username ?? 'N/A'}</span>
      ),
    },
    {
      key: 5,
      dataIndex: 'createdAt',
      title: 'Date Added',
      render: (data: any, index: number) => (
        <span key={index}>{dateFormatter(data)}</span>
      ),
    },
    {
      key: 6,
      dataIndex: 'updatedAt',
      title: 'Date Modified',
      render: (data: any, index: number) => (
        <span key={index}>{!_.isNil(data) ? dateFormatter(data) : 'N/A'}</span>
      ),
    },
    {
      key: 7,
      dataIndex: 'Categories',
      title: 'No. of Categories',
      render: (data: any, index: number) => (
        <span key={index}>{data?.length || 0}</span>
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
            children={!data?.isDeleted ? 'Delete' : 'Restore'}
            danger={!data?.isDeleted}
            onClick={() => showModal(!data?.isDeleted ? ACTIONS.DELETE : ACTIONS.RESTORE, data)}
          />
        </div>
      ),
    },
  ];

  const { data: brandsData, isLoading:isLoading1 } = useQuery({
    queryKey: ['brands', filter],
    queryFn: async () => await BrandServices.fetchAll(filter),
  });
  const { data: categoryData, isLoading: isLoading2 } = useQuery({
    queryKey: ['category'],
    queryFn: async () => await CategoryServices.fetchAll(),
  });
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  useLayoutEffect(() => {
    if (!isLoading1) {
      fetchBrands(brandsData?.data?.data);
      fetchCategories(categoryData?.data?.data)
    }
  }, [isLoading1, brandsData,isLoading1,isLoading2]);
  const fetchBrands = async (payload: IBrandDTO[]) => {
    loadBrands(payload);
  };

  const showModal = useCallback(
    (act: string, data?: any) => {
      setIsOpenModal(true);
      setAction(act);
      if (act === ACTIONS.EDIT || act === ACTIONS.DELETE || act === ACTIONS.RESTORE) {
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

  const onChangeTab = (key: string) => {
    setFilter((prevState) => ({
      ...prevState,
      status: key,
    }));
  };

  const beforeUpload = (file: RcFile) => {
    return false;
  };

  const brandMutation = useMutation({
    mutationFn:
      action === ACTIONS.ADD
        ? async (info: object) => addBrand(info)
        : action === ACTIONS.EDIT
        ? async (info: object) => updateBrand(info)
        : (action === ACTIONS.DELETE || action === ACTIONS.MULTIDELETE) 
        ? async (info: object) => deleteBrand(info)
        : async (info: object) => restoreBrand(info),
    onSuccess: (response) => {
      setIsOpenModal(false);
      reset({
        id: '',
        name: '',
        description: '',
        status: '',
        logo: [],
        createdBy: user?.info?.id,
        updatedBy: ''
      });
      setSelectedRowKeys([])
      queryClient.invalidateQueries({ queryKey: ['brands'] });
    },
    onError: (error) => {
      console.log(error);
    },
  });
  const onSubmit: SubmitHandler<ValidationSchema> = useCallback(
    (data) => {
      console.log('submitting', data); 
      const formData = new FormData();
      if(action !== ACTIONS.DELETE && action !== ACTIONS.RESTORE && action !== ACTIONS.MULTIDELETE) {
        formData.append('name', data?.name);
        formData.append('description', data?.description);
      }
      
      if (
        typeof data?.logo !== 'string' &&
        !_.isNil(data?.logo) &&
        'fileList' in data?.logo
      ) {
        formData.append('file', data?.logo?.fileList[0]?.originFileObj);
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

      brandMutation.mutate(formData);
    },
    [action]
  );

  // Rendered Components
  const renderModalContent = () => (
    <Form onFinish={handleSubmit(onSubmit)} className="mt-5">
      {(action !== ACTIONS.DELETE && action !== ACTIONS.RESTORE && action !== ACTIONS.MULTIDELETE) ? (
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
      ) : action === ACTIONS.MULTIDELETE ? (
        <div>
          <CustomLabel
            variant="text"
            children={
              <span>
                {' '}
                Are you sure? Do you really want to{' '}
                delete{' '}
                all selected brands{' '}
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
    onChange: onSelectChange
  };
  const brandData = brands?.items?.map((data: { id: any; }) => ({
    ...data,
    key:data.id
  }))

  console.log(selectedRowKeys)

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
      <div className="mt-14 w-full space-y-5">
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
          loading={isLoading1}
          rowSelection={rowSelection}
          datasource={!isLoading1 ? brandData : []}
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
              : 'Delete selected brands'
          }
          footer={null}
          isOpen={isOpenModal}
          children={renderModalContent()}
        />
      </div>
    </div>
  );
}
