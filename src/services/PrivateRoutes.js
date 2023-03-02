import { Navigate,Outlet } from 'react-router-dom';
import Cookies from "universal-cookie";
const cookies = new Cookies();

// get token generated on login


const Private = ({children}) => {
    const user = cookies.get("USER");

    return user ? <Outlet /> : <Navigate to="/login" />;
}

export default Private;