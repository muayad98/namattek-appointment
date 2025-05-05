import { Admin, Resource, ListGuesser } from "react-admin";
import { dataProvider } from "./DataProvider";

export default function AdminApp() {
  return (
    <Admin basename="/admin" dataProvider={dataProvider}>
      <Resource name="services" list={ListGuesser} />
      <Resource name="customers" list={ListGuesser} />
      <Resource name="appointments" list={ListGuesser} />
    </Admin>
  );
}
