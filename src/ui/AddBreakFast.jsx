import { useSearchParams } from "react-router-dom";
import Checkbox from "./Checkbox";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  justify-content: space-between;
`;

export default function AddBreakFast() {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialVal = searchParams.get("hasBreakfast")
    ? JSON.parse(searchParams.get("hasBreakfast"))
    : false;

  function handleChange(e) {
    const checked = e.target.checked;
    if (checked) {
      searchParams.set("hasBreakfast", true);
    } else {
      searchParams.set("hasBreakfast", false);
    }
    setSearchParams(searchParams);
  }

  return (
    <Container>
      <span>Add breakfast</span>
      <Checkbox type="checkbox" onChange={handleChange} checked={initialVal} />
    </Container>
  );
}
