
import  { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
function  useAuth() {
    const navigate = useNavigate();
    const token = sessionStorage.getItem('token');
    useEffect(() => {
      async function AuthCheck() {
        try {
          const response = await fetch("http://localhost:5000/authcheck", {
            method: "POST",
            crossDomain: true,
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json"
            },
          });
    
          const data = await response.status;

          if(data !==200) navigate('/login');
    
          console.log(data);
        } catch (error) {
          console.error("Error:", error);
        }
      }
    
      AuthCheck();
    });
}

export default useAuth;



