import React from "react";
import { withSnackbar } from "notistack";

import Dashboard from "./layout/Dashboard";

import { fetchPayment, fetchUsers, postPayment } from "./api";

const App = ({ enqueueSnackbar }) => {
  const paymentsUpdaterIntervalRef = React.useRef(0);
  
  const [user, setUser] = React.useState(null);
  const [recipients, setRecipients] = React.useState([]);

  const [payments, setPayments] = React.useState([]);
  const [isErrorLoadingUsers, setIsErrorLoadingUsers] = React.useState(false);
  const [concurrencyState, setConcurrencyState] = React.useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      isMakingPayment: false,
      isErrorMakingPayment: false
    }
  );

  const updateUsers = () => {
    fetchUsers()
      .then(res => {
        const users = res.data;
        setUser(users[0]);
        setRecipients(users.slice(1));
      })
      .catch(() => {
        setIsErrorLoadingUsers(true);
        enqueueSnackbar("Error fetching users. Please refresh the page.", {
          autoHideDuration: 10000,
          variant: "error"
        });
      });
  };

  const updatePayments = () => {
    fetchPayment()
      .then(res => {
        setPayments(_payments => [res.data, ..._payments.slice(0, 24)]);
      })
      .catch(() => {
        clearInterval(paymentsUpdaterIntervalRef.current);
        enqueueSnackbar("Error loading payments. Please refresh the page.", {
          autoHideDuration: 10000,
          variant: "error"
        });
      });
  };
  
  React.useEffect(() => {
    updateUsers();
    paymentsUpdaterIntervalRef.current = 
      setInterval(updatePayments, 1000);
    
    return () => {
      clearInterval(paymentsUpdaterIntervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSuccessfulPayment = payment => {
    setConcurrencyState({ isMakingPayment: false });
    enqueueSnackbar("Payment made successfully!", {
      autoHideDuration: 3000,
      variant: "success"
    });
    setPayments(_payments => {
      return [payment, ..._payments]
        .sort((a, b) => b.date - a.date)
        .slice(0, 25);
    });
  };

  const makePayment = data => {
    setConcurrencyState({
      isMakingPayment: true,
      isErrorMakingPayment: false
    });

    const payment = { ...data, sender: user };

    postPayment(payment).then(response => {
      if (response.status === 201) {
        handleSuccessfulPayment(payment);
      } else if (response.status === 503) {
        makePayment(data);
      } else {
        setConcurrencyState({
          isMakingPayment: false,
          isErrorMakingPayment: true
        });
        enqueueSnackbar("Error making payment.", {
          autoHideDuration: 3000,
          variant: "error"
        });
      }
    });
  };

  return (
    <Dashboard
      user={user}
      payments={payments}
      recipients={recipients}
      onMakePayment={makePayment}
      isErrorLoadingUsers={isErrorLoadingUsers}
      isMakingPayment={concurrencyState.isMakingPayment}
      isErrorMakingPayment={concurrencyState.isErrorMakingPayment}
    />
  );
};

export default withSnackbar(App);
