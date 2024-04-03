import styled from "styled-components";
import { useNavigate } from "react-router-dom";

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

function ProtectedRote({ children }) {
  const navigate = useNavigate();
  //1.Load the authenticated user
  const { user, isLoading, isAuthenticated, isAdmin } = useUser();
  //2.If no authenticated user, redirect to "./login"
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !isAdmin)) {
      toast.error("user is not authenticated");
      navigate("login");
    }
  }, [isAuthenticated, isLoading, navigate, isAdmin]);

  //3.While loading, show a spinner
  if (isLoading)
    return (
      <FullPage>
        <Spinner />
      </FullPage>
    );
  //4.If there is authenticated user, then render the app
  if (isAuthenticated) return children;
}

export default ProtectedRote;
