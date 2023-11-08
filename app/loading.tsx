'use client';
import { ColorRing } from 'react-loader-spinner';
import { CustomLabel } from './components';

export default function Loading() {
  return (
    <div className="flex flex-1 flex-col space-y-3 justify-center items-center h-screen">
      <ColorRing
        visible={true}
        height="80"
        width="80"
        ariaLabel="blocks-loading"
        wrapperStyle={{}}
        wrapperClass="blocks-wrapper"
        colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}
      />
      <CustomLabel variant="text" children="Loading..." />
    </div>
  );
}
