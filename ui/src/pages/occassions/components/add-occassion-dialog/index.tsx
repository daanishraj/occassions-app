import { Button, Flex, Modal, Select, TextInput } from "@mantine/core";
import React from "react";
import {
  AddOccasion,
  DaysofMonth,
  Month,
  OccasionType,
} from "../../../../../../api/src/controllers/occassions.controller";
import useCreateOccasion from "../../hooks/use-create-occasion";
import styles from "./styles.module.css";

type Props = {
  opened: boolean;
  onClose: () => void;
};

export type NewOccasion = Partial<AddOccasion>;

const ADD_DIALOG_TITLE = "Add an Occassion";

const AddOccassionDialog = ({ opened, onClose }: Props) => {
  const [newOccassion, setNewOccasion] = React.useState<NewOccasion>({
    name: "",
  });

  const [dayOptions, setDayOptions] = React.useState<string[]>(
    Array.from({ length: 31 }, (_, index) => String(index + 1)),
  );

  const { addOccasion } = useCreateOccasion({ setNewOccasion, onClose });

  const onSelectOccassion = (value: string | null) => {
    if (value) {
      setNewOccasion({ ...newOccassion, occasionType: value as OccasionType });
    }
  };

  const onChangeName = (value: string | undefined) => setNewOccasion({ ...newOccassion, name: value });

  const onSelectMonth = (value: string | null) => {
    if (value) {
      const userSelection = value as Month;
      setNewOccasion({ ...newOccassion, month: userSelection });

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
    value && setNewOccasion({ ...newOccassion, day: parseInt(value) as DaysofMonth });

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
    addOccasion(newOccassion as AddOccasion);
  };
  return (
    <Modal opened={opened} onClose={onClose} title={ADD_DIALOG_TITLE} size="xs">
      {/*Todo: Conditionally render error prop - form validation */}
      <Flex direction="column" rowGap="lg">
        <TextInput
          size="sm"
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
          withAsterisk
        />
        <Select
          label="Select Month"
          placeholder="January"
          data={selectMonthOptions}
          value={newOccassion.month}
          onChange={onSelectMonth}
          withAsterisk
        />
        {/* TODO: Validation - user should not be able to select February 30th */}
        <Select
          label="Select Day"
          placeholder="1"
          data={dayOptions}
          value={newOccassion.day?.toString()}
          onChange={onSelectDay}
          withAsterisk
        />
      </Flex>
      <Button
        className={styles.addButton}
        disabled={!(newOccassion.day && newOccassion.month && newOccassion.name && newOccassion.occasionType)}
        onClick={handleAdd}
      >
        Add
      </Button>
    </Modal>
  );
};

export default AddOccassionDialog;
