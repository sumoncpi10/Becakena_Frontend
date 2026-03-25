import { getUser } from "../utils/auth";
import AdminDashboard from "./AdminDashboard";
import VendorDashboard from "./VendorDashboard";
import UserDashboard from "./UserDashboard";

const Dashboard = () => {
  const user = getUser();

  if (!user) return <h2>Please login</h2>;

  if (user.role === "admin") return <AdminDashboard />;
  if (user.role === "vendor") return <VendorDashboard />;
  return <UserDashboard />;
};

export default Dashboard;