import * as React from "react";
import styles from "./Dashboard.module.scss";
import ChangeRequestService from "../services/ChangeRequestService";
import { IChangeRequest } from "../models/IChangeRequest";
import { useNavigate } from "react-router-dom";

const ITEMS_PER_PAGE = 10;

const Dashboard = () => {
  const [requests, setRequests] = React.useState<IChangeRequest[]>([]);
  const [searchText, setSearchText] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);
  const [currentPage, setCurrentPage] = React.useState<number>(1);

  const navigate = useNavigate();

  const loadData = async (): Promise<void> => {
    try {
      setLoading(true);
      const data = await ChangeRequestService.getAllRequests();
      setRequests(data || []);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadData();
  }, []);

  // Reset to page 1 when search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchText]);

  // Filter data based on search
  const filteredRequests = React.useMemo(() => {
    const search = searchText.toLowerCase().trim();
    if (!search) return requests;
    
    return requests.filter((item) => {
      return (
        (item.Change_x0020_Request_x0020_ID?.toLowerCase().includes(search) || false) ||
        (item.User_x0020_Requirement?.toLowerCase().includes(search) || false) ||
        (item.User_x0020_Requirement_x0020_Pri?.toLowerCase().includes(search) || false) ||
        (item.System?.toLowerCase().includes(search) || false) ||
        (item.ApprovalStatus?.toLowerCase().includes(search) || false)
      );
    });
  }, [requests, searchText]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredRequests.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedItems = filteredRequests.slice(startIndex, endIndex);

  // Generate page numbers to display (like screenshot: 1 2 3 4 ... >>)
  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }

    return pages;
  };

  const getStatusClass = (status: string | undefined): string => {
    switch(status) {
      case "Request Completed": return styles.statusCompleted;
      case "Pending with HOD": return styles.statusPendingHOD;
      case "Pending with HODIT": return styles.statusPendingIT;
      default: return styles.statusDefault;
    }
  };

  const getPriorityClass = (priority: string | undefined): string => {
    switch(priority) {
      case "High": return styles.priorityHigh;
      case "Medium": return styles.priorityMedium;
      default: return styles.priorityLow;
    }
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <div className={styles.title}>CHANGE REQUEST DASHBOARD</div>
        <div className={styles.logo}>
          <img src={require("../../assets/AlubafHeaderLogo.png")} alt="logo" />
        </div>
      </div>

      <div className={styles.toolbar}>
        <input
          type="text"
          placeholder="Search by Request ID, Requirement, Priority, System & Status..."
          className={styles.searchBox}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <button className={styles.refreshBtn} onClick={loadData} disabled={loading}>
          {loading ? "Refreshing..." : "Refresh"}
        </button>
        <button className={styles.addBtn} onClick={() => navigate("/create-request")}>
          Add New Request
        </button>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Request ID</th>
              <th>Title</th>
              <th>First Name</th>
              <th>Staff No</th>
              <th>Department</th>
              <th>System</th>
              <th>Requirement</th>
              <th>Priority</th>
              <th>Status</th>
              <th>View</th>
            </tr>
          </thead>
          <tbody>
            {paginatedItems.length === 0 ? (
              <tr>
                <td colSpan={10} className={styles.noData}>No records found</td>
              </tr>
            ) : (
              paginatedItems.map((item) => (
                <tr key={item.ID} className={styles.tableRow}>
                  <td>{item.Change_x0020_Request_x0020_ID || "N/A"}</td>
                  <td>{item.Title || "N/A"}</td>
                  <td>{item.First_x0020_Name || "N/A"}</td>
                  <td>{item.Staff_x0020_No || "N/A"}</td>
                  <td>{item.Department || "N/A"}</td>
                  <td>{item.System || "N/A"}</td>
                  <td className={styles.requirementCell}>
                    {(item.User_x0020_Requirement || "N/A").substring(0, 35)}
                    {(item.User_x0020_Requirement?.length || 0) > 35 ? "..." : ""}
                  </td>
                  <td>
                    <span className={`${styles.priorityBadge} ${getPriorityClass(item.User_x0020_Requirement_x0020_Pri)}`}>
                      {item.User_x0020_Requirement_x0020_Pri || "N/A"}
                    </span>
                  </td>
                  <td>
                    <span className={`${styles.statusBadge} ${getStatusClass(item.ApprovalStatus)}`}>
                      {item.ApprovalStatus || "N/A"}
                    </span>
                  </td>
                  <td>
                    <button
                      className={styles.viewBtn}
                      onClick={() => navigate(`/view-form/${item.ID}`)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className={styles.pagination}>

          {/* << First */}
          <button
            className={styles.pageBtn}
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
          >
            {"<<"}
          </button>

          {/* < Prev */}
          <button
            className={styles.pageBtn}
            onClick={() => setCurrentPage((p) => p - 1)}
            disabled={currentPage === 1}
          >
            {"<"}
          </button>

          {/* Page Numbers */}
          {getPageNumbers().map((page, index) =>
            page === "..." ? (
              <span key={`ellipsis-${index}`} className={styles.ellipsis}>
                ...
              </span>
            ) : (
              <button
                key={`page-${page}`}
                className={`${styles.pageBtn} ${currentPage === page ? styles.activePage : ""}`}
                onClick={() => setCurrentPage(page as number)}
              >
                {page}
              </button>
            )
          )}

          {/* > Next */}
          <button
            className={styles.pageBtn}
            onClick={() => setCurrentPage((p) => p + 1)}
            disabled={currentPage === totalPages}
          >
            {">"}
          </button>

          {/* >> Last */}
          <button
            className={styles.pageBtn}
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
          >
            {">>"}
          </button>

        </div>
      )}

      {/* Record count info */}
      <div className={styles.pageInfo}>
        Showing {startIndex + 1}–{Math.min(endIndex, filteredRequests.length)} of {filteredRequests.length} records
      </div>

    </div>
  );
};

export default Dashboard;