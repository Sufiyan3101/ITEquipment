import * as React from "react";
import styles from "./Dashboard.module.scss";
import ITEquipmentService from "../services/ITEquipmentService";
import { IITEquipment } from "../models/IITEquipments";
import { useNavigate } from "react-router-dom";

const ITEMS_PER_PAGE = 10;

const Dashboard = () => {
  const [ITEquipments, setITEquipments] = React.useState<IITEquipment[]>([]);
  const [searchText, setSearchText] = React.useState<string>("");
  const [loading, setLoading] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState<number>(1);

  const navigate = useNavigate();

  const loadData = async (): Promise<void> => {
    try {
      setLoading(true);
      const data = await ITEquipmentService.getITEquipmentData();
      setITEquipments(data);
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

  const filteredITEquipments = ITEquipments.filter((item) => {
    const search = searchText.toLowerCase().trim();
    return (
      item.ITEquipmentRequestID?.toString().toLowerCase().indexOf(search) > -1 ||
      item.ApprovalStatus?.toLowerCase().indexOf(search) > -1
    );
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredITEquipments.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedItems = filteredITEquipments.slice(startIndex, endIndex);

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

  return (
    <div className={styles.dashboard}>

      <div className={styles.header}>
        <div className={styles.title}>IT EQUIPMENT DASHBOARD</div>
        <div className={styles.logo}>
          <img src={require("../assests/AlubafHeaderLogo.png")} alt="logo" />
        </div>
      </div>

      <div className={styles.toolbar}>
        <input
          type="text"
          placeholder="Search by Request ID or Approval Status..."
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
              <th>Memo ID</th>
              <th>Title</th>
              <th>Full Name</th>
              <th>Classification</th>
              <th>Memo Note</th>
              <th>Date</th>
              <th>Status</th>
              <th>View</th>
            </tr>
          </thead>
          <tbody>
            {paginatedItems.map((item) => (
              <tr key={item.ITEquipmentRequestID} className={styles.tableRow}>
                <td>{item.ITEquipmentRequestID}</td>
                <td>{item.FirstName}</td>
                <td>{item.StaffNo}</td>
                <td>{item.Department}</td>
                <td>{item.Date}</td>
                <td>{item.RequestType}</td>
                <td>{item.ApprovalStatus}</td>
                <td>
                  <button
                    className={styles.viewBtn}
                    onClick={() => navigate(`/view-form/${item.ID}`)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
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
        Showing {startIndex + 1}–{Math.min(endIndex, filteredITEquipments.length)} of {filteredITEquipments.length} records
      </div>

    </div>
  );
};

export default Dashboard;