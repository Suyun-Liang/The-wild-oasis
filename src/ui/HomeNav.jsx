import { NavLink } from "react-router-dom";
import styled from "styled-components";
import Logo from "./Logo";

const StyledNav = styled.nav`
  width: 100%;
  padding: 0 3rem;
  z-index: 100;

  & img {
    padding: 0.6rem 0;
  }
`;
const NavList = styled.ul`
  display: flex;
  align-items: center;
  gap: 3.6rem;

  .logo {
    margin-right: auto;
  }
`;

const StyledHomeNavLink = styled(NavLink)`
  &:link,
  &:visited {
    font-size: 1.8rem;
    font-weight: 400;
    transition: all 0.3s;
  }

  &.active:link,
  &.active:visited {
  }
`;

function HomeNav() {
  function handleMouseHover(opacity) {
    return function (e) {
      if (e.target.matches("a") || e.target.matches("img")) {
        const selectedLink = e.target.closest("a");
        const links = selectedLink.closest("ul").querySelectorAll("a");

        links.forEach((l) => {
          if (l !== selectedLink) {
            l.style.opacity = opacity;
          }
        });
      }
    };
  }

  return (
    <StyledNav>
      <NavList
        onMouseOver={handleMouseHover(0.5)}
        onMouseOut={handleMouseHover(1)}
      >
        <StyledHomeNavLink to="/" className="logo">
          <Logo />
        </StyledHomeNavLink>
        <StyledHomeNavLink to="/">Home</StyledHomeNavLink>
        <StyledHomeNavLink to="/rooms">Rooms</StyledHomeNavLink>
        <StyledHomeNavLink to="/contactus">Contact us</StyledHomeNavLink>
        <StyledHomeNavLink to="/signin">Sign in</StyledHomeNavLink>
        <StyledHomeNavLink to="/login">Register</StyledHomeNavLink>
      </NavList>
    </StyledNav>
  );
}

export default HomeNav;
