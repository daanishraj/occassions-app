import React from "react";
import { Button, Modal, Select, TextInput } from "@mantine/core";
import { AddOccasion, DaysofMonth, Month, OccasionType } from "../../../../api/src/controllers/occassions.controller";
import OccassionsService from "../../services/Occassions.service";

type Props = {
  opened: boolean;
  onClose: () => void;
};

// type NewOccassion = {
//   name: string;
//   occassionType: OccassionType;
//   month: Month;
//   day: DaysofMonth;
// };

type NewOccasion = Partial<AddOccasion>;

const ADD_DIALOG_TITLE = "Add an Occassion";

const AddOccassionDialog = ({ opened, onClose }: Props) => {
  const [newOccassion, setNewOccassion] = React.useState<NewOccasion>({
    name: "",
  });

  const [dayOptions, setDayOptions] = React.useState<string[]>(
    Array.from({ length: 31 }, (_, index) => String(index + 1)),
  );

  const onSelectOccassion = (value: string | null) => {
    if (value) {
      setNewOccassion({ ...newOccassion, occasionType: value as OccasionType });
    }
  };

  const onChangeName = (value: string | undefined) => value && setNewOccassion({ ...newOccassion, name: value });

  const onSelectMonth = (value: string | null) => {
    if (value) {
      const userSelection = value as Month;
      setNewOccassion({ ...newOccassion, month: userSelection });

      if (
        userSelection === Month.JANUARY ||
        userSelection === Month.MARCH ||
        userSelection === Month.MAY ||
        userSelection === Month.JULY ||
        userSelection === Month.AUGUST ||
        userSelection === Month.OCTOBER ||
        userSelection === Month.DECEMBER
      ) {
        setDayOptions(Array.from({ length: 31 }, (_, index) => String(index + 1)));
        return;
      }
      if (userSelection === Month.FEBRUARY) {
        setDayOptions(Array.from({ length: 29 }, (_, index) => String(index + 1)));
        return;
      }
      setDayOptions(Array.from({ length: 30 }, (_, index) => String(index + 1)));
    }
  };

  const onSelectDay = (value: string | null) =>
    value && setNewOccassion({ ...newOccassion, day: parseInt(value) as DaysofMonth });

  const selectOccassionOptions: string[] = Object.values(OccasionType) as string[];
  const selectMonthOptions = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const handleAdd = async () => {
    await OccassionsService.addOccassion(newOccassion as AddOccasion);
    await OccassionsService.getOccassions();
    onClose();
  };
  return (
    <Modal opened={opened} onClose={onClose} title={ADD_DIALOG_TITLE}>
      {/*Todo: Conditionally render error prop - form validation */}
      <TextInput
        size="xs"
        label="Name"
        placeholder="John Doe"
        withAsterisk
        onChange={(event) => onChangeName(event?.currentTarget.value)}
        value={newOccassion.name}
      />
      <Select
        label="Select Occassion Type"
        placeholder="birthday"
        data={selectOccassionOptions}
        value={newOccassion.occasionType}
        onChange={onSelectOccassion}
        defaultValue={null}
      />
      <Select
        label="Select Month"
        placeholder="January"
        data={selectMonthOptions}
        value={newOccassion.month}
        onChange={onSelectMonth}
      />
      {/* Validation - user should not be able to select February 30th */}
      <Select
        label="Select Day"
        placeholder="1"
        data={dayOptions}
        value={newOccassion.day?.toString()}
        onChange={onSelectDay}
      />
      <Button onClick={handleAdd}>Add</Button>
    </Modal>
  );
};

export default AddOccassionDialog;
