import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import { useNavigate } from "react-router-dom";
import API from "../../../api/api";


function CreateJob(){

    const navigate = useNavigate();


const handleSubmit = async (e) => {

    e.preventDefault();


    const job = {

        title: document.getElementById("jobTitle").value,

        department: document.getElementById("department").value,

        location: document.getElementById("location").value,

        description: document.getElementById("description").value,

        requiredSkills: document.getElementById("requiredSkills").value,

        status: "Open",

        applicants: 0
    };


    try {

        await API.post("/jobs/create", job);


        alert("Job Created Successfully");


        navigate("/jobs");


    }
    catch(error){

        console.log(error);

        alert("Job creation failed");

    }

};



    return(

        <DashboardLayout>


            <h1>Create New Job</h1>


            <div className="activity-card">


                <form onSubmit={handleSubmit}>


                    <div className="form-group">

                        <label>
                            Job Title
                        </label>

                        <input
                            id="jobTitle"
                            type="text"
                            required
                        />

                    </div>



                    <div className="form-group">

                        <label>
                            Department
                        </label>

                        <input
                            id="department"
                            type="text"
                            required
                        />

                    </div>




                    <div className="form-group">

                        <label>
                            Location
                        </label>

                        <input
                            id="location"
                            type="text"
                            required
                        />

                    </div>




                    <div className="form-group">


                        <label>
                            Required Skills
                        </label>


                        <input

                            id="requiredSkills"

                            type="text"

                            placeholder="React, JavaScript, CSS, TypeScript"

                            required

                        />


                    </div>




                    <div className="form-group">


                        <label>
                            Description
                        </label>


                        <textarea

                            id="description"

                            rows="5"

                        ></textarea>


                    </div>




                    <button type="submit">

                        Create Job

                    </button>



                </form>


            </div>


        </DashboardLayout>


    );

}


export default CreateJob;