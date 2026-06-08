import * as React from "react";
import styles from "./LeftNav.module.scss";
import { ChevronDown12Regular, ChevronRight12Regular } from "@fluentui/react-icons";
import { useNavigate } from "react-router-dom";

interface ILeftNavProps {
  isOpen: boolean;
  onClose: () => void;
}


const LeftNav = ({ isOpen, onClose }: ILeftNavProps) => {
  const [openMenu, setOpenMenu] = React.useState<string | null>("Add");

  const navigate = useNavigate();

  const toggleMenu = (menu: string) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };


  return (
    <div className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ""
      }`}>

      <div className={styles.logoSection}>
        IT Equipment
      </div>

      <div className={styles.navItem}>
        Home
      </div>

      <div
        className={styles.navItem}
        onClick={() => toggleMenu("Add")}
      >
        <span>Memo</span>

        {openMenu === "Add" ? (
          <ChevronDown12Regular />
        ) : (
          <ChevronRight12Regular />
        )}
      </div>

      {openMenu === "Add" && (
        <div className={styles.subMenu}>
          <div className={styles.subMenuItem} onClick={() => navigate('/')}>
            Dashboard
          </div>

          <div className={styles.subMenuItem} onClick={() => navigate('/task-dashboard')}>
            Task Dashboard
          </div>
        </div>
      )}

      <div className={styles.navItem}>
        My Tasks
      </div>

    </div>
  );
};

export default LeftNav;