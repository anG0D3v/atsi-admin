'use client';
import React, { useState } from 'react';
import { Form, Input, notification } from 'antd';
import { CustomButton } from '@/components';
import { UserServices } from '@/services';
import useStore from '@/zustand/store/store';
import { saveCodes, selector } from '@/zustand/store/store.provider';

export default function ForgotPasswordPage() {
    const user = useStore(selector('user'));
    const [page, setPage] = useState(0);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loadingEmail, setLoadingEmail] = useState(false);
    const [loadingOtp, setLoadingOtp] = useState(false);
    const [loadingReset, setLoadingReset] = useState(false);

    const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

    const handleEmailSubmit = async (isResend = false) => {
        setLoadingEmail(true);
        const otpCode = generateOtp();
        const formData = new FormData();
        formData.append('email', email);
        formData.append('otp', otpCode);
        formData.append('code', 'RSTPSWRD');
        try {
            const res = await UserServices.forgotPasswordApi(formData);
            if (res.data.success !== '') {
                saveCodes({ otp: otpCode, code: 'RSTPSWRD' });
                notification.success({ message: isResend ? 'OTP resent to email successfully' : 'OTP sent to email successfully' });
                setPage(1);
            } else {
                notification.error({ message: res.data.message !== '' ? res.data.message : 'Something went wrong' });
            }
        } catch (error) {
            console.error('Error during email submission:', error);
            notification.error({ message: 'An error occurred while sending OTP' });
        } finally {
            setLoadingEmail(false);
        }
    };

    const handleOtpSubmit = () => {
        setLoadingOtp(true);
        if (otp === '') {
            notification.error({ message: 'Please input OTP first' });
            setLoadingOtp(false);
            return;
        }
        if (otp !== user.otp) {
            notification.error({ message: 'Wrong OTP' });
            setLoadingOtp(false);
            return;
        }
        notification.success({ message: 'OTP verified successfully' });
        setPage(2);
        setLoadingOtp(false);
    };

    const handleResetPassword = async () => {
        setLoadingReset(true);
        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);
        try {
            const res = await UserServices.resetPasswordApi(formData);
            console.log(res)
            if (res.data.data !== '') {
                notification.success({ message: res.data.data.message });
                window.location.href = '/';
            } else {
                notification.error({ message: res.data.message });
            }
        } catch (error) {
            console.error('Error during password reset:', error);
            notification.error({ message: 'An error occurred while resetting password' });
        } finally {
            setLoadingReset(false);
        }
    };

    const onEmailFormFinish = () => {
        handleEmailSubmit().catch(error => {
            console.error('Error during email submission:', error);
        });
    };

    const onResetPassFinish = () => {
        handleResetPassword().catch(error => {
            console.error('Error during password reset:', error);
        });
    };
    const onResendOtpClick = () => {
        handleEmailSubmit(true).catch(error => {
            console.error('Error during OTP resend:', error);
        });
    };

    return (
        <div className="flex justify-center items-center h-[400px]">
            <div className="max-w-md w-full mx-auto bg-white p-8 border bg-white/30  border-white backdrop-blur-[2px] shadow-lg rounded-lg">
                {page === 0 && (
                    <Form onFinish={onEmailFormFinish}>
                        <p className="text-[18px] font-bold mb-2 text-center text-nowrap">Forgot Password</p>
                        <p className='mb-4'>Please enter your email and we will send you an OTP to reset your password</p>
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[{ required: true, message: 'Please input your email!' }]}
                        >
                            <Input
                                value={email}
                                onChange={(e) => { setEmail(e.target.value) }}
                            />
                        </Form.Item>
                        <Form.Item>
                            <CustomButton
                                children='Send OTP'
                                htmlType='submit'
                                classes='bg-sky-600 w-full text-white'
                                loading={loadingEmail}
                            />
                        </Form.Item>
                    </Form>
                )}
                {page === 1 && (
                    <Form onFinish={handleOtpSubmit}>
                        <p className="text-[18px] font-bold mb-2 text-center text-nowrap">OTP Verification</p>
                        <p className='mb-4'>An OTP has been sent to your email. Please input it below</p>
                        <Form.Item
                            label="OTP"
                            name="otp"
                            rules={[{ required: true, message: 'Please input the OTP!' }]}
                        >
                            <Input
                                value={otp}
                                onChange={(e) => { setOtp(e.target.value) }}
                            />
                        </Form.Item>
                        <Form.Item>
                            <CustomButton
                                children='Verify OTP'
                                htmlType='submit'
                                classes='bg-sky-600 w-full text-white'
                                loading={loadingOtp}
                            />
                        </Form.Item>
                        <Form.Item>
                            <CustomButton
                                children='Resend OTP'
                                htmlType='button'
                                classes='bg-gray-600 w-full text-white'
                                onClick={onResendOtpClick}
                            />
                        </Form.Item>
                    </Form>
                )}
                {page === 2 && (
                    <Form onFinish={onResetPassFinish}>
                        <p className="text-[18px] font-bold mb-2 text-center text-nowrap">Reset Password</p>
                        <Form.Item
                            label="Username"
                            name="username"
                            rules={[{ required: true, message: 'Please input your username!' }]}
                        >
                            <Input
                                value={username}
                                onChange={(e) => { setUsername(e.target.value) }}
                            />
                        </Form.Item>
                        <Form.Item
                            label="New Password"
                            name="password"
                            rules={[
                                { required: true, message: 'Please input your new password!' },
                                { min: 8, message: 'Password must be at least 8 characters long!' }
                            ]}
                        >
                            <Input.Password
                                value={password}
                                onChange={(e) => { setPassword(e.target.value) }}
                            />
                        </Form.Item>
                        <Form.Item>
                            <CustomButton
                                children='Reset Password'
                                htmlType='submit'
                                classes='bg-sky-600 w-full text-white'
                                loading={loadingReset}
                            />
                        </Form.Item>
                    </Form>
                )}
            </div>
        </div>
    );
}
