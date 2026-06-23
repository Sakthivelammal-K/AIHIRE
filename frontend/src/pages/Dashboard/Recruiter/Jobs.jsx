import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../../../api/api";


function Jobs() {

    const navigate = useNavigate();

    const [jobs, setJobs] = useState([]);



    useEffect(()=>{

        loadJobs();

    },[]);



    const loadJobs = async()=>{

        try{

            const response =
            await API.get("/jobs/");


            setJobs(response.data);


        }
        catch(error){

            console.log(error);

        }

    };




    const deleteJob = async(id)=>{


        try{


            console.log("Deleting job:", id);


            await API.delete(
                `/jobs/${id}`
            );


            alert("Job Deleted Successfully");


            loadJobs();


        }
        catch(error){


            console.log(
                error.response?.data || error
            );


            alert("Delete API failed");


        }

    };




    return (

        <DashboardLayout>


            <h1>
                Job Management
            </h1>



            <div className="activity-card">



                <button
                    onClick={()=>navigate("/create-job")}
                >

                    Create New Job

                </button>



                <br/>
                <br/>




                <table>


                    <thead>

                    <tr>

                        <th>
                            Job Title
                        </th>

                        <th>
                            Department
                        </th>

                        <th>
                            Location
                        </th>

                        <th>
                            Status
                        </th>

                        <th>
                            Applicants
                        </th>

                        <th>
                            Actions
                        </th>

                    </tr>


                    </thead>




                    <tbody>


                    {

                    jobs.length > 0 ?


                    jobs.map((job)=>(


                        <tr key={job._id}>


                            <td>
                                {job.title}
                            </td>


                            <td>
                                {job.department}
                            </td>


                            <td>
                                {job.location}
                            </td>


                            <td>
                                {job.status}
                            </td>


                            <td>
                                {job.applicants || 0}
                            </td>



                            <td>



                                <button

                                onClick={()=>navigate(
                                    `/edit-job/${job._id}`
                                )}

                                >

                                    Edit

                                </button>



                                {" "}



                                <button

                                onClick={()=>deleteJob(job._id)}

                                >

                                    Delete

                                </button>



                            </td>


                        </tr>


                    ))



                    :



                    (

                        <tr>

                            <td colSpan="6">

                                No Jobs Available

                            </td>


                        </tr>

                    )


                    }



                    </tbody>



                </table>


            </div>


        </DashboardLayout>

    );

}


export default Jobs;