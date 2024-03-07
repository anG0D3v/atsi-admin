// 'use client';

// import { useLayoutEffect } from 'react';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { Form } from 'antd';
// import Image from 'next/image';
// import { signIn, useSession } from 'next-auth/react';
// import { useForm, type SubmitHandler } from 'react-hook-form';
// import { FormItem } from 'react-hook-form-antd';
// import type z from 'zod';
// import { CustomButton, CustomInput, CustomLabel } from '@/components';
// import { Routes } from '@/config/routes/routes';
// import { authValidator } from '@/validations/auth';
// import { saveUserInfo } from '@/zustand/store/store.provider';

// type ValidationSchema = z.infer<typeof authValidator>;

// export default function Page() {
//   const session = useSession();
//   const { handleSubmit, control } = useForm<ValidationSchema>({
//     resolver: zodResolver(authValidator),
//   });
//   useLayoutEffect(() => {
//     if (session) {
//       // This will saved the user info in state management
//       saveUserInfo(session?.data);
//     }
//   }, [session]);
//   // Functions
//   const onSubmit: SubmitHandler<ValidationSchema> = async (data) => {
//     const res = await signIn('credentials', {
//       username: data.username,
//       password: data.password,
//       callbackUrl: Routes.Brands,
//       redirect: true,
//     });
//     if (res.error === 'AccessDenied' && res.status === 403) {
//       console.log('invalid creds');
//     }
//   };
//   return (
//     <div className="flex flex-row h-screen items-center justify-center">
//       <div className="flex items-center justify-center flex-col w-full md:w-full max-xl:w-full xl:w-1/2  p-10 ">
//         <div className="flex items-center justify-center flex-col">
//           <Image src="/assets/logo.png" alt="logo" width={200} height={200} />
//           <CustomLabel
//             children="Auxytech Technology Solutions Inc."
//             variant="title"
//             titleLevel={2}
//             classes="text-center my-10"
//           />
//         </div>

//         <CustomLabel
//           children="Login to your account"
//           variant="title"
//           classes="my-5 text-red-600"
//           titleLevel={4}
//         />

//         <div className="w-full space-y-5">
//           <Form onFinish={handleSubmit(onSubmit)} className="w-full space-y-5">
//             <FormItem control={control} name="username">
//               <CustomInput
//                 size="large"
//                 name="username"
//                 placeholder="Ex. John Doe"
//                 label="Username"
//                 type="text"
//               />
//             </FormItem>
//             <FormItem control={control} name="password">
//               <CustomInput
//                 size="large"
//                 name="password"
//                 placeholder="******"
//                 label="Password"
//                 type="password"
//               />
//             </FormItem>
//             <CustomButton
//               classes="bg-blue-600 w-full p-5 flex items-center justify-center"
//               children="Log In"
//               htmlType="submit"
//             />
//             <CustomButton
//               classes=""
//               type="link"
//               children="Forgot Password?"
//               onClick={() => {}}
//             />
//           </Form>
//         </div>
//       </div>
//     </div>
//   );
// }

/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-confusing-void-expression */
'use client';
import React from 'react';
import {
  LockOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  UserOutlined,
} from '@ant-design/icons';
import { Button, Form, Input } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { CustomLabel } from '@/components';
import useStore from '@/zustand/store/store';
import { login, saveUserInfo, selector } from '@/zustand/store/store.provider';

export default function Login() {
  const router = useRouter();
  const user = useStore(selector('user'));
  const onFinish = async (values: any) => {
    const formData = new FormData();
    formData.append('password', values.password);
    formData.append('username', values.username);
    try {
      // eslint-disable-next-line @typescript-eslint/await-thenable
      const res = await login(formData);
      saveUserInfo(res);
      router.push('/');
    } catch (error: any) {
      console.error('Error during Login:', error.message);
      toast.error('An error occurred during login.');
    }
  };
  return (
    <div className="w-full flex flex-col justify-center items-center px-2 md:px-10 pt-4 md:pt-20">
      <CustomLabel
        children="LOGIN"
        variant="text"
        addedClass="font-extrabold text-2xl"
      />
      <Form
        name="normal_login"
        className=" p-4 w-full md:w-1/3 flex flex-col justify-center items-center"
        initialValues={{ remember: true }}
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onFinish={onFinish}
      >
        <Form.Item
          name="username"
          className="w-full"
          label="Username:"
          rules={[{ required: true, message: 'Please input your Username!' }]}
        >
          <Input
            size="large"
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Username"
          />
        </Form.Item>
        <Form.Item
          label="Password"
          className="mb-2 w-full"
          name="password"
          rules={[{ required: true, message: 'Please input your Password!' }]}
        >
          <Input.Password
            prefix={<LockOutlined className="site-form-item-icon" />}
            size="large"
            placeholder="input password"
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
          />
        </Form.Item>
        <Form.Item className="flex justify-end items-end mr-2 mb-0">
          <a className="text-sky-500 m-0" href="">
            Forgot password?
          </a>
        </Form.Item>

        <Form.Item className="flex flex-col justify-center items-center">
          <Button
            type="default"
            htmlType="submit"
            loading={user.loading}
            className="bg-sky-500 my-4 px-8 text-white font-semibold"
          >
            Log in
          </Button>
          <div>
            or{' '}
            <Link className="text-sky-500" href="/register">
              Register now!
            </Link>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
}
