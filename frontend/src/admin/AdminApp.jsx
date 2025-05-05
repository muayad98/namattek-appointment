import { Admin, Resource, ListGuesser, EditGuesser } from "react-admin";
import { dataProvider } from "./DataProvider";

export default function AdminApp() {
  return (
    <Admin basename="/admin" dataProvider={dataProvider}>
      <Resource name="services" list={ListGuesser} edit={EditGuesser} />
      <Resource name="customers" list={ListGuesser} edit={EditGuesser} />
      <Resource name="appointments" list={ListGuesser} edit={EditGuesser} />
    </Admin>
  );
}
