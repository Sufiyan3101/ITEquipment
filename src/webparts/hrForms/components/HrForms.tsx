// import * as React from "react";

// import MainLayout from "./layout/MainLayout";
// import Dashboard from "./Dashboard/Dashboard";
// import InputForm from "./InputForm/InputForm";
// import ViewForm from "./ViewForm/ViewForm";
// import TaskDashboard from "./TaskDashboard/TaskDashboard";

// import { HashRouter, Routes, Route } from "react-router-dom";

// const HRForm = () => {

//   return (
//    <HashRouter>
//       <MainLayout>
//         <Routes>
//           <Route path="/" element={<Dashboard />} />
//           <Route path="/create-request" element={<InputForm />} />
//           <Route path="/view-form/:id" element={<ViewForm />} />
//           <Route path="/task-dashboard" element={<TaskDashboard />} />
//         </Routes>
//       </MainLayout>
//     </HashRouter>
//   );
// };

// export default HRForm;



import * as React from "react";
import MainLayout from "./layout/MainLayout";

// ========== IT EQUIPMENT COMPONENTS ==========
import Dashboard from "./Dashboard/Dashboard";
import InputForm from "./InputForm/InputForm";
import ViewForm from "./ViewForm/ViewForm";
import TaskDashboard from "./TaskDashboard/TaskDashboard";
// import TaskViewForm from "./TaskViewForm/TaskViewForm";

// ========== CHANGE REQUEST COMPONENTS ==========
import ChangeRequestDashboard from "./Dashboard/CRDashboard";
import ChangeRequestInputForm from "./InputForm/CRInputForm";
import ChangeRequestViewForm from "./ViewForm/CRViewForm";
import CRTaskDashboard from "./TaskDashboard/CRTaskDashboard";
import CRTaskViewForm from "./TaskViewForm/CRTaskViewForm";

import { HashRouter, Routes, Route } from "react-router-dom";

const HRForm = () => {
  return (
    <HashRouter>
      <MainLayout>
        <Routes>
          {/* ========== IT EQUIPMENT ROUTES ========== */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/create-request" element={<InputForm />} />
          <Route path="/view-form/:id" element={<ViewForm />} />
          <Route path="/task-dashboard" element={<TaskDashboard />} />
          {/* <Route path="/task-view/:id" element={<TaskViewForm />} /> */}
          
          {/* ========== CHANGE REQUEST ROUTES ========== */}
          <Route path="/change-request" element={<ChangeRequestDashboard />} />
          <Route path="/create-change-request" element={<ChangeRequestInputForm />} />
          <Route path="/view-change-request/:id" element={<ChangeRequestViewForm />} />
          <Route path="/cr-task-dashboard" element={<CRTaskDashboard />} />
          <Route path="/cr-task-view/:id" element={<CRTaskViewForm />} />
        </Routes>
      </MainLayout>
    </HashRouter>
  );
};

export default HRForm;