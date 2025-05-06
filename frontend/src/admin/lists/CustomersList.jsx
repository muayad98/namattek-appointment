import {
  List,
  Datagrid,
  TextField,
  EmailField,
  EditButton,
  TextInput,
  Edit,
  Create,
  SimpleForm,
} from "react-admin";

export const CustomersList = () => (
  <List
    perPage={25}
    filters={[<TextInput label="Search" source="q" alwaysOn />]}
  >
    <Datagrid rowClick="edit">
      <TextField source="name" />
      <TextField source="phone" />
      <EmailField source="email" />
      <EditButton />
    </Datagrid>
  </List>
);

export const CustomersEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="name" />
      <TextInput source="phone" />
      <TextInput source="email" />
    </SimpleForm>
  </Edit>
);

export const CustomersCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="name" />
      <TextInput source="phone" />
      <TextInput source="email" />
    </SimpleForm>
  </Create>
);
