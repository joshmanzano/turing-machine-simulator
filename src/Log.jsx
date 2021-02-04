import React, { Component, Fragment } from 'react';
import { withStyles } from "@material-ui/core/styles";
import {
  Container, Typography, Box, Grid, TextField, IconButton, Button,
  FormGroup, FormControlLabel, Switch
} from '@material-ui/core';
import Tape from './Tape';

const RedTextTypography = withStyles({
  root: {
    color: "#b20000"
  }
})(Typography);

class Log extends Component {

    render(){
        const tape = [...this.props.log.tape]
        const action = this.props.log.action

        return (
            <Box my={2}>
                <Typography variant="h5" align="center">
                    {action.action} {action.value}
                </Typography>
                <Tape tape={tape}/>
            </Box>
        )
    }

}

export default Log;