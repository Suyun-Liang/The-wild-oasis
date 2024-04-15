import styled from "styled-components";
import { Outlet, useNavigate } from "react-router-dom";

import Spinner from "./Spinner";

import useUser from "../features/authentication/useUser";
import { useEffect } from "react";
import toast from "react-hot-toast";

const FullPage = styled.div`
  height: 100vh;
  background-color: var(--color-grey-50);
  display: flex;
  justify-content: center;
  align-items: center;
`;

function ProtectedUserRote() {
  const navigate = useNavigate();
  //1.Load the authenticated user
  const { user, isLoading, isAuthenticated } = useUser();
  //2.If no authenticated user, redirect to "user not found" page
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("*");
    }
  }, [isAuthenticated, isLoading, navigate]);

  //3.While loading, show a spinner
  if (isLoading)
    return (
      <FullPage>
        <Spinner />
      </FullPage>
    );
  //4.If there is authenticated user, then render the app
  if (isAuthenticated) return <Outlet />;
}

export default ProtectedUserRote;
