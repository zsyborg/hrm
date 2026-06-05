import { getApplications, getJobOrders } from "./lib/mongo";
import HomePage from "./home-client";

export default async function Page() {
  try {
    const applications = await getApplications();
    const jobOrders = await getJobOrders();
    return <HomePage applications={JSON.parse(JSON.stringify(applications))} jobOrders={JSON.parse(JSON.stringify(jobOrders))} />;
  } catch (error) {
    return (
      <div className="p-8 bg-slate-50 min-h-screen">
        <div className="bg-red-100 p-4 rounded">
          <h2 className="font-bold">Database connection error</h2>
          <p className="text-sm">Please ensure MongoDB Atlas is configured correctly in .env</p>
        </div>
      </div>
    );
  }
}