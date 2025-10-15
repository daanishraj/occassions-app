import { SignedIn, useAuth } from "@clerk/clerk-react";
import { Button, Select, TextInput } from "@mantine/core";
import React from "react";
import { Month, Occasion } from "../../../../api/src/validation";
import Profile from "../profile";
import AddOccasionDialog from "./components/add-occassion-dialog";
import OccasionsTable from "./components/occassions-table/OccassionsTable";
import useGetOccasion from "./hooks/use-get-occasion";
import styles from "./index.module.css";

const Occassions = () => {
  const {userId, isLoaded} = useAuth();
  const [occassions, setOccassions] = React.useState<Occasion[]>([]);
  const [filteredOccassions, setFilteredOccassions] = React.useState<Occasion[]>([]);
  const [addOccassion, setAddOccassion] = React.useState<boolean>(false);
  const { data, isLoading, isError, error } = useGetOccasion();
  const selectMonthOptions: string[] = React.useMemo(() => Object.values(Month), []);
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

  const sortedOccasions = React.useMemo(() => {
    return [...filteredOccassions].sort((a, b) => {
      const indexA = selectMonthOptions.indexOf(a.month);
      const indexB = selectMonthOptions.indexOf(b.month);

      return indexA - indexB;
    });
  }, [filteredOccassions, selectMonthOptions]);

  if (isError) {
    return (
      <div className={styles.container}>
        <span>There was an error fetching the data</span>
        <span>{error?.message}</span>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div>Try signing in again</div>
    )
  }
  if (isLoading) {
    return (
      <div className={styles.container}>
        <div>Fetching data...</div>
      </div>
    );
  }

  return (
    <>
    <SignedIn>
      <Profile/>
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
        <AddOccasionDialog opened={addOccassion} onClose={onCloseAddDialog} userId={userId!} />
        <div className={styles.tableContainer}>
          <OccasionsTable occassions={sortedOccasions} userId={userId!} />
        </div>
      </div>
      </SignedIn>
    </>
  );
};

export default Occassions;
