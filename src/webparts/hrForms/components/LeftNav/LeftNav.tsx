// import * as React from "react";
// import styles from "./LeftNav.module.scss";
// import { ChevronDown12Regular, ChevronRight12Regular } from "@fluentui/react-icons";
// import { useNavigate } from "react-router-dom";

// interface ILeftNavProps {
//   isOpen: boolean;
//   onClose: () => void;
// }


// const LeftNav = ({ isOpen, onClose }: ILeftNavProps) => {
//   const [openMenu, setOpenMenu] = React.useState<string | null>("Add");

//   const navigate = useNavigate();

//   const toggleMenu = (menu: string) => {
//     setOpenMenu(openMenu === menu ? null : menu);
//   };


//   return (
//     <div className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ""
//       }`}>

//       <div className={styles.logoSection}>
//         IT Equipment
//       </div>

//       <div className={styles.navItem}>
//         Home
//       </div>

//       <div
//         className={styles.navItem}
//         onClick={() => toggleMenu("Add")}
//       >
//         <span>Memo</span>

//         {openMenu === "Add" ? (
//           <ChevronDown12Regular />
//         ) : (
//           <ChevronRight12Regular />
//         )}
//       </div>

//       {openMenu === "Add" && (
//         <div className={styles.subMenu}>
//           <div className={styles.subMenuItem} onClick={() => navigate('/')}>
//             Dashboard
//           </div>

//           <div className={styles.subMenuItem} onClick={() => navigate('/task-dashboard')}>
//             Task Dashboard
//           </div>
//         </div>
//       )}

//       <div className={styles.navItem}>
//         My Tasks
//       </div>

//     </div>
//   );
// };

// export default LeftNav;




import * as React from "react";
import styles from "./LeftNav.module.scss";
import { ChevronDown12Regular, ChevronRight12Regular } from "@fluentui/react-icons";
import { useNavigate } from "react-router-dom";

interface ILeftNavProps {
  isOpen: boolean;
  onClose: () => void;
}

const LeftNav = ({ isOpen, onClose }: ILeftNavProps) => {
  const [openMenu, setOpenMenu] = React.useState<string | null>("ITEquipment");
  const navigate = useNavigate();

  const toggleMenu = (menu: string) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    if (window.innerWidth <= 768) {
      onClose();
    }
  };

  return (
    <div className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ""}`}>
      {/* Logo Section */}
      <div className={styles.logoSection}>
        HR Portal
      </div>

      {/* Home Menu */}
      <div className={styles.navItem} onClick={() => handleNavigation("/")}>
        Home
      </div>

      {/* ========== IT EQUIPMENT MENU ========== */}
      <div className={styles.navItem} onClick={() => toggleMenu("ITEquipment")}>
        <span>IT Equipment</span>
        {openMenu === "ITEquipment" ? (
          <ChevronDown12Regular />
        ) : (
          <ChevronRight12Regular />
        )}
      </div>

      {openMenu === "ITEquipment" && (
        <div className={styles.subMenu}>
          <div className={styles.subMenuItem} onClick={() => handleNavigation("/")}>
            Dashboard
          </div>
          <div className={styles.subMenuItem} onClick={() => handleNavigation("/create-request")}>
            Create Request
          </div>
          <div className={styles.subMenuItem} onClick={() => handleNavigation("/task-dashboard")}>
            Task Dashboard
          </div>
        </div>
      )}

      {/* ========== CHANGE REQUEST MENU ========== */}
      <div className={styles.navItem} onClick={() => toggleMenu("ChangeRequest")}>
        <span>Change Request</span>
        {openMenu === "ChangeRequest" ? (
          <ChevronDown12Regular />
        ) : (
          <ChevronRight12Regular />
        )}
      </div>

      {openMenu === "ChangeRequest" && (
        <div className={styles.subMenu}>
          <div className={styles.subMenuItem} onClick={() => handleNavigation("/change-request")}>
            Dashboard
          </div>
          <div className={styles.subMenuItem} onClick={() => handleNavigation("/create-change-request")}>
            Create Request
          </div>
          <div className={styles.subMenuItem} onClick={() => handleNavigation("/cr-task-dashboard")}>
            Task Dashboard
          </div>
        </div>
      )}

      {/* ========== MY TASKS (Combined) ========== */}
      <div className={styles.navItem} onClick={() => toggleMenu("MyTasks")}>
        <span>My Tasks</span>
        {openMenu === "MyTasks" ? (
          <ChevronDown12Regular />
        ) : (
          <ChevronRight12Regular />
        )}
      </div>

      {openMenu === "MyTasks" && (
        <div className={styles.subMenu}>
          <div className={styles.subMenuItem} onClick={() => handleNavigation("/task-dashboard")}>
            IT Equipment Tasks
          </div>
          <div className={styles.subMenuItem} onClick={() => handleNavigation("/cr-task-dashboard")}>
            Change Request Tasks
          </div>
        </div>
      )}
    </div>
  );
};

export default LeftNav;