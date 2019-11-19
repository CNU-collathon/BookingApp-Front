import React, { Component } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View, ScrollView, Image } from 'react-native';
import { Avatar, Button, Card, Title, Paragraph, Divider, Appbar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

import FixedTopBar from '../../components/FixedTopBar';
import MenuSelector from '../../components/MenuSelector';

// API URL
const BACKEND_URL = 'http://c00bfdae.ngrok.io';

export default class StorePage extends Component {

  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);

    this.state = {

      SelfEmployedID: '',
      Address: '',
      WorkPlaceID: '',
      Name: '',
      Category: '',
      WorkPlaceInfo: '',

      // 받아오는 API가 다름
      menus: [],
    };
  }

  async componentDidMount() {

    fetch(BACKEND_URL + '/menu/' + this.props.navigation.getParam('workPlaceID', null))
    .then(response => response.json())
    .then(menus => {
      this.setState({
        menus: menus
      });
    });

    fetch(BACKEND_URL + '/store/' + this.props.navigation.getParam('workPlaceID', null))
    .then(response => response.json())
    .then(storeInfo => {
      this.setState({
        SelfEmployedID: storeInfo.SelfEmployedID,
        Address: storeInfo.Address,
        WorkPlaceID: storeInfo.WorkPlaceID,
        Name: storeInfo.Name,
        Category: storeInfo.Category,
        WorkPlaceInfo: storeInfo.WorkPlaceInfo,
      });
    });
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
    const { navigation } = this.props;

    return (
      <>
        
        {/*(원래 코드) <FixedTopBar title={navigation.getParam('store', null)} iconStr="" />*/}
        
        <FixedTopBar title="test용 코드" iconStr="" />

        <ScrollView style={styles.container}>
          <Card>
            <Card.Content style={cardcontent.introduceStore}>
              <Image style={content.introduceStoreImage} source={require('./StoreMenu/test.png')}></Image>
              <Divider style={content.layout}>
                <Title style={content.introduceStoreTitle}>Store Infomation</Title>
                <Paragraph style={content.introduceStoreParagraph}>{/*{this.state.WorkPlaceID}*/}Test Text</Paragraph>
              </Divider>
            </Card.Content>
          </Card>

          <Divider style={[{borderBottomWidth: 1, borderBottomColor: 'black'}]} />
          {/* 메뉴 선택 창 확인 필요 */}
          <MenuSelector menus={this.state.menus}
                        menuClickEvent={() => console.log("dd")}/>
        </ScrollView>

        <Appbar style={appBarStyles.bottomFixed}>
          {/* <Icon name="wb-sunny" size={25} color="#ffffff" style={{marginLeft: 7}} /> */}
          <Appbar.Action style={appBarStyles.iconsStyle} color='white' icon="arrow-forward" onPress={() => this.toRervationPage()} />
        </Appbar>
      </>
    );
  }
}

const cardcontent = StyleSheet.create({
  introduceStore: {
    flexDirection: 'row',
    backgroundColor: '#EAEAEA',
    //or #DEF7DE
  },
});

const content = StyleSheet.create({
  layout:{
    flexDirection: 'column',
  },

  introduceStoreImage: {
    height: 100,
    width: 100,
  },

  introduceStoreTitle:{
    fontFamily: 'BMJUA_ttf',
    marginTop: 10,
    marginLeft: 25,
    fontSize: 30,
  },

  introduceStoreParagraph: {
    fontFamily: 'BMJUA_ttf',
    marginLeft: 35,
    marginTop: 10,
    fontSize: 20,
  },
});

const appBarStyles = StyleSheet.create({

  bottomFixed: {
    left: 0,
    right: 0,
    bottom: 0,
    height: 50,
    backgroundColor: '#3cb371',
  },
  iconsStyle:{
    backgroundColor: '#3cb371',
    width: '100%',
    height:'100%',
  },

  titleStyle: {
    marginLeft: 15,
    fontFamily: 'BMJUA_ttf',
    color: '#000000',
    fontSize: 20,
    flex: 1,
  },

  iconsStartStyle: {
    alignSelf: 'flex-start',
    backgroundColor: 'red',
  },

  iconsEndStyle: {
    alignSelf: 'flex-end',
  }

});


const styles = StyleSheet.create({

  container: {
    flex: 0,
    marginTop: 50,
    // marginBottom은 BottomFixedAppbar의 높이가 되게 넣을 것
    // marginBottom은 BottomFixedAppbar의 높이가 되게 넣을 것
    backgroundColor: 'white',
  },

});
