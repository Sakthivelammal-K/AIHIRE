import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import { useEffect, useState } from "react";
import API from "../../../api/api";

function RecruiterInterviews() {

  const [interviews, setInterviews] = useState([]);


  useEffect(() => {

    loadInterviews();

  }, []);



  const loadInterviews = async () => {

    try {

      const response =
        await API.get("/interviews");


      setInterviews(response.data);


    } catch (error) {

      console.log(error);

    }

  };



  return (
    <DashboardLayout>

      <h1>Interview Management</h1>


      <div className="activity-card">


        <table>

          <thead>

            <tr>

              <th>Candidate</th>
              <th>Role</th>
              <th>Date</th>
              <th>Type</th>
              <th>Status</th>

            </tr>

          </thead>



          <tbody>


            {interviews.length > 0 ? (

              interviews.map((item) => (

                <tr key={item._id || item.id}>


                  <td>
                    {item.candidateName || "Unknown"}
                  </td>


                  <td>
                    {item.jobTitle || "N/A"}
                  </td>


                  <td>
                    {item.date || "N/A"}
                  </td>


                  <td>
                    {item.type || "AI Video"}
                  </td>


                  <td>
                    {item.status || "Scheduled"}
                  </td>


                </tr>

              ))

            ) : (


              <tr>

                <td colSpan="5">
                  No Interviews Scheduled
                </td>

              </tr>


            )}


          </tbody>


        </table>


      </div>


    </DashboardLayout>
  );
}


export default RecruiterInterviews;