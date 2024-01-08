import {
  DateRangePicker,
  Group,
  DateInput,
  DateSegment,
  Button,
  Popover,
  Dialog,
} from "react-aria-components";
import styled from "styled-components";

import DateRangeCalender from "./DateRangeCalender";

const StyledDateRangePicker = styled(DateRangePicker)`
  .react-aria-Group {
    display: flex;
    align-items: center;
    width: fit-content;
  }

  .react-aria-DateInput {
    display: flex;
  }
`;

function DatePicker() {
  return (
    <StyledDateRangePicker>
      <Group>
        <DateInput slot="start">
          {(segment) => <DateSegment segment={segment} />}
        </DateInput>
        <span aria-hidden="true">–</span>
        <DateInput slot="end">
          {(segment) => <DateSegment segment={segment} />}
        </DateInput>
        <Button>▼</Button>
      </Group>
      <Popover>
        <Dialog>
          <DateRangeCalender />
        </Dialog>
      </Popover>
    </StyledDateRangePicker>
  );
}

export default DatePicker;
