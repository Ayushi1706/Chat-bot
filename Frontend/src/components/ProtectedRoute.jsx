import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
    //get token
    const { token } = useAuth();
    // if token exists → show page
    if(!token){
        return <Navigate to="/login"/>
    }
    // if no token → redirect to login
    return children;

};

export default ProtectedRoute;