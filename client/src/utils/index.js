import React from "react";

import Chip from "@material-ui/core/Chip";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";

import { CURRENCY_SYMBOLS, CURRENCY_COLORS } from "../Constants";

export const getAmountError = amount => {
  if (amount === null) {
    return null;
  }
  if (amount <= 0) {
    return "Amount must be greater than 0.";
  }
  return null;
};

export const getMemoError = memo => {
  if (memo === null) {
    return null;
  }
  if (!memo.trim()) {
    return "Memo is required.";
  }
  return null;
};

export const getMaterialTableLocalization = search => ({
  body: {
    emptyDataSourceMessage: search
      ? "No payments match your search query."
      : "No payment history."
  }
});

const hiddenPaymentTableFields = [
  "id",
  "memo",
  "date",
  "currency",
  "senderId",
  "receiverId",
  "symbol"
].map(field => ({
  field,
  hidden: true,
  width: 0,
  searchable: true
}));

const UserText = ({ username, subjectName }) => {
  return (
    <React.Fragment>
      {subjectName}
      {username === subjectName && (
        <AccountCircleIcon style={{ fontSize: 16, marginLeft: 4 }} />
      )}
    </React.Fragment>
  );
};

export const getPaymentsTableColumns = user => [
  ...hiddenPaymentTableFields,
  {
    title: "Sender",
    field: "senderName",
    emptyValue: "Error accessing sender info.",
    render: ({ senderName }) => {
      return <UserText username={user.name} subjectName={senderName} />;
    }
  },
  {
    title: "Receiver",
    field: "receiverName",
    emptyValue: "Error accessing receiver info.",
    render: ({ receiverName }) => {
      return <UserText username={user.name} subjectName={receiverName} />;
    }
  },
  {
    title: "Amount",
    field: "amount",
    render: ({ currency, amount }) => {
      if (amount && currency) {
        return (
          <div>
            {amount}
            <Chip
              size="small"
              component="div"
              style={{
                marginLeft: 8,
                transition: "none",
                backgroundColor: CURRENCY_COLORS[currency]
              }}
              label={`${currency} (${CURRENCY_SYMBOLS[currency]})`}
            />
          </div>
        );
      }
      return "Error accessing payment info.";
    }
  }
];
