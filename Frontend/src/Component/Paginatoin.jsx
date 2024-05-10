import { useState, useEffect } from 'react';
import axios from 'axios';
import {Link} from'react-router-dom'
function Pagination() {
    const [vulnerabilities, setVulnerabilities] = useState([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [resultsPerPage, setResultsPerPage] = useState(10);

    useEffect(() => {
        fetchData();
    }, [currentPage, resultsPerPage]); // Trigger fetchData when currentPage or resultsPerPage changes

    async function fetchData() {
        try {
            const response = await axios.get(`http://localhost:3000/get`);
            setTotalRecords(response.data[0].vulnerabilities.length);
            const startIndex = (currentPage - 1) * resultsPerPage;
            const endIndex = startIndex + resultsPerPage;
            setVulnerabilities(response.data[0].vulnerabilities.slice(startIndex, endIndex)); // Set vulnerabilities data for the current page
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }


    function handlePageChange(pageNumber) {
        setCurrentPage(pageNumber);
    }

    function handleResultsPerPageChange(event) {
        setResultsPerPage(parseInt(event.target.value));
        setCurrentPage(1); // Reset currentPage to 1 when resultsPerPage changes
    }

    return (
        <div className="container">
            <h2>CVE List</h2>
            <p>Total Records: {totalRecords}</p>
            <select value={resultsPerPage} onChange={handleResultsPerPageChange}>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
                {/* Add more options if needed */}
            </select>
            <table className="table table-bordered ">
                <thead>
                    <tr>
                        <th>CVE ID</th>
                        <th>Identifier</th>
                        <th>Published Date</th>
                        <th>Last Modified Date</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {vulnerabilities.map((cve, index) => (
                        <tr key = { index }>
                            <td><Link to={`/details/${cve.cve.id}`}>{cve.cve.id}</Link></td>
                                <td>{cve.cve.sourceIdentifier}</td>
                                <td>{cve.cve.published}</td>
                                <td>{cve.cve.lastModified}</td>
                                <td>{cve.cve.vulnStatus}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <nav>
                <ul className="pagination">
                    {Array.from({ length: Math.ceil(totalRecords / resultsPerPage) }, (_, i) => (
                        <li key={i + 1} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                            <button className="page-link" onClick={() => handlePageChange(i + 1)}>
                                {i + 1}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
}

export default Pagination;
