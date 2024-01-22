import dynamic from 'next/dynamic';
import CustomAvatar from './avatar/CustomAvatar';
import CustomButton from './button/CustomButton';
import CustomNextImage from './image/CustomNextImage';
import CustomInput from './input/CustomInput';
import CustomTextArea from './input/CustomTextArea';
import CustomLabel from './label/CustomLabel';
import CustomModal from './modal/CustomModal';
import CustomSelect from './select/CustomSelect';
import CustomTable from './table/CustomTable';
import CustomTag from './tag/CustomTag';
import CustomUploader from './uploader/CustomUploader';
const CustomTextEditor = dynamic(
  async () => await import('./input/CustomTextEditor'),
  {
    ssr: false,
  },
);

export {
  CustomAvatar,
  CustomButton,
  CustomInput,
  CustomLabel,
  CustomModal,
  CustomNextImage,
  CustomSelect,
  CustomTable,
  CustomTag,
  CustomTextArea,
  CustomTextEditor,
  CustomUploader,
};
