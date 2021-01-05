import React from "react";
import PropTypes from "prop-types";
import MaterialTable from "material-table";

import TableIcons from "./TableIcons";

import { CURRENCY_SYMBOLS } from "../Constants";
import {
  getPaymentsTableColumns,
  getMaterialTableLocalization
} from "../utils";

const Payments = ({ user, payments }) => {
  const [search, setSearch] = React.useState("");

  return (
    <MaterialTable
      icons={TableIcons}
      title="Payments Feed"
      onSearchChange={setSearch}
      columns={getPaymentsTableColumns(user)}
      localization={getMaterialTableLocalization(search)}
      data={payments.map(payment => ({
        ...payment,
        senderId: payment.sender.id,
        senderName: payment.sender.name,
        receiverId: payment.receiver.id,
        receiverName: payment.receiver.name,
        symbol: CURRENCY_SYMBOLS[payment.currency]
      }))}
      options={{
        search: true,
        pageSize: 25,
        pageSizeOptions: []
      }}
    />
  );
};

Payments.propTypes = {
  user: PropTypes.object,
  payments: PropTypes.array.isRequired
};

export default Payments;
