import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import "../../styles/dashboard.css";
import API from "../../api/api";


function DashboardLayout({ children }) {


  const [user, setUser] = useState(null);



  useEffect(()=>{

    getUser();

  },[]);



  const getUser = async()=>{

    try{

      const email =
      localStorage.getItem("email");


      const response =
      await API.get(
        `/users/profile?email=${email}`
      );


      setUser(response.data);


    }
    catch(error){

      console.log(error);

    }

  };



  const userName =
  user?.name || "User";


  const role =
  user?.role || "candidate";



  return (

    <div className="dashboard-container">


      <Sidebar role={role} />


      <div className="dashboard-main">


        <Header

          userName={userName}

          role={role}

        />



        <div className="dashboard-content">

          {children}

        </div>


      </div>


    </div>

  );
}


export default DashboardLayout;