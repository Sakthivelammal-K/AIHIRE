import { useEffect, useState } from "react";
import API from "../../../api/api";
import DashboardLayout from "../../../components/dashboard/DashboardLayout";

function RankedCandidates(){

    const [data,setData] = useState([]);
    const jobId = "YOUR_JOB_ID"; // or useParams()

    useEffect(()=>{

        load();

    },[]);

    const load = async()=>{

        const res = await API.get(`/jobs/ranked-candidates/${jobId}`);

        setData(res.data.rankedCandidates);

    };

    return(

        <DashboardLayout>

            <h2>Candidate Ranking (ATS Score)</h2>

            <table border="1" style={{width:"100%"}}>

                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>ATS Score</th>
                        <th>Status</th>
                    </tr>
                </thead>

                <tbody>

                    {data.map((c,index)=>(
                        <tr key={index}>
                            <td>{index+1}</td>
                            <td>{c.candidateName}</td>
                            <td>{c.email}</td>
                            <td>{c.atsScore}%</td>
                            <td>{c.status}</td>
                        </tr>
                    ))}

                </tbody>

            </table>

        </DashboardLayout>

    );

}

export default RankedCandidates;