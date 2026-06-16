import { lazy } from "react";
import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";

const DashboardPage = lazy(() => import("./components/dashboard/DashboardPage").then(m => ({ default: m.DashboardPage })));
const ShipmentList = lazy(() => import("./components/shipments/ShipmentList").then(m => ({ default: m.ShipmentList })));
const TripTrackingPage = lazy(() => import("./components/trips/TripTrackingPage").then(m => ({ default: m.TripTrackingPage })));
const VehicleTrackingPage = lazy(() => import("./components/vehicle-tracking/VehicleTrackingPage").then(m => ({ default: m.VehicleTrackingPage })));
const PlaceholderPage = lazy(() => import("./components/PlaceholderPage").then(m => ({ default: m.PlaceholderPage })));
const DriversPage = lazy(() => import("./components/drivers/DriversPage").then(m => ({ default: m.DriversPage })));
const VehiclesPage = lazy(() => import("./components/Vechicles_Mgmt/VehiclesPage").then(m => ({ default: m.VehiclesPage })));
const ReportsPage = lazy(() => import("./components/ReportsPage").then(m => ({ default: m.ReportsPage })));
const ExpensesPage = lazy(() => import("./components/expenses/ExpensesPage").then(m => ({ default: m.ExpensesPage })));
const InvoicesPage = lazy(() => import("./components/invoices/InvoicesPage").then(m => ({ default: m.InvoicesPage })));
const SettingsPage = lazy(() => import("./components/settings/SettingsPage").then(m => ({ default: m.SettingsPage })));
const HelpSupportPage = lazy(() => import("./components/HelpSupportPage").then(m => ({ default: m.HelpSupportPage })));

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: DashboardPage },
      { path: "shipments", Component: ShipmentList },
      { path: "trips", Component: TripTrackingPage },
      { path: "tracking/:vehicleId", Component: VehicleTrackingPage },
      { path: "diesel", Component: PlaceholderPage },
      { path: "vehicles", Component: VehiclesPage },
      { path: "drivers", Component: DriversPage },
      { path: "reports", Component: ReportsPage },
      { path: "invoices", Component: InvoicesPage },
      { path: "expenses", Component: ExpensesPage },
      { path: "settings", Component: SettingsPage },
      { path: "help", Component: HelpSupportPage },
      { path: "*", Component: PlaceholderPage },
    ],
  },
]);
