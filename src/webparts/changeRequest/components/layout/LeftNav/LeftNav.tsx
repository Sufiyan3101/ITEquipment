import * as React from "react";
import styles from "./LeftNav.module.scss";
import { ChevronDown12Regular, ChevronRight12Regular } from "@fluentui/react-icons";
import { useNavigate } from "react-router-dom";

interface ILeftNavProps {
  isOpen: boolean;
  onClose: () => void;
}

const LeftNav = ({ isOpen, onClose }: ILeftNavProps) => {
  const [openMenu, setOpenMenu] = React.useState<string | null>("ChangeRequest");
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
      <div className={styles.logoSection}>
        Change Request
      </div>

      <div className={styles.navItem} onClick={() => handleNavigation("/")}>
        Home
      </div>

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
          <div className={styles.subMenuItem} onClick={() => handleNavigation("/")}>
            Dashboard
          </div>
          <div className={styles.subMenuItem} onClick={() => handleNavigation("/create-request")}>
            Create Request
          </div>
        </div>
      )}

      <div className={styles.navItem} onClick={() => handleNavigation("/my-tasks")}>
        My Tasks
      </div>
    </div>
  );
};

export default LeftNav;