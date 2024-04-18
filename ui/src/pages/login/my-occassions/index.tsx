import React from "react";
import { Button } from "@mantine/core";
import { Occasion } from "../../../../../api/src/controllers/occassions.controller";
import OccasionsTable from "../../../components/occassions-table/OccassionsTable";
import styles from "./index.module.css";
import AddOccassionDialog from "../../../components/add-occassion-dialog";
import useGetOccasion from "../../../hooks/use-get-occasion";

const MyOccassionsPage = () => {
  const [occassions, setOccassions] = React.useState<Occasion[]>([]);
  const [addOccassion, setAddOccassion] = React.useState<boolean>(false);
  const { data, isLoading, isError, error } = useGetOccasion();

  React.useEffect(() => {
    if (data) {
      setOccassions(data);
    }
  }, [data]);

  const onCloseAddDialog = () => setAddOccassion(false);

  const handleClick = () => {
    console.log("create a new occasion..");
    setAddOccassion(true);
  };

  console.log({ occassions });

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
      <>
        <div className={styles.container}></div>
        <div>Fetching data..</div>;
      </>
    );
  }

  return (
    <>
      <div className={styles.container}>
        <Button className={styles.button} variant="filled" onClick={handleClick}>
          Add
        </Button>
        <AddOccassionDialog opened={addOccassion} onClose={onCloseAddDialog} />
        <div className={styles.tableContainer}>
          <OccasionsTable occassions={occassions} />
        </div>
      </div>
    </>
  );
};

export default MyOccassionsPage;
