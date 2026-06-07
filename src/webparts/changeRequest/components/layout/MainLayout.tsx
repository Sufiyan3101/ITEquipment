import * as React from "react";
import { useState } from "react";
import styles from "./MainLayout.module.scss";
import LeftNav from "./LeftNav/LeftNav";

interface IMainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: IMainLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className={styles.layout}>
      <LeftNav
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className={styles.contentArea}>
        <div className={styles.mobileHeader}>
          <button
            className={styles.menuBtn}
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            ☰
          </button>
          <span className={styles.mobileTitle}>Change Request</span>
        </div>

        <div className={styles.pageContent}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;