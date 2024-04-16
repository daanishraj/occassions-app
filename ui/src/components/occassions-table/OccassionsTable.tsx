import { Occassion } from "../../../../api/src/controllers/occassions.controller";
import { Table } from "@mantine/core";
import { IconTrash, IconEdit } from "@tabler/icons-react";
import styles from "./styles.module.css";

const OccasionsTable = ({ occassions }: { occassions: Occassion[] }) => {
  console.log({ occassions });

  const onRemoveOccassion = () => {
    console.log("delete this row");
  };

  const onEditOccassion = () => {
    console.log("edit this row");
  };

  const rows = occassions.map((occassion: Occassion) => (
    <Table.Tr key={occassion.id}>
      <Table.Td>{occassion.name}</Table.Td>
      <Table.Td>{occassion.occassionType}</Table.Td>
      <Table.Td>{occassion.date}</Table.Td>
      <Table.Td>{occassion.comment}</Table.Td>
      <Table.Td>
        <IconEdit onClick={onEditOccassion} />
        <IconTrash onClick={onRemoveOccassion} />
      </Table.Td>
    </Table.Tr>
  ));

  return (
    // <Table className={styles.test}>
    <Table>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Name</Table.Th>
          <Table.Th>Occassion Type</Table.Th>
          <Table.Th>Date</Table.Th>
          <Table.Th>Comments</Table.Th>
          <Table.Th>Actions</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{rows}</Table.Tbody>
    </Table>
  );
};

export default OccasionsTable;
