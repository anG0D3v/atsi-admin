import Api from '@/config/apis';
import axiosInstance from '@/config/axios/axiosInstance';

const LandingPageServices = {
    fetchAll: async() =>
    await axiosInstance.get(Api.LANDINGPAGE().ALL),
    addContent: async (data: any) =>
    await axiosInstance.post(Api.LANDINGPAGE().ADD_CONTENT, data),
    updateContent: async (data: any) =>
        await axiosInstance.put(
        Api.LANDINGPAGE().UPDATE_CONTENT + `/${data?.get('id')}`,
        data,
        ),
    deleteContent: async (data: any) =>
        await axiosInstance.delete(
        Api.LANDINGPAGE().DELETE_CONTENT,
        { data },
        ),
    restoreContent: async(data:any) =>
    await axiosInstance.put(
        Api.LANDINGPAGE().RESTORE_CONTENT,
        data
    ),
    deleteContentImg: async (data: any) => 
        await axiosInstance.delete(
           Api.LANDINGPAGE().DELETE_IMAGES + `/${data?.get('id')}`,
           {data}
         ),
        setActiveContent:async(data:any) =>
        await axiosInstance.put(
            Api.LANDINGPAGE().ACTIVECONTENT + `/${data?.get('id')}` ,
            data
        ),
    setInActiveContent:async(data:any) =>
        await axiosInstance.put(
            Api.LANDINGPAGE().INACTIVECONTENT + `/${data?.get('id')}` ,
            data
        ),
}

export default LandingPageServices