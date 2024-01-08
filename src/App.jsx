import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";
import GlobalStyles from "./styles/GlobalStyles";

import Home from "./pages/Home";
import Rooms from "./pages/Rooms";
import RoomsDetail from "./pages/RoomsDetail";
import Contactus from "./pages/Contactus";
import Signin from "./pages/Signin";
import { default as ClientLogin } from "./pages/Login";

import AppLayout from "./ui/AppLayout";
import ProtectedRote from "./ui/ProtectedRote";
import Dashboard from "./pages/employee/Dashboard";
import Login from "./pages/employee/Login";
import Account from "./pages/employee/Account";
import Bookings from "./pages/employee/Bookings";
import Settings from "./pages/employee/Settings";
import Users from "./pages/employee/Users";
import Cabins from "./pages/employee/Cabins";
import PageNotFound from "./pages/employee/PageNotFound";
import Booking from "./pages/employee/Booking";
import Checkin from "./pages/employee/Checkin";

import { DarkModeProvider } from "./context/DarkModeContext";
import AppLayoutClient from "./ui/AppLayoutClient";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // staleTime: 60 * 1000
      staleTime: 0,
    },
  },
});

function App() {
  return (
    <DarkModeProvider>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <GlobalStyles />
        <BrowserRouter>
          <Routes>
            <Route index element={<Home />} />
            <Route element={<AppLayoutClient />}>
              <Route path="/rooms">
                <Route index element={<Rooms />} />
                <Route path=":roomId" element={<RoomsDetail />} />
              </Route>
              <Route path="/contactus" element={<Contactus />} />
              <Route path="/signin" element={<Signin />} />
              <Route path="/login" element={<ClientLogin />} />
            </Route>

            <Route path="/employee">
              <Route
                element={
                  <ProtectedRote>
                    <AppLayout />
                  </ProtectedRote>
                }
              >
                <Route index element={<Navigate replace to="dashboard" />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="account" element={<Account />} />
                <Route path="bookings" element={<Bookings />} />
                <Route path="bookings/:bookingId" element={<Booking />} />
                <Route path="checkin/:bookingId" element={<Checkin />} />
                <Route path="settings" element={<Settings />} />
                <Route path="users" element={<Users />} />
                <Route path="cabins" element={<Cabins />} />
              </Route>
              <Route path="login" element={<Login />} />
            </Route>

            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </BrowserRouter>

        <Toaster
          position="top-center"
          gutter={12}
          containerStyle={{ margin: "8px" }}
          toastOptions={{
            success: {
              duration: 3000,
            },
            error: {
              duration: 5000,
            },
            style: {
              fontSize: "16px",
              maxWidth: "500px",
              padding: "16px 24px",
              backgroundColor: "var('--color-grey-0')",
              color: "var('--color-grey-700')",
            },
          }}
        />
      </QueryClientProvider>
    </DarkModeProvider>
  );
}

export default App;
