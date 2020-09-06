import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";

const styles = {
  input: {
    color: "white"
  },
  size: "medium"
};

function CustomizedInputs(props) {
  const { classes } = props;

  return (
    <TextField
	  placeholder="Enter a sinner"
      className={classes.root}
      InputProps={{
        className: classes.input
	  }}
	  onChange={props.onChange}
    />
  );
}

CustomizedInputs.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(CustomizedInputs);