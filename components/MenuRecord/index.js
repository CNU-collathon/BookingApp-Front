import React, { Component } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import { Divider, DataTable, TextInput } from 'react-native-paper';
import NumericInput from 'react-native-numeric-input'

export default class MenuRecord extends Component {

  constructor(props) {
    super(props);

    const { menuName, price, personCnt } = this.props;

    this.state = {
        menuName: menuName,
        price: price,
        personCnt: personCnt
    };
  }

  spinboxChangeEvt(value){

    const { callback } = this.props;

    this.setState({personCnt: value});

    callback(this.props.index, value);
  }

  render() {
    const { menuPressed, personCnt, callback } = this.props;

    if(this.state.personCnt == 0) return <></>;

    return (
      <>
       <DataTable.Row>
        <TouchableOpacity onPress={() => menuPressed()}>
          <DataTable.Cell>{this.state.menuName}</DataTable.Cell>
        </TouchableOpacity>

        <DataTable.Cell></DataTable.Cell>
        <DataTable.Cell>{this.state.personCnt * this.state.price}</DataTable.Cell>

        <NumericInput
           value={this.state.personCnt}
           onChange={value => { this.spinboxChangeEvt(value);}}
           totalWidth={105}
           totalHeight={45}
           iconSize={25}
           minValue={0}
           maxValue={99}
           step={1}
           valueType='real'
           rounded
           textColor='#000000'
           iconStyle={{ color: 'white' }}
           rightButtonBackgroundColor='#c4c4c4'
           leftButtonBackgroundColor='#c4c4c4'/>

        </DataTable.Row>
      </>
    );
  }
}
