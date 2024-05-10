import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function CveDetails() {
    const { id } = useParams();
    const [cveDetails, setCveDetails] = useState(null);

    useEffect(() => {
        fetchData();
    }, [id]);

    async function fetchData() {
        try {
            const response = await axios.get(`http://localhost:3000/details/${id}`);
            setCveDetails(response.data.cve);
        } catch (error) {
            console.error("Error fetching CVE details:", error);
        }
    }

    if (!cveDetails) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container">
            <h1>{id}</h1>
            <div className="row Description">
                <h1>Description</h1>
                <p>{cveDetails.descriptions[0].value}</p>
            </div>
            <div className="metrics row">
                <h1>CVSS V2 Metrics</h1>
                <p><b>Severity: </b>{cveDetails.metrics.cvssMetricV2[0].baseSeverity}<span><b>Score:</b> {cveDetails.metrics.cvssMetricV2[0].cvssData.baseScore}</span></p>
                <p> <b> Vector String:</b> {cveDetails.metrics.cvssMetricV2[0].cvssData.vectorString}</p>
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>Access Vector</th>
                            <th>Access Complexity</th>
                            <th>Authentication</th>
                            <th>Confidentiality Impact</th>
                            <th>Integrity Impact</th>
                            <th>Availability Impact</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{cveDetails.metrics.cvssMetricV2[0].cvssData.accessVector}</td>
                            <td>{cveDetails.metrics.cvssMetricV2[0].cvssData.accessComplexity}</td>
                            <td>{cveDetails.metrics.cvssMetricV2[0].cvssData.authentication}</td>
                            <td>{cveDetails.metrics.cvssMetricV2[0].cvssData.confidentialityImpact}</td>
                            <td>{cveDetails.metrics.cvssMetricV2[0].cvssData.integrityImpact}</td>
                            <td>{cveDetails.metrics.cvssMetricV2[0].cvssData.availabilityImpact}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className="row score">
                <p><b>Exploibility Score: </b>{cveDetails.metrics.cvssMetricV2[0].exploitabilityScore}</p>
                <p><b>Impact Score: </b>{cveDetails.metrics.cvssMetricV2[0].impactScore}</p>
            </div>
            <div className="row cpe">
                <h1>Configurations</h1>
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>Criteria</th>
                            <th>Match Criteria</th>
                            <th>vulnerable</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cveDetails.configurations.map((configuration, index) => (
                            configuration.nodes.map((node, nodeIndex) => (
                                node.cpeMatch.map((match, matchIndex) => (
                                    <tr key={index + '-' + nodeIndex + '-' + matchIndex}>
                                        <td>{match.criteria}</td>
                                        <td>{match.matchCriteriaId}</td>
                                        <td>{match.vulnerable.toString()}</td>
                                    </tr>
                                ))
                            ))
                        ))}
                    </tbody>

                </table>
            </div>
        </div>
    )
}
export default CveDetails;
