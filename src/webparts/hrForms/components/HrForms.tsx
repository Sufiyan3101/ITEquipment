import * as React from "react";

import MainLayout from "./layout/MainLayout";
import Dashboard from "./Dashboard/Dashboard";
import InputForm from "./InputForm/InputForm";
import ViewForm from "./ViewForm/ViewForm";

import { HashRouter, Routes, Route } from "react-router-dom";

const HRForm = () => {

  return (
   <HashRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/create-request" element={<InputForm />} />
          <Route path="/view-form/:id" element={<ViewForm />} />
        </Routes>
      </MainLayout>
    </HashRouter>
  );
};

export default HRForm;