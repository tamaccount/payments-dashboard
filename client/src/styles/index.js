import { makeStyles } from "@material-ui/core/styles";
import { green } from "@material-ui/core/colors";

export const dashboardStyles = makeStyles(theme => ({
  root: {
    display: "flex"
  },
  toolbar: {
    paddingRight: 24,
    justifyContent: "space-between"
  },
  title: {
    flexGrow: 1
  },
  toolbarLeft: {
    display: "flex",
    alignItems: "center"
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto"
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4)
  }
}));

export const paymentModalStyles = makeStyles(theme => ({
  formControl: {
    margin: `${theme.spacing(1)}px 0`,
    minWidth: "100%",
    boxSizing: "border-box"
  },
  wrapper: {
    margin: theme.spacing(1),
    position: "relative"
  },
  buttonProgress: {
    color: green[500],
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12
  }
}));
