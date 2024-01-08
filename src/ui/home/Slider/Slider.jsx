import { useState } from "react";
import styled from "styled-components";
import {
  HiOutlineArrowLeftCircle,
  HiOutlineArrowRightCircle,
} from "react-icons/hi2";
import useCabins from "../../../features/cabins/useCabins";

import { Slide } from "./Slide";
import { chunckArr } from "../../../utils/helpers";
import { CARDS_PER_SLIDE } from "../../../utils/constants";

const StyledSlider = styled.div`
  position: relative;
  height: 30rem;
  min-width: 114rem;
  /* margin: 0 180px; */
  /* transform: scale(0.5) translate(-600px); */
  overflow: hidden;

  display: flex;
  justify-content: center;
  align-items: center;
`;

const SliderButton = styled.button`
  all: unset;
  position: absolute;
  z-index: 10;
  cursor: pointer;

  &:focus {
    outline: 2px solid var(--color-grey-400);
  }

  & svg {
    width: 3rem;
    height: 3rem;
    fill: white;
  }
`;

export function Slider() {
  const [curSlide, setCurSlide] = useState(0);
  const { isLoading: isLoadingCabins, cabins } = useCabins();

  const slides = chunckArr(cabins, CARDS_PER_SLIDE);
  const lastSlide = slides.length - 1;

  function preSlide() {
    setCurSlide((s) => {
      if (s === 0) return lastSlide;
      return s - 1;
    });
  }
  function nextSlide() {
    setCurSlide((s) => {
      if (s === lastSlide) return 0;
      return s + 1;
    });
  }

  return (
    <StyledSlider>
      <SliderButton
        onClick={preSlide}
        style={{ left: "0.5rem" }}
        disabled={isLoadingCabins}
      >
        <HiOutlineArrowLeftCircle />
      </SliderButton>
      {isLoadingCabins && (
        <Slide isLoading={isLoadingCabins} cardsPerSlide={CARDS_PER_SLIDE} />
      )}
      {slides?.map((s, i) => (
        <Slide
          data={s}
          index={i}
          key={i}
          style={{ transform: `translateX(${(i - curSlide) * 100}%)` }}
        />
      ))}
      <SliderButton
        onClick={nextSlide}
        style={{ right: "0.5rem" }}
        disabled={isLoadingCabins}
      >
        <HiOutlineArrowRightCircle />
      </SliderButton>
    </StyledSlider>
  );
}
