import React from "react";
import { Button } from "@mantine/core";
import { Occassion } from "../../../../../api/src/controllers/occassions.controller";
import occassionsService from "../../../services/Occassions.service";
import OccasionsTable from "../../../components/occassions-table/OccassionsTable";
import styles from "./index.module.css";

const MyOccassionsPage = () => {
  const [occassions, setOccassions] = React.useState<Occassion[]>([]);

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

  const handleClick = () => {
    console.log("create a new occasion..");
  };

  console.log({ occassions });

  return (
    <>
      <div className={styles.container}>
        <Button className={styles.button} variant="filled" onClick={handleClick}>
          Create
        </Button>
        <div className={styles.tableContainer}>
          <OccasionsTable occassions={occassions} />
        </div>
      </div>
    </>
  );
};

export default MyOccassionsPage;
