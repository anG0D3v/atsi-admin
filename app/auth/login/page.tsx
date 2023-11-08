'use client';

import { useLayoutEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from 'antd';
import Image from 'next/image';
import { signIn, useSession } from 'next-auth/react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { FormItem } from 'react-hook-form-antd';
import type z from 'zod';
import { CustomButton, CustomInput, CustomLabel } from '@/components';
import { authValidator } from '@/validations/auth';
import { saveUserInfo } from '@/zustand/store/store.provider';

type ValidationSchema = z.infer<typeof authValidator>;

export default function Page() {
  const session = useSession();
  const { handleSubmit, control } = useForm<ValidationSchema>({
    resolver: zodResolver(authValidator),
  });

  useLayoutEffect(() => {
    if (session) {
      // This will saved the user info in state management
      saveUserInfo(session?.data);
    }
  }, [session]);

  // Functions
  const onSubmit: SubmitHandler<ValidationSchema> = async (data) => {
    const res = await signIn('credentials', {
      username: data.username,
      password: data.password,
      callbackUrl: '/',
      redirect: false,
    });
    if (res.error === 'AccessDenied' && res.status === 403) {
      console.log('invalid creds');
    }
  };
  return (
    <div className="flex flex-row h-screen items-center justify-center">
      <div className="flex items-center justify-center flex-col w-full md:w-full max-xl:w-full xl:w-1/2  p-10 ">
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
              classes="bg-blue-600 w-full p-5 flex items-center justify-center"
              children="Log In"
              htmlType="submit"
            />
            <CustomButton
              classes=""
              type="link"
              children="Forgot Password?"
              onClick={() => {}}
            />
          </Form>
        </div>
      </div>
    </div>
  );
}
