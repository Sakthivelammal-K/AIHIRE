import DashboardLayout from "../../../components/dashboard/DashboardLayout";

function AIInterviewResults(){

    const results =
    JSON.parse(localStorage.getItem("interviewResults")) || [];

    const rankedResults = results.map((result) => {
        const resumeData = JSON.parse(localStorage.getItem("resumeAnalysis")) || {};

        const resumeScore = resumeData.score || 0;

        const interviewScore = result.overall || 0;

        const finalScore = Math.round((resumeScore + interviewScore) / 2);

        return {
            ...result,
            resumeScore,
            interviewScore,
            finalScore,
            recommendation:
            finalScore >= 80
            ? "Recommended"
            :
            "Not Recommended",
        };
    })
    .sort((a, b) => b.finalScore - a.finalScore);

    return(
        <DashboardLayout>
            <h1>AI Interview Results</h1>
            <div className="activity-card">

                <table>
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Candidate</th>
                            <th>Resume Score</th>
                            <th>Interview Score</th>
                            <th>Final AI Score</th>
                            <th>Recommendation</th>
                        </tr>
                    </thead>

                    <tbody>
                        {rankedResults.length > 0 ? (
                            rankedResults.map((result, index) => (
                                <tr key={result.id}>
                                    <td>#{index + 1}</td>
                                    <td>{result.candidateName}</td>
                                    <td>{result.resumeScore}%</td>
                                    <td>{result.interviewScore}%</td>
                                    <td>{result.finalScore}%</td>
                                    <td 
                                    style={{
                                        color:
                                        result.recommendation === "Recommended"
                                        ? "green"
                                        : "red",
                                        fontWeight: "bold",
                                    }}>
                                        {result.recommendation}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6">
                                    No Interview Results Available
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </DashboardLayout>
    );
}

export default AIInterviewResults;