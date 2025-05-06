import { Admin, Resource } from "react-admin";
import { dataProvider } from "./DataProvider";

import {
  ServicesList,
  ServicesEdit,
  ServicesCreate,
} from "./lists/ServicesList";
import {
  CustomersList,
  CustomersEdit,
  CustomersCreate,
} from "./lists/CustomersList";
import {
  AppointmentsList,
  AppointmentsEdit,
  AppointmentsCreate,
} from "./lists/AppointmentsList";

export default function AdminApp() {
  return (
    <Admin basename="/admin" dataProvider={dataProvider}>
      <Resource
        name="services"
        list={ServicesList}
        edit={ServicesEdit}
        create={ServicesCreate}
      />
      <Resource
        name="customers"
        list={CustomersList}
        edit={CustomersEdit}
        create={CustomersCreate}
      />
      <Resource
        name="appointments"
        list={AppointmentsList}
        edit={AppointmentsEdit}
        create={AppointmentsCreate}
      />
    </Admin>
  );
}
