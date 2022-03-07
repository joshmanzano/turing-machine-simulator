import React, { Component } from 'react';
import { Grid } from 'gridjs-react';

class StateTable extends Component {

  render(){
    return (
    <Grid
      data = {this.props.rows}
      columns={['State', 'Action', 'Value']}
      search={false}
      pagination={{
        enabled: true,
        limit: 5,
      }}
      />
    );
  }
}

export default StateTable;
