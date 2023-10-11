import { HiOutlineMoon, HiOutlineSun } from "react-icons/hi2";

import ButtonIcon from "../ui/ButtonIcon";

import { useDarkMode } from "../context/DarkModeContext";

function DarkemodeToggle() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <ButtonIcon onClick={toggleDarkMode}>
      {isDarkMode ? <HiOutlineSun /> : <HiOutlineMoon />}
    </ButtonIcon>
  );
}

export default DarkemodeToggle;
