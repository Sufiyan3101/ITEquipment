



import * as React from "react";
import styles from "./CRTaskDashboard.module.scss";
import TaskService from "../services/TaskService";
import { ITaskItem } from "../models/ITaskItem";
import { useNavigate } from "react-router-dom";

const ITEMS_PER_PAGE = 10;

const CRTaskDashboard = () => {
  const [tasks, setTasks] = React.useState<ITaskItem[]>([]);
  const [searchText, setSearchText] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const navigate = useNavigate();

  const loadData = async (): Promise<void> => {
    try {
      setLoading(true);
      const data = await TaskService.getMyTasks();
      setTasks(data || []);
    } catch (error) {
      console.error("Error loading tasks:", error);
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

  const filteredTasks = tasks.filter((item) => {
    const search = searchText.toLowerCase().trim();
    if (!search) return true;
    return (
      (item.ChangeRequestID?.toLowerCase().includes(search) || false) ||
      (item.System?.toLowerCase().includes(search) || false)
    );
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredTasks.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedItems = filteredTasks.slice(startIndex, endIndex);

  // Generate page numbers to display
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

  const getRoleBadgeClass = (role: string | undefined): string => {
    switch(role) {
      case "HeadOfDepartment": return styles.roleHOD;
      case "HODIT": return styles.roleHODIT;
      case "ITStaff": return styles.roleITStaff;
      default: return styles.roleDefault;
    }
  };

  const getRoleDisplayName = (role: string | undefined): string => {
    switch(role) {
      case "HeadOfDepartment": return "HOD";
      case "HODIT": return "HOD - IT";
      case "ITStaff": return "IT Staff";
      default: return role || "N/A";
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
        <div className={styles.title}>CHANGE REQUEST TASKS</div>
        <div className={styles.logo}>
          <img src={require("../../assets/AlubafHeaderLogo.png")} alt="logo" />
        </div>
      </div>

      <div className={styles.toolbar}>
        <input
          type="text"
          placeholder="Search by Request ID & System..."
          className={styles.searchBox}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <button className={styles.refreshBtn} onClick={loadData} disabled={loading}>
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Request ID</th>
              <th>Full Name</th>
              <th>Department</th>
              <th>System</th>
              <th>Requirement</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedItems.length === 0 ? (
              <tr>
                <td colSpan={9} className={styles.noData}>No pending tasks</td>
              </tr>
            ) : (
              paginatedItems.map((item) => (
                <tr key={item.ID} className={styles.tableRow}>
                  <td>{item.ChangeRequestID || "N/A"}</td>
                  <td>{item.EmployeeName || "N/A"}</td>
                  <td>{item.Department || "N/A"}</td>
                  <td>{item.System || "N/A"}</td>
                  <td className={styles.requirementCell}>
                    {(item.UserRequirement || "N/A").substring(0, 30)}
                    {((item.UserRequirement || "").length > 30) ? "..." : ""}
                  </td>
                  <td>
                    <span className={`${styles.priorityBadge} ${getPriorityClass(item.UserRequirementPriority)}`}>
                      {item.UserRequirementPriority || "N/A"}
                    </span>
                  </td>
                  <td>
                    <span className={styles.statusPending}>Pending</span>
                  </td>
                  <td>
                    <span className={`${styles.roleBadge} ${getRoleBadgeClass(item.RoleLevel)}`}>
                      {getRoleDisplayName(item.RoleLevel)}
                    </span>
                  </td>
                  <td>
                    <button 
                      className={styles.actionBtn} 
                      onClick={() => navigate(`/task-view/${item.ID}`)}
                    >
                      Action
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
        Showing {startIndex + 1}–{Math.min(endIndex, filteredTasks.length)} of {filteredTasks.length} records
      </div>

    </div>
  );
};

export default CRTaskDashboard;