import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const responseHandler=(res,showToast=false)=>{
    if(res.status==200){
        if(showToast){
            toast.success(res.data.message);
        }
        return res.data.data;
    }else{
        toast.error(res.data.message);
        return null;
    }
}

export default responseHandler;
