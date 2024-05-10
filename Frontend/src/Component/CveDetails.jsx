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
        <div className="container my-5">
            <h1 className='mb-4'>{id}</h1>
            <div className="row Description my-2">
                <p className='fw-bold'>Description:</p>
                <p>{cveDetails.descriptions[0].value}</p>
            </div>
            <div className="metrics row my-2">
                <p className='fw-bold'>CVSS V2 Metrics</p>
                <p><b className='me-3'>Severity:</b>{cveDetails.metrics.cvssMetricV2[0].baseSeverity} <span className='ms-5'><b className='me-3'>Score: </b>{cveDetails.metrics.cvssMetricV2[0].cvssData.baseScore}</span></p>
                <p><b className='me-3'>Vector String:</b> {cveDetails.metrics.cvssMetricV2[0].cvssData.vectorString}</p>
                <table className="table table-bordered text-center">
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
            <div className="row score my-3">
                <p className='fw-bold'>SCORE:</p>
                <p><b className='me-3'>Exploibility Score: </b>{cveDetails.metrics.cvssMetricV2[0].exploitabilityScore}</p>
                <p><b className='me-3'>Impact Score: </b>{cveDetails.metrics.cvssMetricV2[0].impactScore}</p>
            </div>
            <div className="row cpe my-3">
                <p className='fw-bold'>CPE:</p>
                <table className="table table-bordered text-center">
                    <thead>
                        <tr>
                            <th>Criteria</th>
                            <th>Match Criteria</th>
                            <th>vulnerable</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cveDetails.configurations[0].nodes[0].cpeMatch.map((match, matchIndex) => (
                            <tr key={matchIndex}>
                                <td>{match.criteria}</td>
                                <td>{match.matchCriteriaId}</td>
                                <td>{match.vulnerable ? "Yes" : "No"}</td>
                            </tr>
                        ))
                        }
                    </tbody>

                </table>
            </div>
        </div>
    )
}
export default CveDetails;
