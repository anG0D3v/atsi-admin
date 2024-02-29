'use client';
import React, {
  type ChangeEvent,
  useCallback,
  useState,
  useLayoutEffect,
} from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Tabs,
  type TabsProps,
  Form,
  Checkbox,
  Image,
  Flex,
  type RadioChangeEvent,
  Select,
  Modal,
  type UploadFile,
} from 'antd';
import { type RcFile } from 'antd/es/upload';
import _ from 'lodash';
import Highlighter from 'react-highlight-words';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { FormItem } from 'react-hook-form-antd';
import { BsFillBoxSeamFill } from 'react-icons/bs';
import { MdDelete } from 'react-icons/md';
import { PiPlus } from 'react-icons/pi';
import { type z } from 'zod';
import {
  CustomButton,
  CustomInput,
  CustomLabel,
  CustomModal,
  CustomNextImage,
  CustomSelect,
  CustomTable,
  CustomTag,
  CustomTextEditor,
  CustomUploader,
} from '@/components';
import CustomRadio from '@/components/CustomRadio/customRadio';
import { ACTIONS, STATUS } from '@/config/utils/constants';
import { currencyFormat, useDebounce } from '@/config/utils/util';
import { type IProductsDTO } from '@/interfaces/global';
import { ProductsService } from '@/services';
import productValidator from '@/validations/product';
import useStore from '@/zustand/store/store';
import {
  addProduct,
  deleteProduct,
  deleteProductImg,
  loadProducts,
  restoreProduct,
  selector,
  updateProduct,
} from '@/zustand/store/store.provider';

type ValidationSchema = z.infer<typeof productValidator>;


type FileType = Blob;

const getBase64 = async (file: FileType): Promise<string> =>
  await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

export default function page() {
  // Initialization
  const user = useStore(selector('user'));
  const brands = useStore(selector('brands'));
  const categories = useStore(selector('categories'));
  const products = useStore(selector('products'));
  const queryClient = useQueryClient();
  const { handleSubmit, control, getValues, reset, setValue, watch } =
    useForm<ValidationSchema>({
      defaultValues: {
        id: '',
        name: '',
        description: '',
        status: 'Available',
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
        isNewRelease: false,
        images: [],
      },
      resolver: zodResolver(productValidator),
    });
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [listFile, setListFile] = useState([]);
  const [productId, setProductId] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [action, setAction] = useState(null);
  const initialParams ={
    name: '',
    status: '',
    brandId: '',
    categoryId: '',
    isDeleted: false,
    isNewRelease: false,
    isSaleProduct: false,
  }
  const [filter, setFilter] = useState(initialParams);
  const items: TabsProps['items'] = [
    {
      key: STATUS.AVAILABLE,
      label: 'Available',
    },
    {
      key: STATUS.NEW_RELEASE,
      label: 'New Releases',
    },
    {
      key: STATUS.SALE_PRODUCT,
      label: 'Sale Products',
    },
    {
      key: STATUS.OUT_OF_STOCK,
      label: 'Out of Stock',
    },
    {
      key: STATUS.UNAVAILABLE,
      label: 'Deleted',
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
      dataIndex: 'price',
      title: 'Price',
      render: (data: any, index: number) => (
        <span key={index}>{currencyFormat(data)}</span>
      ),
    },
    {
      key: 2,
      dataIndex: 'discount',
      title: 'Discount',
      render: (data: any, index: number) => (
        <span key={index}>{data ? `${data}%` : 'No discount'}</span>
      ),
    },
    {
      key: 3,
      dataIndex: 'discountedPrice',
      title: 'Discounted Price',
      render: (data: any, index: number) => (
        <span key={index}>{currencyFormat(data)}</span>
      ),
    },
    {
      key: 4,
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
      key: 5,
      dataIndex: 'brand',
      title: 'Brand',
      render: (data: any, index: number) => (
        <span key={index}>{data?.name}</span>
      ),
    },
    {
      key: 6,
      dataIndex: 'category',
      title: 'Category',
      render: (data: any, index: number) => (
        <span key={index}>{data?.name}</span>
      ),
    },
    {
      key: 7,
      dataIndex: 'stock',
      title: 'Stock',
    },
    {
      key: 8,
      dataIndex: 'createdByUser',
      title: 'Added By',
      render: (data: any, index: number) => (
        <span key={index}>{data?.username ?? 'N/A'}</span>
      ),
    },
    {
      key: 9,
      title: 'Action',
      render: (data: any, index: number) => (
        <div className="flex flex-col items-center gap-2 w-full" key={index}>
          <CustomButton
            type="primary"
            children="Edit"
            onClick={() => showModal(ACTIONS.EDIT, data)}
            classes="w-32"
          />
          <CustomButton
            type="dashed"
            danger
            children="Delete Images"
            onClick={() => showModal(ACTIONS.IMGDELETE, data)}
            classes="w-32"
          />
          <CustomButton
            type="dashed"
            children={!data?.isDeleted ? 'Delete Product' : 'Restore Product'}
            danger={!data?.isDeleted}
            onClick={() =>
              showModal(
                !data?.isDeleted ? ACTIONS.DELETE : ACTIONS.RESTORE,
                data,
              )
            }
            classes="w-32"
          />
        </div>
      ),
    },
  ];

  const status = watch('status');
  const isSaleProduct = watch('isSaleProduct');
  const isNewRelease = watch('isNewRelease');
  const listImg =  watch('oldimg')
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
        : action === ACTIONS.IMGDELETE
        ? async (info: object) => deleteProductImg(info)
        : action === ACTIONS.DELETE || action === ACTIONS.MULTIDELETE
        ? async (info: object) => deleteProduct(info)
        : async (info: object) => restoreProduct(info),
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
        oldimg:[]
      });
      setSelectedImages([]);
      setSelectedRowKeys([]);
      queryClient.invalidateQueries({ queryKey: ['products'] });
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

  const onChange = (e: RadioChangeEvent) => {
    setValue('status', e.target.value);
  };

  // Functions
  const showModal = useCallback(
    (act: string, data?: any) => {
      setAction(act);
      setIsOpenModal(true);
      if (
        act === ACTIONS.EDIT ||
        act === ACTIONS.DELETE ||
        act === ACTIONS.RESTORE ||
        act === ACTIONS.MULTIDELETE
      ) {
        console.log(data);
        setValue('id', data?.id);
        setValue('name', data?.name);
        setValue('description', data?.description);
        setValue('status', data?.status);
        setValue('createdBy', data?.createdBy);
        setValue('updatedBy', user?.info?.id);
        setValue('stock', data?.stock);
        setValue('brandId', data?.brandId);
        setValue('categoryId', data?.categoryId);
        setValue('lazadaLink', data?.lazadaLink ? data.lazadaLink : '');
        setValue('shoppeeLink', data?.shoppeeLink ? data.shoppeeLink : '');
        setValue('discount', data?.discount ? data?.discount : 0);
        setValue('price', data?.price);
        setValue('isSaleProduct', data?.isSaleProduct);
        setValue('isNewRelease', data?.isNewRelease);
        setValue('oldimg', data?.media);
      }
      if (act === ACTIONS.IMGDELETE) {
        console.log(data?.media);
        setListFile(data?.media);
        setProductId(data?.id);
      }
    },
    [action],
  );

  const onChangeTab = (key: string) => {
    if (
      key === STATUS.UNAVAILABLE ||
      key === STATUS.NEW_RELEASE ||
      key === STATUS.SALE_PRODUCT
    ) {
      setFilter(() => ({
        ...initialParams,
        [key]: true,
      }));
    } else {
      setFilter(() => ({
        ...initialParams,
        status: key,
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
      oldimg:[]
    });
    setSelectedRowKeys([]);
    setSelectedImages([]);
  }, []);

  const onSubmit: SubmitHandler<ValidationSchema> = useCallback(
    (data) => {
      const formData = new FormData();
      if (
        action !== ACTIONS.DELETE &&
        action !== ACTIONS.MULTIDELETE &&
        action !== ACTIONS.RESTORE
      ) {
        const images = getValues('images');
        formData.append('name', getValues('name'));
        formData.append('description', getValues('description'));
        formData.append('price', getValues('price').toString());
        formData.append('categoryId', getValues('categoryId'));
        formData.append('brandId', getValues('brandId'));
        formData.append('stock', getValues('stock').toString());
        formData.append('shoppeeLink', getValues('shoppeeLink'));
        formData.append('lazadaLink', getValues('lazadaLink'));
        formData.append('discount', getValues('discount').toString());
        formData.append('status', getValues('status'));
        formData.append('isSaleProduct', isSaleProduct ? 'true' : 'false');
        formData.append('isNewRelease', isNewRelease ? 'true' : 'false');
        // eslint-disable-next-line array-callback-return
        images?.fileList?.map((file: { originFileObj: string | Blob }) => {
          formData.append('file', file?.originFileObj);
        });
      }
      if (action === ACTIONS.ADD) {
        formData.append('createdBy', data?.createdBy);
      } else if (action === ACTIONS.EDIT) {
        formData.append('id', data?.id);
        formData.append('updatedBy', data?.updatedBy);
      } else if (action === ACTIONS.DELETE || action === ACTIONS.RESTORE) {
        formData.append('updatedBy', data?.updatedBy);
        formData.append('ids[]', data?.id);
      } else if (action === ACTIONS.MULTIDELETE) {
        formData.append('updatedBy', user?.info?.id);
        selectedRowKeys.map((item) => formData.append('ids[]', item));
      }

      productMutation.mutateAsync(formData);
    },
    [action, getValues, productMutation, setAction],
  );

  const beforeUpload = (file: RcFile) => {
    return false;
  };
  const handleCancel = () => setPreviewOpen(false);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview ));
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
  };
  const handleImageSelect = (image: any) => {
    const selectedIndex = selectedImages.indexOf(image);
    const newSelectedImages = [...selectedImages];
    if (selectedIndex === -1) {
      newSelectedImages.push(image);
    } else {
      newSelectedImages.splice(selectedIndex, 1);
    }
    setSelectedImages(newSelectedImages);
  };
  const handleDeleteImages = () => {
    setAction(ACTIONS.IMGDELETE);
    const formData = new FormData();
    selectedImages?.forEach((fileId) => {
      formData.append(`mediaIds[]`, fileId.id);
    });
    formData.append('id', productId);
    formData.append('userId', user?.info?.id);
    formData.append('updatedBy', user?.info?.id);
    productMutation.mutateAsync(formData);
  };
  const handleSelection = (data: { value: string }, fieldName: string) => {
    setFilter((prev) => ({
      ...prev,
      [fieldName]: data.value,
    }));
  };
  // Rendered Components
  const renderModalContent = () => (
    <Form onFinish={handleSubmit(onSubmit)} className="mt-5">
      {action !== ACTIONS.DELETE &&
      action !== ACTIONS.RESTORE &&
      action !== ACTIONS.MULTIDELETE &&
      action !== ACTIONS.IMGDELETE ? (
        <div>
          <FormItem name="images" control={control}>
            <CustomUploader
              name="images"
              beforeUpload={(file) => beforeUpload(file)}
              label="Product Images (optional)"
              multiple
              maxCount={5}
              listType="picture-card"
              onPreview={handlePreview}
            >
              <div className="flex flex-col items-center justify-center">
                <PlusOutlined />
                <CustomLabel
                  variant="text"
                  children={action === ACTIONS.EDIT ? 'Add Images' : 'Upload'}
                />
              </div>
            </CustomUploader>
          </FormItem>
          {action === ACTIONS.EDIT && <div>
          <p>List of Images:</p>
          <Image.PreviewGroup
            items={listImg?.map((item: { url: string; }) => process.env.BASE_IMAGE_URL + item.url)}
          >
            <Image
              width={100}
              src={process.env.BASE_IMAGE_URL + listImg[0]?.url}
            />
          </Image.PreviewGroup>
          </div>}
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
                  allowClear={true}
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
              <CustomInput
                size="large"
                min={0}
                label="Price"
                type="number"
                step="0.01"
              />
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
            <CustomInput
              size="middle"
              min={0}
              label="Discount (%)"
              type="number"
            />
          </FormItem>
          <FormItem name="isNewRelease" control={control}>
            <Checkbox
              defaultChecked={getValues('isNewRelease')}
              onChange={(e) => setValue('isNewRelease', e.target.checked)}
            >
              Is product new release?
            </Checkbox>
          </FormItem>
          <FormItem name="isSaleProduct" control={control}>
            <Checkbox
              defaultChecked={getValues('isSaleProduct')}
              onChange={(e) => setValue('isSaleProduct', e.target.checked)}
            >
              Is sale product?
            </Checkbox>
          </FormItem>
          <FormItem name="status" control={control}>
            <Flex vertical gap="middle">
              <CustomRadio
                onChange={(e) => onChange(e)}
                choices={['Available', 'Unavailable', 'Out of Stock']}
                value={status}
              />
            </Flex>
          </FormItem>
        </div>
      ) : action === ACTIONS.IMGDELETE ? (
        <>
          {listFile?.length > 0 ? (
            <div>
              <Image.PreviewGroup
                preview={{
                  onChange: (current, prev) =>
                    console.log(
                      `current index: ${current}, prev index: ${prev}`,
                    ),
                }}
              >
                <div className="flex flex-wrap gap-8">
                  {listFile?.map((data, idx) => (
                    <div key={idx} className="basis-[30%]">
                      <Checkbox
                        checked={selectedImages.includes(data)}
                        onChange={() => handleImageSelect(data)}
                      />
                      <Image
                        width={'100%'}
                        height={110}
                        src={process.env.BASE_IMAGE_URL + data.url}
                      />
                    </div>
                  ))}
                </div>
              </Image.PreviewGroup>
              {selectedImages.length > 0 && (
                <div className="mt-5 p-0 mb-0 w-full flex items-center justify-end">
                  <CustomButton
                    htmlType="button"
                    onClick={handleDeleteImages}
                    loading={products?.loading}
                    type="primary"
                    children={'Delete Selected Images'}
                  />
                </div>
              )}
            </div>
          ) : (
            <p>No Images being saved</p>
          )}
        </>
      ) : action === ACTIONS.MULTIDELETE ? (
        <div>
          <CustomLabel
            variant="text"
            children={
              <span>
                {' '}
                Are you sure? Do you really want to delete all selected products{' '}
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
                {action === ACTIONS.DELETE ? 'delete' : 'restore'} this products{' '}
                <span className="font-semibold">{getValues('name')}</span>
              </span>
            }
            classes="text-lg"
          />
        </div>
      )}
      {action !== ACTIONS.IMGDELETE && (
        <Form.Item>
          <div className="mt-5 p-0 mb-0 w-full flex items-center justify-end">
            <CustomButton
              htmlType="submit"
              loading={products?.loading}
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
      )}
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
  const productData = products?.items?.map((data) => ({
    ...data,
    key: data.id,
  }));
  return (
    <div className="h-max">
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
        <div className="w-full flex gap-4 justify-between flex-wrap">
          <div className="w-52">
            {selectedRowKeys.length > 0 && (
              <CustomButton
                icon={<MdDelete />}
                size="large"
                danger
                children="Delete Selected"
                onClick={() => showModal(ACTIONS.MULTIDELETE)}
              />
            )}
          </div>
          <div className="flex grow justify-between items-end gap-8 flex-wrap">
            <div className="flex gap-4 flex-1">
              <Select
                value={filter.brandId ? filter.brandId : 'Select Brand'}
                onChange={(value) => {
                  handleSelection({ value }, 'brandId');
                }}
                allowClear
                optionLabelProp="label"
                size="large"
                className="w-52 min-w-60"
                options={brands?.items?.map(
                  (option: { id: any; name: any }) => ({
                    value: option.id,
                    label: option.name,
                  }),
                )}
              />
              <Select
                value={
                  filter.categoryId ? filter.categoryId : 'Select Category'
                }
                onChange={(value) => {
                  handleSelection({ value }, 'categoryId');
                }}
                optionLabelProp="label"
                size="large"
                allowClear
                className="w-52 min-w-60"
                options={categories?.items?.map(
                  (option: { id: any; name: any }) => ({
                    value: option.id,
                    label: option.name,
                  }),
                )}
              />
            </div>
            <div className="grow">
              <CustomInput
                placeholder="Search brand name"
                size="large"
                classes="w-full"
                name="name"
                onChange={useDebounce(onSetFilter)}
              />
            </div>
          </div>
        </div>
        <CustomTable
          columns={columns}
          loading={isLoading}
          rowSelection={rowSelection}
          datasource={productData ?? []}
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
              : 'Delete a Images'
          }
          footer={null}
          isOpen={isOpenModal}
          children={renderModalContent()}
        />
      </div>
      <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
        <CustomNextImage width={200} height={150} url={previewImage} />
      </Modal>
    </div>
  );
}
