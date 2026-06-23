import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import { useEffect, useState } from "react";
import API from "../../../api/api";


function Applications() {


  const [applications, setApplications] = useState([]);

  const [loading, setLoading] = useState(true);



  useEffect(()=>{

    loadApplications();

  },[]);




  const loadApplications = async()=>{


    try{


      const response =
      await API.get("/applications/");


      console.log(
        "Applications:",
        response.data
      );


      setApplications(response.data);


    }
    catch(error){

      console.log(error);

    }
    finally{

      setLoading(false);

    }


  };




  const username =
    localStorage.getItem("username");



  const myApplications =
    applications.filter(
      (app)=>
        app.candidateName === username
    );



  return (

    <DashboardLayout>



      <h1>
        My Applications
      </h1>




      <div className="activity-card">


        {loading ? (

          <p>
            Loading applications...
          </p>


        ) : (


        <table>


          <thead>

            <tr>

              <th>
                Job Title
              </th>


              <th>
                Company
              </th>


              <th>
                Applied Date
              </th>


              <th>
                Status
              </th>


            </tr>


          </thead>




          <tbody>


          {
            myApplications.length > 0 ? (


              myApplications.map(
                (app,index)=>(

                <tr key={index}>


                  <td>
                    {app.jobTitle}
                  </td>


                  <td>
                    {app.company}
                  </td>


                  <td>
                    {app.appliedDate}
                  </td>


                  <td>

                    <span>

                      {app.status}

                    </span>

                  </td>


                </tr>


              ))


            ) : (


              <tr>


                <td colSpan="4">

                  No applications found

                </td>


              </tr>


            )

          }



          </tbody>


        </table>


        )}



      </div>


    </DashboardLayout>

  );

}


export default Applications;