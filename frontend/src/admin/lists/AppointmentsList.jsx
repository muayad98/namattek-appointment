import {
  List,
  Datagrid,
  DateField,
  TextField,
  ReferenceField,
  SelectInput,
  ReferenceInput,
  DateInput,
  BulkDeleteButton,
  BulkUpdateButton,
  TopToolbar,
  CreateButton,
  ExportButton,
  useRefresh,
  Edit,
  SimpleForm,
  ReferenceInput as RefInput,
  DateTimeInput,
  SelectInput as SelInput,
  Create,
} from "react-admin";
import { Button } from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import ClearIcon from "@mui/icons-material/Clear";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const statusChoices = [
  { id: "scheduled", name: "scheduled" },
  { id: "arrived", name: "arrived" },
  { id: "cancelled", name: "cancelled" },
  { id: "no-show", name: "no-show" },
];

const ListActions = () => {
  const refresh = useRefresh();
  return (
    <TopToolbar>
      <CreateButton />
      <ExportButton />
      <Button onClick={() => refresh()} startIcon={<AccessTimeIcon />}>
        Refresh
      </Button>
    </TopToolbar>
  );
};

// reusable bulk status setter
const BulkSetStatusButton = (label, status, Icon) => (props) => (
  <BulkUpdateButton
    {...props}
    label={label}
    icon={<Icon />}
    data={{ status }}
  />
);

export const AppointmentsList = () => (
  <List
    perPage={25}
    actions={<ListActions />}
    filters={[
      <ReferenceInput
        key="svc"
        source="service_id"
        reference="services"
        label="Service"
      >
        <SelectInput optionText="name" />
      </ReferenceInput>,
      <SelectInput key="st" source="status" choices={statusChoices} />,
      <DateInput key="from" source="start_time_gte" label="From" />,
      <DateInput key="to" source="start_time_lte" label="To" />,
    ]}
  >
    <Datagrid
      rowClick="edit"
      bulkActionButtons={[
        BulkSetStatusButton("Arrived", "arrived", DoneIcon),
        BulkSetStatusButton("Cancelled", "cancelled", ClearIcon),
        <BulkDeleteButton key="del" />,
      ]}
    >
      <DateField source="start_time" label="Start" />
      <ReferenceField
        source="service_id"
        reference="services"
        label="Service"
      >
        <TextField source="name" />
      </ReferenceField>
      <ReferenceField
        source="customer_id"
        reference="customers"
        label="Customer"
      >
        <TextField source="name" />
      </ReferenceField>
      <TextField source="status" />
    </Datagrid>
  </List>
);

export const AppointmentsEdit = () => (
  <Edit>
    <SimpleForm>
      <RefInput source="service_id" reference="services" label="Service">
        <SelInput optionText="name" />
      </RefInput>
      <RefInput source="customer_id" reference="customers" label="Customer">
        <SelInput optionText="name" />
      </RefInput>
      <DateTimeInput source="start_time" label="Start Time" />
      <SelectInput source="status" choices={statusChoices} />
    </SimpleForm>
  </Edit>
);

export const AppointmentsCreate = () => (
  <Create>
    <SimpleForm>
      <RefInput source="service_id" reference="services" label="Service">
        <SelInput optionText="name" />
      </RefInput>
      <RefInput source="customer_id" reference="customers" label="Customer">
        <SelInput optionText="name" />
      </RefInput>
      <DateTimeInput source="start_time" label="Start Time" />
      <SelectInput
        source="status"
        choices={statusChoices}
        defaultValue="scheduled"
      />
    </SimpleForm>
  </Create>
);
