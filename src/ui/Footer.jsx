import styled from "styled-components";

const Container = styled.div`
  width: 100%;
  margin: 0 auto;
  flex-grow: 1;

  display: flex;
  flex-direction: column;
  justify-content: end;
`;
const StyledFooter = styled.footer`
  border-top: 1px solid var(--color-grey-200);
  margin: 32px;
  padding: 16px 0;
`;

function Footer() {
  return (
    <Container>
      <StyledFooter>© 2024 Company, Inc. All rights reserved.</StyledFooter>
    </Container>
  );
}

export default Footer;
