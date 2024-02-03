import React, { type ChangeEvent } from 'react';
import clsx from 'clsx';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { QUILL_FORMATS, QUILL_MODULES } from '../../config/utils/constants';
import CustomLabel from '../label/CustomLabel';

interface ICustomTextEditorProps {
  onChange?: (e: ChangeEvent<HTMLInputElement> | any) => void;
  value?: string | undefined;
  defaultValue?: string | undefined;
  classes?: string | any;
  label?: string;
  error?: string;
}

function CustomTextEditor(props: ICustomTextEditorProps) {
  return (
    <div>
      {props.label && (
        <CustomLabel
          children={props.label}
          variant="text"
          classes="font-semibold mb-2"
        />
      )}
      <ReactQuill
        className={clsx(props.classes)}
        theme="snow"
        formats={QUILL_FORMATS}
        modules={QUILL_MODULES}
        value={props.value}
        defaultValue={props.defaultValue}
        onChange={(value) => props.onChange(value)}
      />
      {props.error && <CustomLabel children={props.error} variant="text" />}
    </div>
  );
}

export default CustomTextEditor;
