import React from "react";
import SystemList from "../../components/admin/SystemList";

const SystemsPage: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Sistem Yönetimi</h1>
      <SystemList />
    </div>
  );
};

export default SystemsPage;
