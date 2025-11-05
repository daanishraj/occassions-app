import { Table } from "@mantine/core";
import { Occasion } from "@occasions/types";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import React from "react";
import useDeleteOccasion from "../../hooks/use-delete-occasion";
import EditOccasionDialog from "../edit-occasion-dialog";

type Props = {
  occassions: Occasion[];
}

const OccasionsTable = ({ occassions }: Props) => {
  const [selectedOccasionForEdit, setSelectedOccasionForEdit] = React.useState<Occasion | null>(null);
  const { deleteOccasion } = useDeleteOccasion();
  

  const onEditOccassion = async (occasion: Occasion) => {
    setSelectedOccasionForEdit(occasion)
  };

  const onFinishEditing = () => {
    setSelectedOccasionForEdit(null);
  };
  const rows = occassions.map((occasion: Occasion) => (
    <Table.Tr key={occasion.id}>
      <Table.Td>{occasion.name}</Table.Td>
      <Table.Td>{occasion.occasionType}</Table.Td>
      <Table.Td>{occasion.month}</Table.Td>
      <Table.Td>{occasion.day}</Table.Td>
      <Table.Td>
        <IconEdit onClick={() => onEditOccassion(occasion)}/>
        <IconTrash onClick={() => deleteOccasion(occasion.id)} />
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Table data-testid="occasions-table">
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Name</Table.Th>
          <Table.Th>Occassion Type</Table.Th>
          <Table.Th>Month</Table.Th>
          <Table.Th>Day</Table.Th>
          <Table.Th>Actions</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{rows}</Table.Tbody>
      {selectedOccasionForEdit && <EditOccasionDialog occasion={selectedOccasionForEdit} onClose={onFinishEditing} />}
    </Table>
  );
};

export default OccasionsTable;
