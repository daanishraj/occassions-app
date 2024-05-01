import { Table } from "@mantine/core";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import React from "react";
import { Occasion } from "../../../../../../api/src/controllers/occassions.controller";
import useDeleteOccasion from "../../hooks/use-delete-occasion";
import EditOccasionDialog from "../edit-occasion-dialog";

const OccasionsTable = ({ occassions }: { occassions: Occasion[] }) => {
  const [selectedOccasionForEdit, setSelectedOccasionForEdit] = React.useState<Occasion | null>(null);
  const { deleteOccasion } = useDeleteOccasion();

  const onEditOccassion = async (occasion: Occasion) => {
    setSelectedOccasionForEdit(occasion);
  };

  const onFinishEditing = () => {
    setSelectedOccasionForEdit(null);
  };
  const rows = occassions.map(({ id, name, occasionType, month, day }: Occasion) => (
    <Table.Tr key={id}>
      <Table.Td>{name}</Table.Td>
      <Table.Td>{occasionType}</Table.Td>
      <Table.Td>{month}</Table.Td>
      <Table.Td>{day}</Table.Td>
      <Table.Td>
        <IconEdit onClick={() => onEditOccassion({ id, name, occasionType, month, day })} />
        <IconTrash onClick={() => deleteOccasion(id)} />
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Table>
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
