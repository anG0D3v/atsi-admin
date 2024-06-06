'use client';
import { useCallback, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from 'antd';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
// import { signIn, useSession } from 'next-auth/react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { FormItem } from 'react-hook-form-antd';
import { Toaster } from 'react-hot-toast';
import type z from 'zod';
import { Routes } from './config/routes/routes';
import useStore from './zustand/store/store';
import { login, selector } from './zustand/store/store.provider';
import { CustomButton, CustomInput, CustomLabel } from '@/components';
import { authValidator } from '@/validations/auth';

type ValidationSchema = z.infer<typeof authValidator>;

export default function Page() {
  // const session = useSession();
  const router = useRouter()
  const user = useStore(selector('user'));
  const { handleSubmit, control } = useForm<ValidationSchema>({
    resolver: zodResolver(authValidator),
  });
  const navigate = useRouter();

  useEffect(() => {
    if (user?.info) {
      navigate.push(Routes.Brands);
    }
  }, [user]);

  // Functions
  const onSubmit: SubmitHandler<ValidationSchema> = useCallback(
    async (data) => {
      // const res = await signIn('credentials', {
      //   username: data.username,
      //   password: data.password,
      //   callbackUrl: '/',
      //   redirect: false,
      // });
      // console.log(res)
      // if (res.error === 'AccessDenied' && res.status === 403) {
      //   saveUserInfo(res.error);
      //   toast.error(res.error);
      // } else {
      //   toast.success('Login Success!');
      //   navigate.push(Routes.Brands);
      // }
      login(data);
    },
    [],
  );
  console.log('eto: ', user);
  return (
    <div className="flex flex-row h-screen items-center justify-center relative max-xl:p-10">
      <Toaster />
      <div className="flex items-center justify-center flex-col w-full md:w-full max-xl:w-full xl:w-1/2 p-10 bg-white/30 border border-white rounded-3xl backdrop-blur-[2px] ">
        <div className="flex items-center justify-center flex-col">
          <Image src="/assets/logo.png" alt="logo" width={200} height={200} />
          <CustomLabel
            children="Auxytech Technology Solutions Inc."
            variant="title"
            titleLevel={2}
            classes="text-center my-10"
          />
        </div>

        <CustomLabel
          children="Login to your account"
          variant="title"
          classes="my-5 text-red-600"
          titleLevel={4}
        />

        <div className="w-full space-y-5">
          <Form onFinish={handleSubmit(onSubmit)} className="w-full space-y-5">
            <FormItem control={control} name="username">
              <CustomInput
                size="large"
                name="username"
                placeholder="Ex. John Doe"
                label="Username"
                type="text"
              />
            </FormItem>
            <FormItem control={control} name="password">
              <CustomInput
                size="large"
                name="password"
                placeholder="******"
                label="Password"
                type="password"
              />
            </FormItem>
            <CustomButton
              loading={user?.loading}
              classes="bg-blue-600 w-full p-5 flex items-center justify-center text-white"
              children="Log In"
              htmlType="submit"
            />
            <CustomButton
              classes=""
              type="link"
              children="Forgot Password?"
              onClick={() => router.push('/forgotPassword')}
            />
          </Form>
        </div>
      </div>
      <div className="absolute bottom-0 bg-[url('/assets/bg-footer.png')] bg-center bg-no-repeat bg-cover w-full h-[40rem] bg-transparent -z-10"></div>
    </div>
  );
}
