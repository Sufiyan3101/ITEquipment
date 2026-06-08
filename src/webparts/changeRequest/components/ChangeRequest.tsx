// import * as React from "react";
// import MainLayout from "./layout/MainLayout";
// import Dashboard from "./Dashboard/Dashboard";
// import InputForm from "./InputForm/InputForm";
// import ViewForm from "./ViewForm/ViewForm";
// import { HashRouter, Routes, Route } from "react-router-dom";

// const ChangeRequest = () => {
//   return (
//     <HashRouter>
//       <MainLayout>
//         <Routes>
//           <Route path="/" element={<Dashboard />} />
//           <Route path="/create-request" element={<InputForm />} />
//           <Route path="/view-form/:id" element={<ViewForm />} />
//           <Route path="/my-tasks" element={<Dashboard />} />
//         </Routes>
//       </MainLayout>
//     </HashRouter>
//   );
// };

// export default ChangeRequest;\


import * as React from "react";
import MainLayout from "./layout/MainLayout";
import Dashboard from "./Dashboard/Dashboard";
import InputForm from "./InputForm/InputForm";
import ViewForm from "./ViewForm/ViewForm";
import TaskDashboard from "./TaskDashboard/TaskDashboard";
import TaskViewForm from "./TaskViewForm/TaskViewForm";
import { HashRouter, Routes, Route } from "react-router-dom";

const ChangeRequest = () => {
  return (
    <HashRouter>
      <MainLayout>
        <Routes>
          {/* Change Request Routes */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/create-request" element={<InputForm />} />
          <Route path="/view-form/:id" element={<ViewForm />} />
          
          {/* Task Approval Routes */}
          <Route path="/task-dashboard" element={<TaskDashboard />} />
          <Route path="/task-view/:id" element={<TaskViewForm />} />
        </Routes>
      </MainLayout>
    </HashRouter>
  );
};

export default ChangeRequest;