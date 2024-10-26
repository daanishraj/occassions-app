import { Button, Flex, Modal, Select, TextInput } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import React from "react";
import { Month, Occasion } from "../../../../../../api/src/controllers/occasions.controller";
import { selectDayOptions, selectMonthOptions, selectOccassionOptions } from "../../types";
import styles from "./styles.module.css";

const EDIT_DIALOG_TITLE = "Edit an Occassion";

type TProps = {
  occasion: Occasion;
  onClose: () => void;
};

const EditOccasionDialog: React.FC<TProps> = ({ occasion, onClose }: TProps) => {
  const [dayOptions, setDayOptions] = React.useState<string[]>(selectDayOptions);
  const form = useForm<Omit<Occasion, "id" | "userId">>({
    mode: "controlled",
    validateInputOnChange: true,
    initialValues: {
      name: occasion.name,
      occasionType: occasion.occasionType,
      month: occasion.month,
      day: occasion.day,
    },
    onValuesChange(values) {
      console.log({ values });
      const { month } = values;
      if (
        month === Month.JANUARY ||
        month === Month.MARCH ||
        month === Month.MAY ||
        month === Month.JULY ||
        month === Month.AUGUST ||
        month === Month.OCTOBER ||
        month === Month.DECEMBER
      ) {
        setDayOptions(Array.from({ length: 31 }, (_, index) => String(index + 1)));
        return;
      }
      if (month === Month.FEBRUARY) {
        console.log("month is February");
        setDayOptions(Array.from({ length: 29 }, (_, index) => String(index + 1)));
        return;
      }
      setDayOptions(Array.from({ length: 30 }, (_, index) => String(index + 1)));
    },
    validate: {
      name: isNotEmpty("Name cannot be empty"),
    },
  });

  const handleSubmit = () => {
    console.log("make a PUT request..");
    console.log(form.getValues());
  };

  return (
    <Modal opened onClose={onClose} title={EDIT_DIALOG_TITLE} size="xs">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Flex direction="column" rowGap="md">
          <TextInput
            size="sm"
            label="Name"
            placeholder="John Doe"
            key={form.key("name")}
            {...form.getInputProps("name")}
            withAsterisk
          />
          <Select
            label="Select Occassion Type"
            placeholder="birthday"
            key={form.key("occasionType")}
            data={selectOccassionOptions}
            {...form.getInputProps("occasionType")}
            withAsterisk
          />
          <Select
            label="Select Month"
            placeholder="January"
            key={form.key("month")}
            data={selectMonthOptions}
            {...form.getInputProps("month")}
            withAsterisk
          />
          <Select
            label="Select Day"
            placeholder="1"
            key={form.key("day")}
            data={dayOptions}
            {...form.getInputProps("day")}
            withAsterisk
          />
        </Flex>
        <Button className={styles.submitButton} type="submit" mt="sm">
          Save
        </Button>
      </form>
    </Modal>
  );
};

export default EditOccasionDialog;
