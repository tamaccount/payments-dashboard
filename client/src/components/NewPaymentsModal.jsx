import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";

import Grid from "@material-ui/core/Grid";
import Dialog from "@material-ui/core/Dialog";
import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControl from "@material-ui/core/FormControl";
import Autocomplete from "@material-ui/lab/Autocomplete";
import DialogActions from "@material-ui/core/DialogActions";
import FormHelperText from "@material-ui/core/FormHelperText";
import CircularProgress from "@material-ui/core/CircularProgress";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";

import { CURRENCY, CURRENCY_SYMBOLS } from "../Constants";
import { getAmountError, getMemoError } from "../utils";
import { paymentModalStyles } from "../styles";

const commonProps = {
  required: true,
  variant: "outlined",
  InputLabelProps: { shrink: true }
};

const NewPaymentsModal = ({
  isOpen,
  onClose,
  recipients,
  onMakePayment,
  isMakingPayment,
  isErrorLoadingUsers,
  isErrorMakingPayment
}) => {
  const classes = paymentModalStyles();

  const [currency, setCurrency] = React.useState(CURRENCY.USD);
  const [amount, setAmount] = React.useState(null);
  const [receiver, setReceiver] = React.useState(null);
  const [memo, setMemo] = React.useState(null);

  const memoError = getMemoError(memo);
  const amountError = getAmountError(amount);
  const isConfirmDisabled =
    !currency || !amount || !receiver || !memo || !!memoError || !!amountError;

  const wasMakingPaymentRef = React.useRef();
  React.useEffect(() => {
    wasMakingPaymentRef.current = isMakingPayment;
  });
  const wasMakingPayment = wasMakingPaymentRef.current;

  React.useEffect(() => {
    if (wasMakingPayment && !isMakingPayment && !isErrorMakingPayment) {
      handleClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMakingPayment, isErrorMakingPayment]);

  const handleClose = () => {
    setCurrency(CURRENCY.USD);
    setAmount(null);
    setReceiver(null);
    setMemo(null);
    onClose();
  };

  const handleSubmit = () => {
    onMakePayment({
      id: uuidv4(),
      receiver,
      date: moment().format(),
      amount,
      currency,
      memo
    });
  };

  return (
    <Dialog open={isOpen} maxWidth="xs" fullWidth={true} onClose={onClose}>
      <DialogTitle>Create Payment</DialogTitle>
      {isErrorLoadingUsers ? (
        <DialogContent>
          <DialogContentText>
            Error loading users. Payments cannot be created.
          </DialogContentText>
        </DialogContent>
      ) : (
        <DialogContent>
          <Grid container={true} component="div" spacing={2}>
            <Grid item={true} xs={12} component="div">
              <FormControl className={classes.formControl}>
                <Autocomplete
                  options={recipients}
                  value={receiver}
                  onChange={(event, option) => {
                    setReceiver(option);
                  }}
                  getOptionLabel={option => option.name}
                  renderInput={params => (
                    <TextField {...params} {...commonProps} label="Send To" />
                  )}
                />
              </FormControl>
            </Grid>
          </Grid>
          <Grid container={true} component="div" spacing={2}>
            <Grid item={true} xs={6} component="div">
              <FormControl className={classes.formControl}>
                <TextField
                  {...commonProps}
                  type="number"
                  label="Amount"
                  value={amount || 0}
                  error={!!amountError}
                  helperText={amountError}
                  onChange={e => setAmount(e.target.value)}
                />
              </FormControl>
            </Grid>
            <Grid item={true} xs={6} component="div">
              <FormControl className={classes.formControl}>
                <TextField
                  {...commonProps}
                  select={true}
                  value={currency}
                  label="Currency"
                  onChange={e => setCurrency(e.target.value)}
                >
                  {Object.values(CURRENCY).map(option => (
                    <MenuItem key={option} value={option}>
                      {option} ({CURRENCY_SYMBOLS[option]})
                    </MenuItem>
                  ))}
                </TextField>
              </FormControl>
            </Grid>
          </Grid>
          <Grid container={true} component="div" spacing={2}>
            <Grid item={true} xs={12} component="div">
              <FormControl className={classes.formControl}>
                <TextField
                  {...commonProps}
                  rowsMax={4}
                  label="Memo"
                  multiline={true}
                  value={memo || ""}
                  error={!!memoError}
                  helperText={memoError}
                  onChange={e => setMemo(e.target.value)}
                />
              </FormControl>
            </Grid>
          </Grid>
          {isErrorMakingPayment && (
            <FormHelperText error={true}>
              Error making payment. Refresh the page or try again later.
            </FormHelperText>
          )}
        </DialogContent>
      )}
      <DialogActions>
        <Button href={null} variant="outlined" onClick={handleClose}>
          Cancel
        </Button>
        <div className={classes.wrapper}>
          <Button
            href={null}
            color="primary"
            variant="contained"
            onClick={handleSubmit}
            disabled={isConfirmDisabled || isMakingPayment}
          >
            Send payment
          </Button>
          {isMakingPayment && (
            <CircularProgress size={24} className={classes.buttonProgress} />
          )}
        </div>
      </DialogActions>
    </Dialog>
  );
};

NewPaymentsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  recipients: PropTypes.array.isRequired,
  onMakePayment: PropTypes.func.isRequired,
  isMakingPayment: PropTypes.bool.isRequired,
  isErrorLoadingUsers: PropTypes.bool.isRequired,
  isErrorMakingPayment: PropTypes.bool.isRequired
};

export default NewPaymentsModal;
