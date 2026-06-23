import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import { useEffect, useState } from "react";
import API from "../../../api/api";


function AIInterviewResults() {


  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);



  useEffect(() => {

    loadResults();

  }, []);



  const loadResults = async () => {

    try {

      const response =
        await API.get("/interviews/results");


      setResults(response.data || []);


    } catch (error) {

      console.log(error);

      setResults([]);

    } finally {

      setLoading(false);

    }

  };



  return (

    <DashboardLayout>


      <h1>
        AI Interview Results
      </h1>



      <div className="activity-card">


        {loading ? (

          <p>
            Loading results...
          </p>

        ) : (


          <table>


            <thead>

              <tr>

                <th>
                  Candidate
                </th>


                <th>
                  Interview Score
                </th>


                <th>
                  Recommendation
                </th>


              </tr>

            </thead>



            <tbody>


              {results.length > 0 ? (


                results.map((item, index) => (


                  <tr 
                    key={item._id || index}
                  >


                    <td>

                      {item.candidateName || "Unknown"}

                    </td>



                    <td>

                      {item.score ?? 0}%

                    </td>



                    <td>


                      {(item.score ?? 0) >= 80

                        ? "Recommended"

                        : "Not Recommended"

                      }


                    </td>



                  </tr>


                ))



              ) : (


                <tr>


                  <td colSpan="3">

                    No Results

                  </td>


                </tr>


              )}



            </tbody>


          </table>


        )}



      </div>



    </DashboardLayout>

  );

}


export default AIInterviewResults;