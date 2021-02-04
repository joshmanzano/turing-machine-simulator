import React, { Component, Fragment } from 'react';
import { withStyles } from "@material-ui/core/styles";
import {
  Container, Typography, Box, Grid, TextField, IconButton, Button,
  FormGroup, FormControlLabel, Switch
} from '@material-ui/core';

import StateTable from './StateTable'
import AddIcon from '@material-ui/icons/Add';
import axios from 'axios';
import Toast from 'light-toast';
import Log from './Log';
import Tape from './Tape';


const RedTextTypography = withStyles({
  root: {
    color: "#b20000"
  }
})(Typography);

const sqrtProgram =
`1] shR-1
2] const-1
3] shR-1
4] copy-1
5] copy-2
6] shL-2
7] mult
8] shR-1
9] copy-3
10] shL-2
11] ifEQ-17
12] const-1
13] shL-1
14] add
15] shR-1
16] goto-4
17] shL-1
18] move-1-1
19] halt`

const gcdProgram = 
`1] shR-2
2] copy-2
3] copy-2
4] shL-2
5] ifEQ-26
6] copy-2
7] copy-2
8] shL-2
9] ifGT-17
10] copy-1
11] copy-3
12] shL-2
13] monus
14] move-1-1
15] shL-1
16] goto-1
17] copy-2
18] copy-2
19] shL-2
20] monus
21] shR-1
22] copy-2
23] shL-2
24] move-2-2
25] goto-1
26] copy-2
27] shL-1
28] move-2-1
29] halt`

class Screen extends Component {

  constructor(props){
      super(props);
      this.state = {
        rows: [],
        state: 1,
        action: '',
        input: '',
        nextState: '',
        string: '',
        result: 'None',
        line: '',
        logs: [],
        toggle: true,
      };
  }
  
  handleChange = (event) => {
    const name = event.target.name
    const value = event.target.value
    const state = {}
    state[name] = value
    this.setState(state)
  }

  processValue = (value, rows) => {
    const regState = /^[0-9]+/
    const regAction = /[a-zA-Z]+/ 
    const regGiven = /(-+(\d+)|\(\d+\))/g

    if(value.match(regState) != null && value.match(regAction) != null){
      const state = value.match(regState)[0]
      const action = value.match(regAction)[0]
      if(value.match(regGiven) == null){
        rows.push([state,action,''])
      }else{
        let given = []
        value.match(regGiven).forEach(v => {
          const val = v.replace('-','').replace('(','').replace(')','')
          given.push(val)
        })
        given = given.join(',')
        rows.push([state,action,given])
      }
      // if(action == 'accept'){
      //   rows.push([state,action,'',''])
      // }else if(action == 'reject'){
      //   rows.push([state,action,'',''])
      // }else{
      //   const transitions = [...value.matchAll(regTransition)]
      //   transitions.forEach(t => {
      //     const transition = t[0].replace('(','').replace(')','').replace(' ','').split(',')
      //     rows.push([state,action,transition[0], transition[1]])
      //   })
      // }
    }
    return rows
  }

  handleLine = (event) => {
    // const value = event.target.value.toLowerCase()
    const value = event.target.value
    const rows = []
    // const actions = ['const','shR','shL','mult']
    this.setState({line: value})
    const regLine = /(\d+]) *[a-zA-Z]+-*\(*(\d+)*\)*-*(\d+)*/g
    // const regLine = /(\d+]) *(const|shR|shL|mult) *(\([\w|#]+ *, *\d+\))*/g
    const lines = [...value.matchAll(regLine)]
    lines.forEach(l => {
      this.processValue(l[0], rows)
    })
    this.setState({rows})
  }

  e1 = () => {
    const event = {}
    event['target'] = {}
    event['target']['value'] = sqrtProgram
    this.setState({string: '9'})
    this.handleLine(event)
  }
  e2 = () => {
    const event = {}
    event['target'] = {}
    event['target']['value'] = gcdProgram
    this.setState({string: '8#6'})
    this.handleLine(event) 
  }
  e3 = () => {

  }

  handleToggle = () => {
    // this.setState({toggle: !this.state.toggle})
  }

  addState = () => {
    const row = []
    const rows = this.state.rows
    row.push(this.state.state)
    row.push(this.state.action)
    row.push(this.state.input)
    row.push(this.state.nextState)
    rows.push(row)
    this.setState({input: '', nextState: ''}, () => {
      this.setState({rows})
    })
  }

  submit = () => {
    const data = {}
    data['states'] = []
    this.state.rows.forEach(row => {
      data['states'].push({
        'stateNumber': row[0],
        'action': row[1],
        'value': row[2],
      })
    })
    // this.state.rows.forEach(row => {
    //   if(row[0] in stateData){
    //     stateData[row[0]]['transitions'].push(
    //         {
    //           'character': row[2],
    //           'stateNumber': row[3]
    //         }
    //       )
    //   }else{
    //     stateData[row[0]] = {
    //       'stateNumber': row[0],
    //       'action': row[1],
    //       'transitions': [
    //         {
    //           'character': row[2],
    //           'stateNumber': row[3]
    //         }
    //       ]
    //     }

    //   }

    // })
    // Object.entries(stateData).forEach(([key, val]) => {
    //   data['states'].push(val)
    // });
    data['input'] = this.state.string
    console.log(data['states'])
    console.log(data['input'])
    Toast.loading('Simulating...')
    axios.post('https://joshuamanzano.pythonanywhere.com/tmsimulator', data)
    .then(res => {
      console.log(res)
      this.setState({logs:res['data']['results']['logs']}, () => {
        this.setState({result:res['data']['results']['tapeString']}, () => {
          Toast.success('Simulated!',1000)
        })
      })
    }).catch(err => {
      console.log(err)
      Toast.fail('Error in input!',1000)
    })
  }

  render(){
    return (
    <Container maxWidth={'md'} alignItems='center'>
      <Box my={4}>
        <Typography variant="h3" align="center">
          Turing Machine Simulator <img width="64" src="apple-touch-icon.png"></img> 
        </Typography>
      </Box>
      <StateTable rows={this.state.rows}/>
      <Box my={2}>
        <FormControlLabel
          control={
            <Switch
              checked={this.state.toggle}
              onChange={this.handleToggle}
              name="checkedB"
              color="Primary"
            />
          }
          label="Multiline input"
        />
      </Box>
      <Box my={2}>
        <Grid container alignItems="center" spacing={1}>
          {this.state.toggle ? 
          <Grid item xs={12}>
            <TextField placeholder="1] const-1" multiline fullWidth onChange={this.handleLine} value={this.state.line} variant="outlined" name='nextState' label="Multiline input"></TextField>
          </Grid>
          :
          <Fragment>
            <Grid item xs={6} md={2}>
              <TextField onChange={this.handleChange} value={this.state.state} variant="outlined" name='state' label="State"></TextField>
            </Grid>
            <Grid item xs={6} md={3}>
              <TextField onChange={this.handleChange} value={this.state.action} variant="outlined" name='action' label="Action"></TextField>
            </Grid>
            <Grid item xs={6} md={3}>
              <TextField onChange={this.handleChange} value={this.state.input} variant="outlined" name='input' label="Input"></TextField>
            </Grid>
            <Grid item xs={6} md={3}>
              <TextField onChange={this.handleChange} value={this.state.nextState} variant="outlined" name='nextState' label="Next State"></TextField>
            </Grid>
            <Grid item xs={12} md={1}>
              <Button fullWidth size="large" variant="contained" onClick={this.submit}>
                <AddIcon/>
              </Button>
            </Grid>
          </Fragment>
          }
        </Grid>
      </Box>
      <Box my={4}>
        <Grid container alignItems="center" spacing={1}>
          <Grid item xs={3}>
            <Typography variant="h6" align="center">
              Examples:
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Button onClick={this.e1} variant="contained" color="primary">
              Sqrt
            </Button>
          </Grid>
          <Grid item xs={3}>
            <Button onClick={this.e2} variant="contained" color="primary">
              GCD
            </Button>
          </Grid>
          {/* <Grid item xs={3}>
            <Button onClick={this.e3} variant="contained" color="primary">
              Program 3
            </Button>
          </Grid> */}
        </Grid>

      </Box>
      <Box my={4}>
        <Grid alignItems="center" container spacing={2}>
          <Grid item xs={12} md={10}>
            <Grid alignItems="center" container>
                <Grid alignItems="center" item xs={1}>
                  <RedTextTypography variant="h5" align="center">
                    #
                  </RedTextTypography>
                </Grid>
              <Grid item xs={9}>
                <TextField fullWidth placeholder="11#11" onChange={this.handleChange} value={this.state.string} variant="outlined" name='string' label="Input configuration"></TextField>
              </Grid>
                <Grid item xs={1}>
                  <Typography variant="h5" align="center">
                  #
                  </Typography>
                </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button onClick={this.submit} variant="contained" color="primary">
              Run Simulation 
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Box mt={4} mb={8}>
        <Typography variant="h4" align="center">
          Result:
        </Typography>
        <Box mt={2}>
          <Tape tape={this.state.result}/>
        </Box>
      </Box>
      {this.state.logs.length > 0 &&
      <Box my={4}>
        <Typography variant="h4" align="center">
          Logs:
        </Typography>
      </Box>
      }
      <Box my={4}>
        {this.state.logs.map(log => (
          <Log log={log}/>
        ))}
      </Box>
    </Container>
    );
  }
}

export default Screen;