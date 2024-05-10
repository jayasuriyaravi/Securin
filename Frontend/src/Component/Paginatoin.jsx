import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
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
            const response = await axios.get(`http://localhost:3000/send`);
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

    const totalPages = Math.ceil(totalRecords / resultsPerPage);


    return (
        <div className="container my-5 ">
            <h2 className='text-center'>CVE List</h2><br />
            <p ><b>Total Records: {totalRecords}</b></p>
            <table className="table table-bordered text-center">
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
                        <tr key={index}>
                            <td><Link to={`/cves/${cve.cve.id}`} className="link-custom">{cve.cve.id}</Link></td>
                            <td><Link to={`/cves/${cve.cve.id}`} className="link-custom">{cve.cve.sourceIdentifier}</Link></td>
                            <td><Link to={`/cves/${cve.cve.id}`} className="link-custom">{cve.cve.published}</Link></td>
                            <td><Link to={`/cves/${cve.cve.id}`} className="link-custom">{cve.cve.lastModified}</Link></td>
                            <td><Link to={`/cves/${cve.cve.id}`} className="link-custom">{cve.cve.vulnStatus}</Link></td>
                        </tr>
                    ))}
                </tbody>

            </table>
            <div className="row">
                <div className="col-2">
                    <select id="inputState" className="form-select" value={resultsPerPage} onChange={handleResultsPerPageChange} >
                        <option selected value="10">10</option>
                        <option value="20">20</option>
                        <option value="50">50</option>
                    </select>
                </div>
                {/* <div className="col">
                    {totalRecords}
                </div> */}
                <div className='col-6 ms-auto '>
                    <ul className="pagination">
                        <li>
                            <button className="page-link" onClick={() => handlePageChange(currentPage > 1 ? currentPage - 1 : currentPage == 1)}>Previous</button>
                        </li>
                        {Array.from({ length: Math.min(totalPages, 4) }, (_, i) => (
                            <li key={i + 1}>
                                <button className="page-link" onClick={() => handlePageChange(i + 1)}>
                                    {i + 1}
                                </button>
                            </li>
                        ))}
                        {currentPage > 4 && (
                            <li>
                                <button className="page-link" onClick={() => handlePageChange(currentPage)}>{currentPage}</button>
                            </li>
                        )}
                        <li>
                            <button className="page-link">....</button>
                        </li>
                        <li>
                            <button className="page-link" onClick={() => handlePageChange(totalPages)}>{totalPages}</button>
                        </li>
                        <li>
                            <button className="page-link" onClick={() => handlePageChange(currentPage < totalPages ? currentPage + 1 : currentPage)}>Next</button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Pagination;
