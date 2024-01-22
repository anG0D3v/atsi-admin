import { notification } from 'antd';
import { debounce } from 'lodash';
import moment from 'moment';

const executeOnProcess = async (callback: any) =>
  await new Promise((resolve) => {
    callback();
    setTimeout(() => resolve(true), 2000);
  });

const customAlert = (key: any, msg: string, description: string) => {
  notification[key]({
    message: msg,
    description,
  });
};

const dateFormatter = (date: any) => moment(date).format('MM / DD / YYYY');

const useDebounce = (func: any) => debounce(func, 1000);

const currencyFormat = (num: number) => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'PHP',
  });

  return formatter.format(num);
};
export {
  currencyFormat,
  customAlert,
  dateFormatter,
  executeOnProcess,
  useDebounce,
};
