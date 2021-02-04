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

class Tape extends Component {

    render(){
        const tape = [...this.props.tape]

        return (
            <Fragment>
                <Grid container>
                    <Box flexGrow={1}/>

                    <Grid item>

                        <Grid direction={'row'} alignItems="center" container>
                            {tape.map(t => (
                                <Fragment>
                                {t != 'X' ?
                                <Grid item>
                                <Typography variant="h5" align="center">
                                    {t}
                                </Typography>
                                </Grid>
                                :
                                <Grid item>
                                <RedTextTypography variant="h5" align="center">
                                    {'#'}
                                </RedTextTypography>
                                </Grid>
                                }
                                </Fragment>
                            ))}
                        </Grid>

                    </Grid>

                    <Box flexGrow={1}/>
                </Grid>

            </Fragment>
        )
    }

}

export default Tape;