'use client';
import React, {
  type ChangeEvent,
  useCallback,
  useLayoutEffect,
  useState,
} from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Form, Tabs, type TabsProps } from 'antd';
import _ from 'lodash';
import Highlighter from 'react-highlight-words';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { FormItem } from 'react-hook-form-antd';
import { MdDelete } from 'react-icons/md';
import { PiPlus } from 'react-icons/pi';
import { TbCategoryFilled } from 'react-icons/tb';
import { type z } from 'zod';
import {
  CustomButton,
  CustomInput,
  CustomLabel,
  CustomModal,
  CustomSelect,
  CustomTable,
  CustomTag,
  CustomTextArea,
} from '@/components';
import { ACTIONS, STATUS } from '@/config/utils/constants';
import { dateFormatter, useDebounce } from '@/config/utils/util';
import { type ICategoriesDTO } from '@/interfaces/global';
import CategoriesServices from '@/services/categories';
import categoriesValidator from '@/validations/categories';
import useStore from '@/zustand/store/store';
import {
  addCategory,
  deleteCategory,
  fetchCategories,
  restoreCategory,
  selector,
  updateCategory,
} from '@/zustand/store/store.provider';

type TValidationSchema = z.infer<typeof categoriesValidator>;
export default function page() {
  const [filter, setFilter] = useState({
    name: '',
    status: '',
  });
  const [open, setOpen] = useState(false);
  const items: TabsProps['items'] = [
    {
      key: STATUS.AVAILABLE,
      label: 'Available',
    },
    {
      key: STATUS.UNAVAILABLE,
      label: 'Deleted',
    },
  ];
  const user = useStore(selector('user'));
  const brands = useStore(selector('brands'));
  const queryClient = useQueryClient();
  const [action, setAction] = useState<string>(ACTIONS.ADD);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const { handleSubmit, control, reset, setValue, getValues } =
    useForm<TValidationSchema>({
      defaultValues: {
        id: '',
        name: '',
        description: '',
        status: '',
        createdBy: user?.info?.id,
        updatedBy: '',
        brandsId:[]
      },
      resolver: zodResolver(categoriesValidator),
    });

  const categories = useStore(selector('categories'));

  const { data: categoriesData, isLoading } = useQuery({
    queryKey: ['categories', filter],
    queryFn: async () => await CategoriesServices.fetchAll(filter),
  });

  const columns = [
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
      key: 3,
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
        <span key={index}>{!_.isNil(data) ? dateFormatter(data) : 'N/A'}</span>
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

  // Functions
  const onChangeTab = (key: string) => {
    if(key === 'Deleted'){
      setFilter((prevState) => ({
        ...prevState,
        isDeleted: true,
      }));
    }else{
      setFilter((prevState) => ({
        ...prevState,
        status: key,
        isDeleted: false,
      }));
    }
  };

  const onSetFilter = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilter((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }, []);

  useLayoutEffect(() => {
    if (!isLoading) {
      loadCategories(categoriesData?.data?.data);
    }
  }, [isLoading, categoriesData]);
  const loadCategories = async (payload: ICategoriesDTO[]) => {
    fetchCategories(payload);
  };
  const onHandleClose = useCallback(() => {
    setOpen(false);
    reset({
      id: '',
      name: '',
      description: '',
      status: '',
      createdBy: user?.info?.id,
      updatedBy: '',
      brandsId:[]
    });
    setSelectedRowKeys([])
  }, []);

  const showModal = useCallback((act?: string, data?: any) => {
    setAction(act);
    setOpen(true);
    console.log(selectedRowKeys)
    if (act === ACTIONS.EDIT || act === ACTIONS.DELETE || act === ACTIONS.RESTORE || act === ACTIONS.MULTIDELETE) {
      setValue('id', data?.id);
      setValue('name', data?.name, {
        shouldValidate: true,
        shouldDirty: true,
      });
      setValue('description', data?.description, {
        shouldValidate: true,
        shouldDirty: true,
      });
      setValue('brandsId', data?.Brands.map((item: { id: any; }) => item.id));
      setValue('updatedBy', user?.info?.id);
      setValue('status', data?.status);
    }
  }, []);

  const categoryMutation = useMutation({
    mutationFn:
      action === ACTIONS.ADD
        ? async (info: object) => await addCategory(info)
        : action === ACTIONS.EDIT
        ? async (info: object) => await updateCategory(info)
        : (action === ACTIONS.DELETE || action === ACTIONS.MULTIDELETE) 
        ? async (info: object) => await deleteCategory(info)
        : async (info: object) => restoreCategory(info),
    onSuccess: (response) => {
      setOpen(false);
      reset({
        id: '',
        name: '',
        description: '',
        status: '',
        createdBy: user?.info?.id,
        updatedBy: '',
      });
      setSelectedRowKeys([])
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const onSubmit: SubmitHandler<TValidationSchema> = useCallback(
    (data) => {
     
      const formData = new FormData();
      if (action === ACTIONS.ADD) {
        formData.append('name',data?.name)
        formData.append('description',data?.description)
        formData.append('createdBy',user?.info?.id)
        data?.brandsId.map(item => formData.append('brandIds[]',item))
        delete data?.updatedBy
        delete data?.id
      }else if (action === ACTIONS.EDIT) {
        formData.append('name',data?.name)
        formData.append('description',data?.description)
        formData.append('id', data?.id);
        formData.append('updatedBy', user?.info?.id);
        data?.brandsId.map(item => formData.append('brandIds[]',item));
        delete data?.createdBy
        
      }else if(action === ACTIONS.DELETE || action === ACTIONS.RESTORE){
        formData.append('updatedBy', data?.updatedBy);
        formData.append('ids[]',data?.id)
      }else if(action === ACTIONS.MULTIDELETE){
        formData.append('updatedBy', user?.info?.id);
        selectedRowKeys.map(item =>formData.append('ids[]',item))
      }
      categoryMutation.mutate(formData);
    },
    [action],
  );

  // Rendered Components
  const renderModalContent = () => (
    <Form onFinish={handleSubmit(onSubmit)} className="mt-5">
      {(action !== ACTIONS.DELETE && action !== ACTIONS.RESTORE && action !== ACTIONS.MULTIDELETE) ? (
        <>
          <FormItem name="name" control={control}>
            <CustomInput
              size="large"
              label="Category Name"
              placeholder="Ex. Gadgets"
              type="text"
            />
          </FormItem>
          <FormItem name="brandsId" control={control}>
            <CustomSelect
              label="Available brands"
              value={brands?.items}
              className="w-full"
              allowClear
              items={brands?.items}
              renderText="name"
              renderValue="id"
              renderKey="id"
              mode='multiple'
              // onChange={onSelectPositions}
              // status={
              //   formik.touched.position && Boolean(formik.errors.position)
              //     ? 'error'
              //     : null
              // }
              placeholder="Select Brand"
              // errorText={formik.touched.position && formik.errors.position}
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
                all selected categories{' '}
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
                {getValues('status') === STATUS.AVAILABLE
                  ? 'delete'
                  : 'restore'}{' '}
                this category{' '}
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
            loading={categories?.loading}
            type="primary"
            danger={
              action === ACTIONS.DELETE &&
              getValues('status') === STATUS.AVAILABLE
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
    console.log(selectedRows)
    setSelectedRowKeys(selectedRows);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    getCheckboxProps: (record: any) => ({
      disabled: record.isDeleted === true, 
    }),
  };
  const categoryData = categories?.items?.map(data => ({
    ...data,
    key:data.id
  }))
 
  console.log(getValues())
  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="w-full flex items-center space-x-3">
          <div className="p-3 rounded-full bg-blue-500/20 border border-blue-400">
            <TbCategoryFilled size={40} className="text-blue-500" />
          </div>
          <div className="flex flex-col">
            <CustomLabel
              variant="text"
              classes="font-semibold text-5xl"
              children="Categories"
            />
            <CustomLabel
              variant="text"
              classes="text-base text-gray-400"
              children="This section allows you to view, add, edit, and delete a certain category"
            />
          </div>
        </div>

        <CustomButton
          icon={<PiPlus />}
          size="large"
          children="Add Category"
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
        <div className="text-right w-full">
          <CustomInput
            placeholder="Search brand name"
            size="large"
            classes="w-1/4"
            name="name"
            onChange={useDebounce(onSetFilter)}
          />
        </div>

        </div>
        <CustomTable
          columns={columns}
          loading={isLoading}
          datasource={!isLoading ? categoryData : []}
          rowSelection={rowSelection}
        />
      </div>
      <CustomModal
        onCancel={onHandleClose}
        title={
          _.isEqual(action, ACTIONS.ADD)
            ? 'Add a category'
            : _.isEqual(action, ACTIONS.EDIT)
            ? 'Edit a category'
            : _.isEqual(action, ACTIONS.DELETE)
            ? 'Delete a category'
            : _.isEqual(action, ACTIONS.MULTIDELETE)
            ? 'Delete  multiple categories'
            : 'Restore a category'
        }
        footer={null}
        isOpen={open}
        children={renderModalContent()}
      />
    </div>
  );
}
