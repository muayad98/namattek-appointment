import {
  List,
  Datagrid,
  TextField,
  NumberField,
  EditButton,
  TextInput,
  NumberInput,
  Edit,
  Create,
  SimpleForm,
} from "react-admin";

export const ServicesList = () => (
  <List perPage={25}>
    <Datagrid rowClick="edit">
      <TextField source="name" label="Service" />
      <NumberField source="duration_minutes" label="Minutes" />
      <NumberField
        source="price"
        label="Price (OMR)"
        options={{ minimumFractionDigits: 2 }}
      />
      <EditButton />
    </Datagrid>
  </List>
);

export const ServicesEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="name" />
      <NumberInput source="duration_minutes" />
      <NumberInput source="price" />
    </SimpleForm>
  </Edit>
);

export const ServicesCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="name" />
      <NumberInput source="duration_minutes" />
      <NumberInput source="price" />
    </SimpleForm>
  </Create>
);
