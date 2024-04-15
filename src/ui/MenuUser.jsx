import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { HiOutlineBars3, HiUserCircle } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import Modal from "./Modal";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import SpinnerMini from "./SpinnerMini";

import useUser from "../features/authentication/useUser";
import Logout from "../features/authentication/Logout";
import useLogout from "../features/authentication/useLogout";

const Container = styled.div`
  display: flex;
  gap: 14px;
  align-items: center;
  font-weight: 500;
  font-size: 1.4rem;
  cursor: pointer;
  color: var(--color-grey-600);
  padding: 8px 8px 8px 14px;
  border: 1px solid var(--color-grey-200);
  background: transparent;
  background-color: var(--color-grey-200);
  border-radius: 30px;

  &:hover {
    box-shadow: var(--shadow-lg);
  }
`;

const SvgBox = styled.div`
  width: ${(props) => (props.$size === "small" ? "16px" : "32px")};
  height: ${(props) => (props.$size === "small" ? "16px" : "32px")};

  & svg {
    display: block;
    width: 100%;
    height: 100%;
    stroke-width: ${(props) => (props.$size === "small" ? "2.25" : "0")};
  }
`;

const Content = styled(DropdownMenu.Content)`
  min-width: 220px;
  background-color: var(--color-grey-200);
  border-radius: 6px;
  padding: 5px;
  box-shadow: 0px 10px 38px -10px rgba(22, 23, 24, 0.35),
    0px 10px 20px -15px rgba(22, 23, 24, 0.2);
  animation-duration: 400ms;
  animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
  will-change: transform, opacity;
`;

const Item = styled(DropdownMenu.Item)`
  padding: 5px;
  border-radius: 3px;
  &:hover {
    background-color: var(--color-grey-300);
  }
`;

function MenuUser() {
  const { user, isLoading: isLoadingUser, isAuthenticated } = useUser();
  const { logout, isLoggingOut } = useLogout();
  const navigate = useNavigate();

  return (
    <Modal>
      <DropdownMenu.Root modal={false}>
        <DropdownMenu.Trigger asChild>
          <Container>
            <SvgBox $size="small">
              <HiOutlineBars3 />
            </SvgBox>
            <SvgBox>
              <HiUserCircle />
            </SvgBox>
          </Container>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <Content sideOffset={10} align="end">
            {!isAuthenticated ? (
              <>
                <Modal.Open opens="loginUser">
                  <Item>
                    <div>Log in</div>
                  </Item>
                </Modal.Open>

                <Modal.Open opens="signupUser">
                  <Item>
                    <div>Sign up</div>
                  </Item>
                </Modal.Open>
              </>
            ) : (
              <>
                <Item>
                  <div onClick={() => navigate("/account-settings")}>
                    My Account
                  </div>
                </Item>
                <Item>
                  <div
                    onClick={() => {
                      logout("", {
                        onSuccess: () => navigate("/", { replace: true }),
                      });
                    }}
                  >
                    Log out
                  </div>
                </Item>
              </>
            )}
          </Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>

      <Modal.Window name="loginUser">
        <Login />
      </Modal.Window>
      <Modal.Window name="signupUser">
        <Signup />
      </Modal.Window>
    </Modal>
  );
}

export default MenuUser;
