import React, { Component } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View, ScrollView, Image } from 'react-native';
import { Avatar, Button, Card, Title, Paragraph, Divider, Appbar, ActivityIndicator, Colors } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

import FixedTopBar from '../../components/FixedTopBar';
import MenuSelector from '../../components/MenuSelector';

// API URL
const BACKEND_URL = 'http://bookingapp.ga:3000';

export default class StorePage extends Component {

  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);

    this.state = {

      isLoading: true,

      StoreInfo: "",

      // 받아오는 API가 다름
      menus: [],
    };
  }

  async componentDidMount() {

    await fetch(BACKEND_URL + '/menu/' + this.props.navigation.getParam('workPlaceID', null))
    .then(response => response.json())
    .then(menus => {
      this.setState({
        menus: menus
      });
    });

    await fetch(BACKEND_URL + '/store/' + this.props.navigation.getParam('workPlaceID', null))
    .then(response => response.json())
    .then(storeInfo => {
      this.setState({
        StoreInfo: storeInfo
      });
    });

    this.setState({ isLoading: false });
  }

  toRervationPage() {

    this.props.navigation.navigate(
      'Reservation',
      {
        menus: this.state.menus,
        workPlaceID: this.props.navigation.getParam('workPlaceID', null)
      }
    );
  };

  onPressItem(item) {

  }

  render() {

    if (this.state.isLoading) {
      return (
        <ActivityIndicator style={styles.ActivityIndicatorStyle}
                           animating={true}
                           color={Colors.blue200} />
      )
    }

    const { navigation } = this.props;
    const imageComponent = [];

    let imageBinaryData = "";

    if (typeof this.state.StoreInfo[0].Image != "undefined"){

      imageBinaryData = this.state.StoreInfo[0].Image.File;

      imageComponent.push(
        <Card.Cover source={{uri: `data:image/gif;base64,${imageBinaryData}`}}
        />
      );
    }

    return (
      <>
        <FixedTopBar title={navigation.getParam('store', null)} iconStr="" />

        <ScrollView style={{height: 535}}>
          <Card>
            <Card.Content style={cardcontent.introduceStore}>
                <Divider style={content.layout,[{borderBottomWidth:1, borderBottomColor: '#EAEAEA'}]}>
                  <Title style={content.introduceStoreTitle}>Store Information</Title>
                  {imageComponent}
                  <Paragraph style={content.introduceStoreParagraph}>{this.state.StoreInfo[0].WorkPlaceInfo}</Paragraph>
                </Divider>
            </Card.Content>
          </Card>
        </ScrollView>

        <ScrollView>
          <Divider style={[{borderBottomColor: 'black', borderBottomWidth: 1}]}/>
          <MenuSelector menus={this.state.menus}
                        menuClickEvent={() => console.log("dd")}/>
        </ScrollView>

        <TouchableOpacity onPress={() => this.toRervationPage()}>
          <View style={appBarStyles.bottomFixed}>
            <View style={[{flex:1}]}></View>
            <Text style={appBarStyles.text}>예약하기</Text>
            <View style={[{flex:1}]}></View>
          </View>
        </TouchableOpacity>
      </>
    );
  }
}

const cardcontent = StyleSheet.create({
  introduceStore: {
    marginTop: 35,
    height: 400,
    flexDirection: 'column',
    backgroundColor: '#EAEAEA',
  },
});

const content = StyleSheet.create({
  layout:{
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  introduceStoreTitle:{
    fontFamily: 'BMJUA_ttf',
    marginTop: 10,
    marginLeft: 10,
    fontSize: 30,
    alignItems: 'center',
  },

  introduceStoreParagraph: {
    fontFamily: 'BMJUA_ttf',
    marginLeft: 15,
    marginTop: 10,
    fontSize: 20,
  },
});

const appBarStyles = StyleSheet.create({

  bottomFixed: {
    left: 0,
    right: 0,
    bottom: 0,
    height: 60,
    backgroundColor: '#3cb371',
    flexDirection: 'column',
  },

  text:{
    fontFamily: 'BMJUA_ttf',
    color: '#EAEAEA',
    fontSize: 40,
    textAlign: 'center',
  },

});

const styles = StyleSheet.create({

  container: {
    flex: 1,
    marginTop: 50,
    backgroundColor: 'white',
  },

  ActivityIndicatorStyle:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

});
