import Cookies from "universal-cookie";
const cookies = new Cookies();

const getAuth=()=>{
    const user = cookies.get("USER");
    return user;
}

export {
    getAuth
}