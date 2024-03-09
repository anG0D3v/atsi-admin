import Api from '@/config/apis';
import axiosInstance from '@/config/axios/axiosInstance';

const FeedbackServices = {
    fetchAll: async(data:any) =>{
        return(
            await axiosInstance.get(Api.FEEDBACK().ALL + `?productName=${data?.productName ? data?.productName : ''}&userName=${data?.userName ? data?.userName : ''}&isDeleted=${data?.isDeleted}`)
        )
    },
    deleteFeedback: async (data: any) =>
        await axiosInstance.delete(
        Api.FEEDBACK().DELETE_FEEDBACK,
        { data },
        ),
    restoreFeedback: async(data:any) =>
    await axiosInstance.put(
        Api.FEEDBACK().RESTORE_FEEDBACK,
        data
    )
}

export default FeedbackServices