import { Button, Select, TextInput } from "@mantine/core";
import React from "react";
import { Month, Occasion } from "../../../../api/src/controllers/occassions.controller";
import AddOccassionDialog from "./components/add-occassion-dialog";
import OccasionsTable from "./components/occassions-table/OccassionsTable";
import useGetOccasion from "./hooks/use-get-occasion";
import styles from "./index.module.css";

const Occassions = () => {
  const [occassions, setOccassions] = React.useState<Occasion[]>([]);
  const [filteredOccassions, setFilteredOccassions] = React.useState<Occasion[]>([]);
  const [addOccassion, setAddOccassion] = React.useState<boolean>(false);
  const { data, isLoading, isError, error } = useGetOccasion();
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
  const [filteredMonth, setFilteredMonth] = React.useState<Month | null>();
  const [searchText, setSearchText] = React.useState<string>("");

  React.useEffect(() => {
    if (data) {
      setOccassions(data);
      if (!(filteredMonth || searchText)) {
        setFilteredOccassions(data);
      }
    }
  }, [data, filteredMonth, searchText]);

  const onCloseAddDialog = () => setAddOccassion(false);

  const handleAdd = () => {
    setAddOccassion(true);
  };

  const onFilterMonth = (monthValue: string | null) => {
    let filteredItems: Occasion[];
    filteredItems = occassions.filter((occasion: Occasion) =>
      occasion.name.toLowerCase().includes(searchText.toLowerCase()),
    );
    if (monthValue) {
      filteredItems = filteredItems.filter((occasion: Occasion) => occasion.month === monthValue);
    }
    const userSelection = monthValue ? (monthValue as Month) : null;
    setFilteredMonth(userSelection);
    setFilteredOccassions(filteredItems);
  };

  const onFilterByName = (searchText: string) => {
    let filteredItems: Occasion[];
    filteredItems = occassions.filter((occasion: Occasion) =>
      occasion.name.toLowerCase().includes(searchText.toLowerCase()),
    );
    if (filteredMonth) {
      filteredItems = filteredItems.filter((occasion: Occasion) => occasion.month === filteredMonth);
    }

    setSearchText(searchText);
    setFilteredOccassions(filteredItems);
  };

  if (isError) {
    return (
      <div className={styles.container}>
        <span>There was an error fetching the data</span>
        <span>{error?.message}</span>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div>Fetching data..</div>;
      </div>
    );
  }

  return (
    <>
      <div className={styles.container}>
        <div className={styles.searchAndAddContainer}>
          <Select
            placeholder="search by month.."
            data={selectMonthOptions}
            value={filteredMonth}
            onChange={onFilterMonth}
            radius="lg"
            clearable
          />
          <TextInput
            placeholder="search by name.."
            onChange={(event) => onFilterByName(event?.currentTarget.value)}
            value={searchText}
            radius="lg"
          />
          <Button className={styles.addButton} radius="md" variant="filled" onClick={handleAdd}>
            Add
          </Button>
        </div>
        <AddOccassionDialog opened={addOccassion} onClose={onCloseAddDialog} />
        <div className={styles.tableContainer}>
          <OccasionsTable occassions={filteredOccassions} />
        </div>
      </div>
    </>
  );
};

export default Occassions;
