import { notification } from 'antd';
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
export { customAlert, dateFormatter, executeOnProcess };
