import {useState} from "react";
import {useParams} from "react-router-dom";
import API from "../../api/api";


function ResetPassword(){


const {token}=useParams();

const [password,setPassword]=useState("");
const [message,setMessage]=useState("");



const reset=async(e)=>{

e.preventDefault();


try{


const res=await API.post(
"/auth/reset-password",
{
token,
password
}
);


setMessage(res.data.message);


}catch{

setMessage("Error resetting password");

}

}



return (

<div>


<h1>Reset Password</h1>


<form onSubmit={reset}>


<input

type="password"

placeholder="New password"

onChange={
(e)=>setPassword(e.target.value)
}

/>


<button>
Change Password
</button>


</form>


<p>{message}</p>


</div>

)


}


export default ResetPassword;