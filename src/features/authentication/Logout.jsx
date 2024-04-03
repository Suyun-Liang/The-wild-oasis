import { HiArrowRightOnRectangle } from "react-icons/hi2";
import ButtonIcon from "../../ui/ButtonIcon";
import useLogout from "./useLogout";
import SpinnerMini from "../../ui/SpinnerMini";
import { useNavigate } from "react-router-dom";

function Logout() {
  const { logout, isLoggingOut } = useLogout();
  const navigate = useNavigate();
  return (
    <ButtonIcon
      onClick={() =>
        logout("", {
          onSuccess: () => navigate("login", { replace: true }),
        })
      }
      disabled={isLoggingOut}
    >
      {!isLoggingOut ? <HiArrowRightOnRectangle /> : <SpinnerMini />}
    </ButtonIcon>
  );
}

export default Logout;
