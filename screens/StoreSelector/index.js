import React, { Component } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View, ScrollView, Image } from 'react-native';
import { Avatar, Button, Card, Title, Paragraph, Divider, ActivityIndicator, Colors } from 'react-native-paper';

import FixedTopBar from '../../components/FixedTopBar';

// API URL
const BACKEND_URL = 'http://bookingapp.ga:3000';

export default class StoreSelector extends Component {

  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      //  SelfEmployedID, Address, WorkPlaceInfo, Name, Category, Image
      stores: []
    }
  }

  async componentDidMount() {
    fetch(BACKEND_URL + '/stores/' + this.props.navigation.getParam('category', null))
    .then(response => response.json())
    .then(stores => {
      this.setState({
        stores: stores,
        isLoading: false
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

  renderItem(store) {

    let imageBinaryData = "";

    if(typeof store.Image != "undefined"){
      imageBinaryData = store.Image.File;
    }

    return (
      <View>
        <Card>
          <TouchableOpacity onPress={() => this.onPressItem(store.Name, store.WorkPlaceID)}>
            <Card.Title style={cardtitle.title}
                        title={store.Name}
                        titleStyle={cardtitle.titleStyle}
                        subtitleStyle={cardtitle.subtitleStyle}
                        left={(props) => typeof store.Image == "undefined" ?
                          // <Avatar.Icon>에서 Image 태그로 수정
                          <Image style={image.storeImage} source={require('./default_Image/default_store.png')}></Image> :
                          <Image style={image.storeImage} source={{uri: `data:image/gif;base64,${imageBinaryData}`}} />}
                        />
          </TouchableOpacity>
        </Card>
        <Divider />
      </View>
    );
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

    return (
      <View>
        <FixedTopBar title={navigation.getParam('category', null)} iconStr="" />
        <ScrollView>
          <FlatList style={styles.container}
                    renderItem={({ item }) => this.renderItem(item)}
                    keyExtractor={item => item}
                    data={this.state.stores}
          />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
    backgroundColor: '#ffffff',
  },

  ActivityIndicatorStyle:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

});

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
    marginTop: 5,
  }
});
