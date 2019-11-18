import React, { Component } from 'react';
import { Appbar } from 'react-native-paper';
import { StyleSheet, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default class FixedTopBar extends Component {

  render() {
    const { title, iconStr } = this.props;

    return (
      <Appbar style={appBarStyles.topFixed}>
        {iconStr !== "" ? <Icon name={iconStr} size={40} color="#ffffff" style={{marginLeft: 7}} />: <Icon />}
        <Text style={appBarStyles.titleStyle}>{title}</Text>
      </Appbar>
    );
  }
}

const appBarStyles = StyleSheet.create({
  topFixed: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 50,
    backgroundColor: '#3cb371',
  },

  titleStyle: {
    marginLeft: 15,
    fontFamily: 'BMJUA_ttf',
    color: 'black',
    fontSize: 30,
    flex: 1,
  },

  iconsStartStyle: {
    alignSelf: 'flex-start',
  },

  iconsEndStyle: {
    alignSelf: 'flex-end',
  }
});
