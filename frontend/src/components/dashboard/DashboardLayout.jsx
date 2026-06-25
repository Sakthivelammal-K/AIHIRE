import {
useEffect,
useState
} from "react";


import Sidebar from "./Sidebar";
import Header from "./Header";

import "../../styles/dashboard.css";

import API from "../../api/api";



function DashboardLayout({children}){


const [user,setUser]=useState(null);



useEffect(()=>{


loadUser();


},[]);




const loadUser=async()=>{


try{


const email =
localStorage.getItem("email");


const res =
await API.get(
`/users/profile?email=${email}`
);


setUser(res.data);



}
catch(err){

console.log(err);

}


};




return (

<div className="dashboard-container">



<Sidebar />



<div className="dashboard-main">



<Header

userName={
user?.name || "User"
}

role={
user?.role || "candidate"
}

/>



<main className="dashboard-content">

{children}

</main>



</div>



</div>


);


}


export default DashboardLayout;