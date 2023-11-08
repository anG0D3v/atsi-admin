'use client';
import React, { forwardRef, memo } from 'react';
import { Upload } from 'antd';
import {
  type UploadChangeParam,
  type RcFile,
  type UploadFile,
} from 'antd/es/upload';
import { type UploadListType } from 'antd/es/upload/interface';
import clsx from 'clsx';
import { CustomLabel } from '..';

interface ICustomUploaderProps {
  beforeUpload?: (file: RcFile) => void;
  onRemove?: () => void;
  onChange?: (file: UploadChangeParam<UploadFile<any>>) => void;
  fileList?: Array<UploadFile<any>>;
  listType: UploadListType;
  maxCount: number;
  error?: string;
  label: string;
  labelClass?: string;
  children: React.ReactNode;
  name: string;
}

type UploadRef = React.RefAttributes<typeof Upload> | any;

const CustomUploader = forwardRef<UploadRef, ICustomUploaderProps>(
  ({ ...props }, ref) => {
    return (
      <div>
        {props.label && (
          <CustomLabel
            children={props.label}
            classes={clsx(props.labelClass, 'font-semibold mb-4')}
            variant="text"
          />
        )}
        <div className="mt-2 w-full">
          <Upload
            ref={ref}
            name={props.name}
            beforeUpload={(file) => props.beforeUpload(file)}
            onRemove={props.onRemove}
            onChange={props.onChange}
            fileList={props.fileList}
            listType={props.listType}
            maxCount={props.maxCount}
          >
            {props.children}
          </Upload>
        </div>
        {props.error && <p className="text-red-500">{props.error}</p>}
      </div>
    );
  },
);

CustomUploader.displayName = 'CustomUploader';

export default memo(CustomUploader);

// export default function CustomUploader(props: ICustomUploaderProps) {
//   return (
//     <div>
//       {props.label && (
//         <CustomLabel
//           children={props.label}
//           addedClass={clsx(props.labelClass, 'font-semibold mb-4')}
//           variant="text"
//         />
//       )}
//       <div className="mt-2 w-full">
//         <Upload
//           name={props.name}
//           beforeUpload={(file) => props.beforeUpload(file)}
//           onRemove={props.onRemove}
//           onChange={props.onChange}
//           fileList={props.fileList}
//           listType={props.listType}
//           maxCount={props.maxCount}
//         >
//           {props.children}
//         </Upload>
//       </div>
//       {props.error && <p className="text-red-500">{props.error}</p>}
//     </div>
//   );
// }
