import * as React from "react";
import styles from "./Dashboard.module.scss";
import ITEquipmentService from "../services/ITEquipmentService";
import { IITEquipment } from "../models/IITEquipments";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {

  const [ITEquipments, setITEquipments] = React.useState<IITEquipment[]>([]);
  const [searchText, setSearchText] = React.useState<string>("");
  const [loading, setLoading] = React.useState(false);

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
  }, [])

  const filteredITEquipments = ITEquipments.filter((item) => {
    const search = searchText.toLowerCase().trim();

    return (
      item.ITEquipmentRequestID
        ?.toString()
        .toLowerCase()
        .indexOf(search) > -1 ||
      item.ApprovalStatus
        ?.toLowerCase()
        .indexOf(search) > -1
    );
  });

  return (
    <div className={styles.dashboard}>

      <div className={styles.header}>

        <div className={styles.title}>
          IT EQUIPMENT DASHBOARD
        </div>

        <div className={styles.logo}>
          <img
            src={require("../assests/AlubafHeaderLogo.png")}
            alt="logo"
          />
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

        <button
          className={styles.refreshBtn}
          onClick={loadData}
          disabled={loading}
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>

        <button
          className={styles.addBtn}
          onClick={() => navigate("/create-request")}
        >
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

            {filteredITEquipments.map((item) => (
              <tr key={item.ITEquipmentRequestID}>
                <td>{item.ITEquipmentRequestID}</td>
                <td>{item.FirstName}</td>
                <td>{item.StaffNo}</td>
                <td>{item.Department}</td>
                <td>{item.Date}</td>
                <td>{item.RequestType}</td>
                <td>{item.ApprovalStatus}</td>
                <td>
                  <button className={styles.viewBtn} onClick={() => navigate(`/view-form/${item.ID}`)}>
                    View
                  </button>
                </td>
              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default Dashboard;