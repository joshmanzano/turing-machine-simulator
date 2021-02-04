import React, { Component, Fragment } from 'react';
import { withStyles } from "@material-ui/core/styles";
import {
  Container, Typography, Box, Grid, TextField, IconButton, Button,
  FormGroup, FormControlLabel, Switch
} from '@material-ui/core';

const RedTextTypography = withStyles({
  root: {
    color: "#b20000"
  }
})(Typography);

class Log extends Component {

    render(){
        const tape = [...this.props.log.tape]
        const action = this.props.log.action
        console.log(action)
        console.log(tape)

        return (
            <Fragment>
                <Typography variant="h5" align="center">
                    {action.action} {action.value}
                </Typography>
                <Typography variant="h5" align="center">
                    {tape}
                </Typography>
            </Fragment>
        )
    }

}

export default Log;