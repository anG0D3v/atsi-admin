/* eslint-disable @typescript-eslint/promise-function-async */
'use client';
import React, {
  useCallback,
  useState,
  useLayoutEffect,
} from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery,useQueryClient } from '@tanstack/react-query';
import { Form,Image,type UploadFile,type TableColumnsType, Modal, Checkbox  } from 'antd';
import { type RcFile } from 'antd/es/upload';
import _ from 'lodash';
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
import { type IWebDTO } from '@/interfaces/global';
import LandingPageServices from '@/services/landingPage';
import brandValidator from '@/validations/brand';
import type webValidator from '@/validations/Web';
import useStore from '@/zustand/store/store';
import {
  selector,
  fetchContent,
  deleteContentImg,
  addContent,
  updateContent,
  deleteContent,
  restoreContent,
  setInactiveActiveContent,
} from '@/zustand/store/store.provider';

type ValidationSchema = z.infer<typeof webValidator>;
type FileType = Blob;

const getBase64 = async (file: FileType): Promise<string> =>
  await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

export default function page() {
    const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
    const user = useStore(selector('user'));
    const queryClient = useQueryClient();
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [listFile, setListFile] = useState([]);
    const [selectedImages, setSelectedImages] = useState([]);
    const [contentId, setContentId] = useState('');
    const { handleSubmit, control, reset, setValue, getValues} =
      useForm<ValidationSchema>({
        defaultValues: {
          id: '',
          content: '',
          status: '',
          file:'',
          createdBy: user?.info?.id,
          updatedBy: ''
        },
        resolver: zodResolver(brandValidator),
      });
  
    const landingPageData = useStore(selector('Landingpage'));
  
    const [action, setAction] = useState<string>(ACTIONS.ADD);

    const handleActiveInactive = async(data:any):Promise<void> =>{
      const formData = new FormData();
      formData.append('updatedBy',user?.info?.id)
      formData.append('id',data.id)
      await setInactiveActiveContent(formData,data.status)
      queryClient.invalidateQueries({ queryKey: ['landing'] });
    }
    const columns: TableColumnsType = [
      {
        key: 0,
        dataIndex: 'title',
        title: 'Title',
      },
      {
        key: 1,
        dataIndex: 'content',
        title: 'Content',
      },
      {
        key: 2,
        dataIndex: 'landingPageImages',
        title: 'Logo',
        render: (data: any, index: number) =>
          data.length > 0 ? (
            <Image.PreviewGroup
            items={data?.map((item:any) =>({
                src :process.env.BASE_IMAGE_URL + item.url || ''
            }))}
          >
            <Image
              loading="eager"
              key={index}
              width={100}
              height="auto"
              src={process.env.BASE_IMAGE_URL + data[0].url}
              alt={data}
            />
          </Image.PreviewGroup>

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
        key: 4,
        dataIndex: 'createdByUser',
        title: 'Added By',
        render: (data: any, index: number) => (
          <span key={index}>{data?.username ?? 'N/A'}</span>
        ),
      },
      {
        key: 5,
        title: 'Action',
        render: (data: any, index: number) => (
          <div className="flex flex-col items-center gap-2 w-full" key={index}>
            <CustomButton
              type="primary"
              children="Edit"
              onClick={() => showModal(ACTIONS.EDIT, data)}
              classes='w-40'
            />
            <CustomButton
            type="dashed"
            danger
            children="Delete Images"
            onClick={() => showModal(ACTIONS.IMGDELETE, data)}
            classes='w-40'
          />
            <CustomButton
              type="dashed"
              children={!data?.isDeleted ? 'Delete' : 'Restore'}
              danger={!data?.isDeleted}
              onClick={() => showModal(!data?.isDeleted ? ACTIONS.DELETE : ACTIONS.RESTORE, data)}
              classes='w-40'
            />
          </div>
        ),
      },
    ];
  
    const { data: landingData, isLoading } = useQuery({
      queryKey: ['landing'],
      queryFn: async () => await LandingPageServices.fetchAll(),
    });
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  
    useLayoutEffect(() => {
      if (!isLoading) {
        fetchAboutsData(landingData?.data?.data);
      }
    }, [ landingData,isLoading]);
    const fetchAboutsData = async (payload: IWebDTO[]) => {
      fetchContent(payload);
    };
  
    const showModal = useCallback(
      (act: string, data?: any) => {
        setIsOpenModal(true);
        console.log(data)
        setAction(act);
        if (act === ACTIONS.EDIT || act === ACTIONS.DELETE || act === ACTIONS.RESTORE) {
          setValue('id', data?.id);
          setValue('title', data?.title);
          setValue('content', data?.content);
          setValue('updatedBy', user?.info?.id);
          setValue('status', data?.status);
        }
        if (act === ACTIONS.IMGDELETE) {
            console.log(data?.landingPageImages);
            setListFile(data?.landingPageImages);
            setContentId(data?.id);
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
          ? async (info: object) => await addContent(info)
          : action === ACTIONS.EDIT
          ? async (info: object) => await updateContent(info)
          : action === ACTIONS.IMGDELETE
          ? async (info: object) => deleteContentImg(info)
          : (action === ACTIONS.DELETE || action === ACTIONS.MULTIDELETE) 
          ? async (info: object) => await deleteContent(info)
          : async (info: object) => await restoreContent(info),
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
        queryClient.invalidateQueries({ queryKey: ['landing'] });
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
          formData.append('title', getValues('title'));
          const images = getValues('file');
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
    const beforeUpload = (file: RcFile) => {
        return false;
      };
      const handleCancel = () => setPreviewOpen(false);
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
      const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
          file.preview = await getBase64(file.originFileObj as FileType);
        }
    
        setPreviewImage(file.url || (file.preview ));
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
      };
      const handleDeleteImages = () => {
        setAction(ACTIONS.IMGDELETE);
        const formData = new FormData();
        selectedImages?.forEach((fileId) => {
          formData.append(`imageIds[]`, fileId.id);
        });
        formData.append('id', contentId);
        formData.append('updatedBy', user?.info?.id);
        contentMutation.mutateAsync(formData);
      };
    // Rendered Components
    const renderModalContent = () => (
      <Form layout='vertical' onFinish={handleSubmit(onSubmit)} className="mt-5">
        {(action !== ACTIONS.DELETE && action !== ACTIONS.RESTORE && action !== ACTIONS.MULTIDELETE && action !== ACTIONS.IMGDELETE) ? (
          <>
            <FormItem name="file" control={control}>
                <CustomUploader
                name="file"
                beforeUpload={(file) => beforeUpload(file)}
                label="Product Images (optional)"
                multiple
                maxCount={3}
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
            <FormItem name="title" control={control}>
            <CustomInput
              size="large"
              label="Title"
              type="text"
            />
          </FormItem>
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
                        loading={landingPageData?.loading}
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
      {action !== ACTIONS.IMGDELETE && (
        <Form.Item>
          <div className="mt-5 p-0 mb-0 w-full flex items-center justify-end">
            <CustomButton
              htmlType="submit"
              loading={landingPageData?.loading}
              type="primary"
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
    const aboutData = landingPageData?.list?.map((data: { id: any; }) => ({
      ...data,
      key:data.id
    }))
    console.log(aboutData)
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
              children="Landing Page"
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
      <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
        <CustomNextImage width={200} height={150} url={previewImage} />
      </Modal>
    </div>
  )
}
