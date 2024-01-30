'use client';
import React, {
  type ChangeEvent,
  useCallback,
  useState,
  useLayoutEffect,
} from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Tabs, type TabsProps, Form, Checkbox } from 'antd';
import { type RcFile } from 'antd/es/upload';
import _ from 'lodash';
import Highlighter from 'react-highlight-words';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { FormItem } from 'react-hook-form-antd';
import { BsFillBoxSeamFill } from 'react-icons/bs';
import { PiPlus } from 'react-icons/pi';
import { type z } from 'zod';
import {
  CustomButton,
  CustomInput,
  CustomLabel,
  CustomModal,
  CustomSelect,
  CustomTable,
  CustomTextEditor,
  CustomUploader,
} from '@/components';
import { ACTIONS, STATUS } from '@/config/utils/constants';
import {
  currencyFormat,
  dateFormatter,
  useDebounce,
} from '@/config/utils/util';
import { type IProductsDTO } from '@/interfaces/global';
import { ProductsService } from '@/services';
import productValidator from '@/validations/product';
import useStore from '@/zustand/store/store';
import {
  addProduct,
  loadProducts,
  selector,
  updateProduct
} from '@/zustand/store/store.provider';

type ValidationSchema = z.infer<typeof productValidator>;
export default function page() {
  // Initialization
  const user = useStore(selector('user'));
  const brands = useStore(selector('brands'));
  const categories = useStore(selector('categories'));
  const products = useStore(selector('products'));

  const { handleSubmit, control, getValues, reset,setValue } = useForm<ValidationSchema>(
    {
      defaultValues: {
        id: '',
        name: '',
        description: '',
        status: '',
        createdBy: user?.info?.id,
        updatedBy: '',
        stock: 0,
        brandId: '',
        categoryId: '',
        lazadaLink: '',
        shoppeeLink: '',
        discount: 0,
        price: 0,
        isSaleProduct: false,
        images: [],
      },
      resolver: zodResolver(productValidator),
    },
  );
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [action, setAction] = useState(null);
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
      key: STATUS.AVAILABLE,
      label: 'Available',
    },
    {
      key: STATUS.UNAVAILABLE,
      label: 'Unavailable',
    },
    {
      key: STATUS.OUT_OF_STOCK,
      label: 'Out of Stock',
    },
  ];
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
      key: 1,
      dataIndex: 'description',
      title: 'Description',
      render: (data: any, index: number) => (
        <div dangerouslySetInnerHTML={{ __html: data }}></div>
      ),
    },
    {
      key: 2,
      dataIndex: 'price',
      title: 'Price',
      render: (data: any, index: number) => (
        <span key={index}>{currencyFormat(data)}</span>
      ),
    },
    {
      key: 3,
      dataIndex: 'discount',
      title: 'Discount',
      render: (data: any, index: number) => (
        <span key={index}>{data ? `${data}%` : 'No discount'}</span>
      ),
    },
    {
      key: 4,
      dataIndex: 'discountedPrice',
      title: 'Discounted Price',
      render: (data: any, index: number) => (
        <span key={index}>{currencyFormat(data)}</span>
      ),
    },
    {
      key: 5,
      dataIndex: 'status',
      title: 'Status',
    },
    {
      key: 6,
      dataIndex: 'brand',
      title: 'Brand',
      render: (data: any, index: number) => (
        <span key={index}>{data?.name}</span>
      ),
    },
    {
      key: 7,
      dataIndex: 'category',
      title: 'Category',
      render: (data: any, index: number) => (
        <span key={index}>{data?.name}</span>
      ),
    },
    {
      key: 8,
      dataIndex: 'stock',
      title: 'Stock',
    },
    {
      key: 9,
      dataIndex: 'createdByUser',
      title: 'Added By',
      render: (data: any, index: number) => (
        <span key={index}>{data?.username ?? 'N/A'}</span>
      ),
    },
    {
      key: 10,
      dataIndex: 'createdAt',
      title: 'Date Added',
      render: (data: any, index: number) => (
        <span key={index}>{dateFormatter(data)}</span>
      ),
    },
    {
      key: 11,
      title: 'Action',
      render: (data: any, index: number) => (
        <div className="flex flex-row items-center gap-2 w-full" key={index}>
          <CustomButton
            type="primary"
            children="Edit"
            onClick={() => showModal(ACTIONS.EDIT,data)}
          />
        </div>
      ),
    },
  ];

  const { data: productsData, isLoading } = useQuery({
    queryKey: ['products', filter],
    queryFn: async () => await ProductsService.fetchAll(filter),
  });

  const productMutation = useMutation({
    mutationFn:
      action === ACTIONS.ADD
        ? async (info: object) => addProduct(info)
        : action === ACTIONS.EDIT
        ? async (info: object) => updateProduct(info)
        : null,
    onSuccess: (response) => {
      setIsOpenModal(false);
      reset({
        id: '',
        name: '',
        description: '',
        status: '',
        createdBy: user?.info?.id,
        updatedBy: '',
        stock: 0,
        brandId: '',
        categoryId: '',
        lazadaLink: '',
        shoppeeLink: '',
        discount: 0,
        price: 0,
        isSaleProduct: false,
        images: [],
      });
    },
    onError: (error) => {
      console.log(error);
    },
  });

  useLayoutEffect(() => {
    if (!isLoading) {
      fetchProducts(productsData?.data?.data);
    }
  }, [isLoading, productsData]);
  const fetchProducts = async (payload: IProductsDTO[]) => {
    loadProducts(payload);
  };

  // Functions
  const showModal = useCallback((act: string,data?: any) => {
    setAction(act);
    setIsOpenModal(true);
    if(act === ACTIONS.EDIT){
      setValue('id',data?.id)
      setValue('name',data?.name)
      setValue('description',data?.description)
      setValue('status',data?.status)
      setValue('createdBy',data?.createdBy)
      setValue('updatedBy',user?.info?.id)
      setValue('stock',data?.stock)
      setValue('brandId',data?.brandId)
      setValue('categoryId',data?.categoryId)
      setValue('lazadaLink',data?.lazadaLink ? data.lazadaLink : '')
      setValue('shoppeeLink',data?.shoppeeLink ? data.shoppeeLink : '')
      setValue('discount',data?.discount ? data?.discount : 0)
      setValue('price',data?.price)
      setValue('isSaleProduct',data?.isSaleProduct)
      setValue('images',data?.media)
    }
  }, []);

  const onChangeTab = (key: string) => {
    setFilter((prevState) => ({
      ...prevState,
      status: key,
    }));
  };

  const onSetFilter = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilter((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }, []);

  const onHandleClose = useCallback(() => {
    setIsOpenModal(false);
    reset({
      id: '',
      name: '',
      description: '',
      status: '',
      createdBy: user?.info?.id,
      updatedBy: '',
      stock: 0,
      brandId: '',
      categoryId: '',
      lazadaLink: '',
      shoppeeLink: '',
      discount: 0,
      price: 0,
      isSaleProduct: false,
      images: [],
    });
  }, []);

  const onSubmit: SubmitHandler<ValidationSchema> = useCallback((data) => {
    const formData = new FormData();
    const images = getValues('images');
    if (action === ACTIONS.ADD) {
      formData.append('createdBy', data?.createdBy);
    } else if (action === ACTIONS.EDIT || action === ACTIONS.DELETE) {
      formData.append('id', data?.id);
      formData.append('updatedBy', data?.updatedBy);
    }
    formData.append('name', getValues('name'));
    formData.append('description', getValues('description'));
    formData.append('price', getValues('price').toString());
    formData.append('categoryId', getValues('categoryId'));
    formData.append('brandId', getValues('brandId'));
    formData.append('stock', getValues('stock').toString());
    formData.append('shoppeeLink', getValues('shoppeeLink'));
    formData.append('lazadaLink', getValues('lazadaLink'));
    formData.append('isSaleProduct', getValues('isSaleProduct').toString());
    // eslint-disable-next-line array-callback-return
    images?.fileList?.map((file: { originFileObj: string | Blob; }) => {
      formData.append('file', file?.originFileObj)
    })
  
    productMutation.mutateAsync(formData);
  }, [action, getValues, productMutation, setAction]);

  const beforeUpload = (file: RcFile) => {
    console.log(file)
    return false;
  };

  // Rendered Components
  const renderModalContent = () => (
    <Form onFinish={handleSubmit(onSubmit)} className="mt-5"> 
      <FormItem name="images" control={control}>
        <CustomUploader
          name="images"
          beforeUpload={(file) => beforeUpload(file)}
          label="Product Images (optional)"
          multiple
          maxCount={5}
          listType="picture-card"
        >
          <div className="flex flex-col items-center justify-center">
            <PlusOutlined />
            <CustomLabel variant="text" children={action === ACTIONS.EDIT ? 'Add Images' : 'Upload'} />
          </div>
        </CustomUploader>
      </FormItem>
      <FormItem name="name" control={control}>
        <CustomInput
          size="large"
          label="Product Name"
          placeholder="Ex. TKL Keyboard"
          type="text"
        />
      </FormItem>
      <FormItem name="description" control={control}>
        <CustomTextEditor label="Description" classes="rounded-md" />
      </FormItem>
      <div className="flex space-x-2">
        <div className="flex-1">
          <FormItem name="brandId" control={control}>
            <CustomSelect
              label="Select Brand"
              value={brands?.items}
              className="w-full"
              allowClear
              items={brands?.items}
              renderText="name"
              renderValue="id"
              renderKey="id"
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
        </div>
        <div className="flex-1">
          <FormItem name="categoryId" control={control}>
            <CustomSelect
              label="Select Category"
              value={categories?.items}
              className="w-full"
              allowClear
              items={categories?.items}
              renderText="name"
              renderValue="id"
              renderKey="id"
              // onChange={onSelectPositions}
              // status={
              //   formik.touched.position && Boolean(formik.errors.position)
              //     ? 'error'
              //     : null
              // }
              placeholder="Select Category"
              // errorText={formik.touched.position && formik.errors.position}
            />
          </FormItem>
        </div>
      </div>
      <div className="flex space-x-2 w-full">
        <FormItem name="price" control={control}>
          <CustomInput size="large" min={0} label="Price" type="number" />
        </FormItem>
        <FormItem name="stock" control={control}>
          <CustomInput size="large" min={0} label="Stock" type="number" />
        </FormItem>
      </div>
      <div className="flex space-x-2 w-full">
        <FormItem name="shoppeeLink" control={control}>
          <CustomInput size="large" label="Shoppee Link" type="text" />
        </FormItem>
        <FormItem name="lazadaLink" control={control}>
          <CustomInput size="large" label="Lazada Link" type="text" />
        </FormItem>
      </div>
      <FormItem name="discount" control={control}>
        <CustomInput size="middle" min={0} label="Discount (%)" type="number" />
      </FormItem>
      <FormItem name="isSaleProduct" control={control}>
        <Checkbox>Is sale product?</Checkbox>
      </FormItem>

      <Form.Item>
        <div className="mt-5 p-0 mb-0 w-full flex items-center justify-end">
          <CustomButton
            htmlType="submit"
            loading={products?.loading}
            type="primary"
            children={
              action === ACTIONS.ADD
                ? 'Submit Product'
                : action === ACTIONS.EDIT && 'Save Changes'
            }
          />
        </div>
      </Form.Item>
    </Form>
  );
  console.log(getValues())
  console.log(action)
  console.log(ACTIONS)
  return (
    <div className='h-max'>
      <div className="flex items-center justify-between">
        <div className="w-full flex items-center space-x-3">
          <div className="p-3 rounded-full bg-blue-500/20 border border-blue-400">
            <BsFillBoxSeamFill size={40} className="text-blue-500" />
          </div>
          <div className="flex flex-col">
            <CustomLabel
              variant="text"
              classes="font-semibold text-5xl"
              children="Products"
            />
            <CustomLabel
              variant="text"
              classes="text-base text-gray-400"
              children="This section allows you to view, add, edit, and delete a certain product"
            />
          </div>
        </div>

        <CustomButton
          icon={<PiPlus />}
          size="large"
          children="Add Product"
          onClick={() => showModal(ACTIONS.ADD)}
        />
      </div>
      <div className="mt-14 space-y-5">
        <Tabs defaultActiveKey="0" items={items} onChange={onChangeTab} />
        <div className="text-right w-full">
          <CustomInput
            placeholder="Search brand name"
            size="large"
            classes="w-1/4"
            name="name"
            onChange={useDebounce(onSetFilter)}
          />
        </div>
        <CustomTable
          columns={columns}
          loading={isLoading}
          datasource={products?.items ?? []}
        />
      </div>
      <div>
        <CustomModal
          onCancel={onHandleClose}
          title={
            _.isEqual(action, ACTIONS.ADD)
              ? 'Add Product'
              : _.isEqual(action, ACTIONS.EDIT)
              ? 'Edit a Product'
              : 'Delete a Product'
          }
          footer={null}
          isOpen={isOpenModal}
          children={renderModalContent()}
          
        />
      </div>
    </div>
  );
}
