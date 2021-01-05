import React from "react";
import PropTypes from "prop-types";

import Chip from "@material-ui/core/Chip";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import Toolbar from "@material-ui/core/Toolbar";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";

import Payments from "../components/Payments";
import NewPaymentsModal from "../components/NewPaymentsModal";

import { dashboardStyles } from "../styles";

const Dashboard = ({
  user,
  payments,
  recipients,
  onMakePayment,
  isMakingPayment,
  isErrorLoadingUsers,
  isErrorMakingPayment
}) => {
  const classes = dashboardStyles();
  const [showModal, setShowModal] = React.useState(false);

  return (
    <div className={classes.root}>
      <NewPaymentsModal
        isOpen={showModal}
        recipients={recipients}
        onMakePayment={onMakePayment}
        isMakingPayment={isMakingPayment}
        isErrorLoadingUsers={isErrorLoadingUsers}
        isErrorMakingPayment={isErrorMakingPayment}
        onClose={() => setShowModal(false)}
      />
      <AppBar position="absolute">
        <Toolbar className={classes.toolbar} component="div">
          <div className={classes.toolbarLeft}>
            <Typography
              variant="h6"
              noWrap={true}
              component="h1"
              className={classes.title}
            >
              Your Dashboard
            </Typography>
            {user && (
              <Chip
                size="small"
                component="div"
                label={user.name}
                color="secondary"
                style={{ marginLeft: 8 }}
                icon={<AccountCircleIcon />}
              />
            )}
          </div>
          <Button color="inherit" onClick={() => setShowModal(true)}>
            Create payment
          </Button>
        </Toolbar>
      </AppBar>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container} component="div">
          <Payments user={user} payments={payments} />
        </Container>
      </main>
    </div>
  );
};

Dashboard.propTypes = {
  user: PropTypes.object,
  payments: PropTypes.array.isRequired,
  recipients: PropTypes.array.isRequired,
  onMakePayment: PropTypes.func.isRequired,
  isMakingPayment: PropTypes.bool.isRequired,
  isErrorLoadingUsers: PropTypes.bool.isRequired,
  isErrorMakingPayment: PropTypes.bool.isRequired
};

export default Dashboard;
