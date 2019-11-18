import React, { Component } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View, ScrollView, Image } from 'react-native';
import { Avatar, Button, Card, Title, Paragraph, Divider } from 'react-native-paper';

import FixedTopBar from '../../components/FixedTopBar';

// API URL
const BACKEND_URL = 'http://c00bfdae.ngrok.io';

export default class StoreSelector extends Component {

  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);

    this.state = {
      //  SelfEmployedID, Address, WorkPlaceInfo, Name, Category
      stores: [
        {name: '청춘 우동 까스', info: '설명 요약', source: require('./StoreTitle_folder/ChungChun_title.jpg')},
        {name: '누오보 나폴리', info: '설명 요약', source: require('./StoreTitle_folder/Nuovo_title.png')},
        {name: '훈불', info: '설명 요약', source: require('./StoreTitle_folder/Hoonbool_title.jpg')},
      ]
    }
  }

  async componentDidMount() {
    fetch(BACKEND_URL + '/stores/' + this.props.navigation.getParam('category', null))
    .then(response => response.json())
    .then(stores => {
      this.setState({
        stores: stores
      });
    });
  }

  onPressItem(item, workPlaceID) {
    this.props.navigation.navigate(
      'StorePage',
      {
        store: item,
        workPlaceID: workPlaceID
      }
    );
  }

  renderItem(store, workPlaceID) {
    return (
      <View>
        <Card>
          <TouchableOpacity onPress={() => this.onPressItem(store, workPlaceID)}>
            <Card.Title style={cardtitle.title} title="name" titleStyle={cardtitle.titleStyle} subtitle="subtitle" subtitleStyle={cardtitle.subtitleStyle}
            left={(props) => 
              <Image {...props} style={image.storeImage} source={require('./StoreTitle_folder/ChungChun_title.jpg')} >
              </Image>
            }
            ></Card.Title>
          </TouchableOpacity>
        </Card>
        <Divider />
      </View>
    );
  }

  render() {

    const { navigation } = this.props;

    return (
      <View>
        <FixedTopBar title={navigation.getParam('category', null)} iconStr="" />
        <ScrollView>
          <FlatList style={styles.container}
                    renderItem={({ item }) => this.renderItem(item.Name, item.WorkPlaceID)}
                    keyExtractor={item => item}
                    data={this.state.stores}
          />
        </ScrollView>
      </View>
    );
  }
}

const cardtitle = StyleSheet.create({
  titleStyle: {
    fontSize: 30,
    fontFamily: 'BMJUA_ttf',
    marginLeft: 60,
  },
  
  subtitleStyle: {
    fontSize: 20,
    fontFamily: 'BMJUA_ttf',
    marginLeft: 70,
    marginTop: 10,
  },
  
  title: {
    backgroundColor: 'white',
    height: 120,
    borderBottomWidth: 1,
    borderBottomColor: 'black',
  }

});

const image = StyleSheet.create({
  storeImage: {
    backgroundColor: 'white',
    height: 100,
    width: 100,
  }
});

const styles = StyleSheet.create({
  
  container: {
    flex: 1,
    marginTop: 50,
    backgroundColor: '#ffffff',
  },

});
