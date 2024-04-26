import { Table } from "@mantine/core";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { Occasion } from "../../../../../../api/src/controllers/occassions.controller";
import OccassionsService from "../../../../services/Occassions.service";

const OccasionsTable = ({ occassions }: { occassions: Occasion[] }) => {
  const onRemoveOccassion = async (id: string) => {
    await OccassionsService.deleteOccassion(id);
    //TODO: handle updating of the state on the FE
    await OccassionsService.getOccassions();
  };

  const onEditOccassion = async () => {
    console.log("edit this row");
  };

  const rows = occassions.map((occassion: Occasion) => (
    <Table.Tr key={occassion.id}>
      <Table.Td>{occassion.name}</Table.Td>
      <Table.Td>{occassion.occasionType}</Table.Td>
      <Table.Td>{occassion.month}</Table.Td>
      <Table.Td>{occassion.day}</Table.Td>
      <Table.Td>
        <IconEdit onClick={onEditOccassion} />
        <IconTrash onClick={() => onRemoveOccassion(occassion.id)} />
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
    </Table>
  );
};

export default OccasionsTable;