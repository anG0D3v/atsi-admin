'use client';
import React, { useCallback, useLayoutEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Form, Layout, Menu } from 'antd';
import type { MenuProps } from 'antd';
import { useRouter, usePathname } from 'next/navigation';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { FormItem } from 'react-hook-form-antd';
import { BsFillBoxSeamFill,BsFillInfoSquareFill } from 'react-icons/bs';
import { FaUsers } from 'react-icons/fa6';
import { MdOutlineEdit } from 'react-icons/md';
import { PiSignOutBold } from 'react-icons/pi';
import { TbBrandFramerMotion, TbCategoryFilled,TbWorldWww } from 'react-icons/tb';
import { VscFeedback } from 'react-icons/vsc';
import { type z } from 'zod';
import { CustomAvatar, CustomButton, CustomInput, CustomLabel, CustomModal } from '@/components';
import { Routes } from '@/config/routes/routes';
import { userUpdateValidator } from '@/validations/user';
import useStore from '@/zustand/store/store';
import {
  logout,
  saveUserInfo,
   selector,
  updateUser
} from '@/zustand/store/store.provider';

const { Sider, Header, Content } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } satisfies MenuItem;
}
const items: MenuItem[] = [
  // getItem('Dashboard', '0', <BiSolidDashboard />),
  getItem('Brands', '0', <TbBrandFramerMotion />),
  getItem('Categories', '1', <TbCategoryFilled />),
  getItem('Products', '2', <BsFillBoxSeamFill />),
  getItem('Users', '3', <FaUsers />),
  getItem('Blogs','4',<TbWorldWww />),
  getItem('Feedback','5',<VscFeedback />),
  getItem('About us','6',<BsFillInfoSquareFill />),
  getItem('Sign Out', '7', <PiSignOutBold />),
];

interface Props {
  children: React.ReactNode;
}

type TValidationSchema = z.infer<typeof userUpdateValidator>;

export default function RootLayout({ children }: Props) {

  const [collapsed, setCollapsed] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const users = useStore(selector('user'));
  const defaultValues = {
    id: '',
    username: '',
    email: '',
    password: '',
  };
  const [currentPathname, setCurrentPathname] = useState<string>('');
  const navigate = useRouter();
  const { handleSubmit, control, reset, setValue } =
  useForm<TValidationSchema>({
    defaultValues,
    resolver: zodResolver(userUpdateValidator),
  });

  useLayoutEffect(() => {
    setCurrentPathname(pathname);
  }, [pathname]);

  const handleSignOut = async () => {
    try {
      logout()
      navigate.push('/')
      
    } catch (error) {
      console.error('Signout error:', error);
      // Handle error as needed
    }
  };
  
  const onSelectMenu = useCallback((item: any) => {
    console.log(item)
    switch (item?.key) {
      case '0':
        navigate.push(Routes.Brands);
        break;
      case '1':
        navigate.push(Routes.Categories);
        break;
      case '2':
        navigate.push(Routes.Products);
        break;
      case '3':
        navigate.push(Routes.Users);
        break;
      case '4':
        navigate.push(Routes.Web);
        break;
      case '5':
          navigate.push(Routes.Feedback);
          break;
      case '6':
        navigate.push(Routes.AboutUS);
        break;
      case '7':
        handleSignOut();
        break;
      default:
        break;
    }
  }, []);

  const showModal = useCallback(() => {
    setOpen(true);
    setValue('id',users?.info?.id)
    setValue('username',users?.info?.username)
    setValue('email',users?.info?.email)
  }, []);
  const onHandleClose = useCallback(() => {
    setOpen(false);
    reset(defaultValues);
  }, []);

  const userMutation = useMutation({
    mutationFn:
      async (info: object) => await updateUser(info),
    onSuccess: (data) => {
      setOpen(false);
      saveUserInfo(data)
      reset(defaultValues);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const onSubmit: SubmitHandler<TValidationSchema> = useCallback(
    (data) => {
        userMutation.mutate(data);
    },
    [],
  );
  const renderModalContent = () => (
    <Form 
    onFinish={handleSubmit(onSubmit)} 
    className="mt-5">
      <FormItem name="username" control={control}>
        <CustomInput
          size="large"
          label="Username"
          type="text"
        />
      </FormItem>
      <FormItem name="email" control={control}>
        <CustomInput
          size="large"
          label="Email"
          type="text"
        />
      </FormItem>
      <FormItem name="password" control={control}>
        <CustomInput
          size="large"
          label="Password"
          type="text"
          placeholder='Your new password'
        />
      </FormItem>

      <Form.Item>
        <div className="mt-5 p-0 mb-0 w-full flex items-center justify-end">
          <CustomButton
            htmlType="submit"
            loading={users?.loading}
            type="primary"
            children={'Save Changes'}
          />
        </div>
      </Form.Item>
    </Form>
  );

  return (
    <section>
      <Layout className="h-max min-h-screen">
        <Sider
          collapsible
          className="relative overflow-auto h-auto fixed"
          width={250}
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
        >
          <div className="p-3 text-left flex flex-col items-center justify-center space-y-5">
            <CustomAvatar
              size={collapsed ? 60 : 100}
              alt="profile"
              classes="border border-2 border-white mt-5 object-contain"
              url={'/assets/logo1.png'}
              shape='circle'
            />
            {!collapsed && (
              <div className="w-full flex flex-col items-center justify-center">
                <CustomLabel
                  variant="text"
                  children="Welcome,"
                  classes="text-white text-left  text-sm"
                />
                <div className='flex gap-4 items-center'>
                <CustomLabel
                  variant="text"
                  children={users?.info?.username}
                  classes="text-white font-semibold text-2xl m-0 p-0"
                />
                <MdOutlineEdit onClick={() => showModal()}
                 size={25} color='white' className='cursor-pointer' />
                </div>

              </div>
            )}
          </div>
          <div className="p-3">
            <Menu
              onClick={(item) => onSelectMenu(item)}
              theme="dark"
              selectedKeys={[
                currentPathname === Routes.Categories
                  ? '1'
                  : currentPathname === Routes.Brands
                  ? '0'
                  : currentPathname === Routes.Products
                  ? '2'
                  : currentPathname === Routes.Users
                  ? '3' 
                  : currentPathname === Routes.Web
                  ? '4'
                  : currentPathname === Routes.Feedback
                  ? '5'
                  : currentPathname === Routes.AboutUS
                  ? '6'
                  : '0',
              ]}
              mode="inline"
              items={items}
            />
          </div>
        </Sider>
        <Layout className="bg-[#f5f5f5]">
          <Header className="drop-shadow-md bg-white p-5" />
          <Content className="p-10">
            <div className="bg-white p-10 min-h-full">{children}</div>
          </Content>
        </Layout>
      </Layout>
      <CustomModal
        onCancel={onHandleClose}
        title={'Edit your Account Details'
        }
        footer={null}
        isOpen={open}
        children={renderModalContent()}
      />
    </section>
  );
}
