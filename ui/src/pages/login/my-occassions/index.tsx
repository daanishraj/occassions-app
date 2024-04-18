import React from "react";
import { Button } from "@mantine/core";
import { Occasion } from "../../../../../api/src/controllers/occassions.controller";
import occassionsService from "../../../services/Occassions.service";
import OccasionsTable from "../../../components/occassions-table/OccassionsTable";
import styles from "./index.module.css";
import AddOccassionDialog from "../../../components/add-occassion-dialog";

const MyOccassionsPage = () => {
  const [occassions, setOccassions] = React.useState<Occasion[]>([]);
  const [addOccassion, setAddOccassion] = React.useState<boolean>(false);

  React.useEffect(() => {
    const getData = async () => {
      try {
        const data = await occassionsService.getOccassions();
        console.log("print the response", { data });
        setOccassions(data);
      } catch (error) {
        console.log({ error });
        console.log("error fetching occassions data");
      }
    };

    getData();
  }, []);

  const onCloseAddDialog = () => setAddOccassion(false);

  const handleClick = () => {
    console.log("create a new occasion..");
    setAddOccassion(true);
  };

  console.log({ occassions });

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
