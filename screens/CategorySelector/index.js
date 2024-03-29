import React, { Component } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View, ScrollView, Image} from 'react-native';
import { Avatar, Button, Card, Title, Paragraph, Divider, Appbar } from 'react-native-paper';
import { FlatGrid } from 'react-native-super-grid';

import FixedTopBar from '../../components/FixedTopBar';

// API URL
const BACKEND_URL = 'http://bookingapp.ga:3000';

export default class CategorySelector extends Component {

  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);

    this.state = {
      categories: [
        { name: '음식점',    color: '#1abc9c',   imageSource: require('./CategorySelectorIcon/Restaurant_icon.png')},
        { name: '카페',      color: '#2ecc71',   imageSource: require('./CategorySelectorIcon/Cafe_icon.png')},
        { name: '회의실',    color: '#1abc9c',   imageSource: require('./CategorySelectorIcon/MeetingRoom_icon.png')},
        { name: '네일 아트', color: '#2ecc71',   imageSource: require('./CategorySelectorIcon/NailArt_icon.png')},
        { name: '방 탈출',   color: '#1abc9c',   imageSource: require('./CategorySelectorIcon/EscapeRoom_icon.png') },
        { name: '농촌 체험', color: '#2ecc71',   imageSource: require('./CategorySelectorIcon/RuralExp_icon.png') },
        { name: '준비중...', color: '#1abc9c',   imageSource: require('./CategorySelectorIcon/Waiting_icon.png') },
      ]
    };
  }

  // CategorySelector는 DB에서 따로 Data를 fetch하지 않음.
  // 서비스의 분류별로 데이터를 갖고 있게 만든다.
  async componentDidMount() {}

  toReserveQueryPage(){
    this.props.navigation.navigate(
      'ReserveQueryPage',
      {
      }
    );
  }

  onPressItem(item) {
    this.props.navigation.navigate(
      'StoreSelector',
      {
        category: item
      }
    );
  }

  render() {
    return (
      <>
        <Appbar style={appBarStyles.topFixed}>
          <Text style={appBarStyles.titleStyle}>{"자리있나요?"}</Text>
          <TouchableOpacity onPress={() => this.toReserveQueryPage()}>
            <Text style={appBarStyles.serviceQueryBtn}>{"예약 조회"}</Text>
          </TouchableOpacity>
        </Appbar>
        <View style={styles.container}>
          <FlatGrid
            itemDimension={100}
            items={this.state.categories}
            style={gridStyles.gridView}
            renderItem={({ item, index }) => (
              <TouchableOpacity onPress={() => this.onPressItem(item.name)}>
                <View style={[gridStyles.itemContainer, { backgroundColor: item.color }]}>
                  <Image style={itemStyles.itemIcon} source={item.imageSource}/>
                  <Text style={itemStyles.itemName}>{item.name}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    marginTop: 60,
    backgroundColor: 'white',
  },

  text: {
    fontFamily: 'BMJUA_ttf',
    marginBottom: 10,
    fontSize: 16,
  },

  cityTitle: {
    fontSize: 35,
  },

  ActivityIndicatorStyle:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

});

const gridStyles = StyleSheet.create({

  gridView: {
    flex: 1,
  },

  itemContainer: {
    justifyContent: 'flex-end',
    borderRadius: 5,
    padding: 10,
    height: 150,
  },

});

const itemStyles = StyleSheet.create({

  itemName: {
    flex: 2,
    fontFamily: 'BMJUA_ttf',
    fontSize: 25,
    fontWeight:'bold',
    color: '#333',
    fontWeight: '600',
    textAlign: 'center',
  },

  itemIcon: {
    flex: 5,
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    marginBottom: 10,
  },

});

const appBarStyles = StyleSheet.create({

  topFixed: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    backgroundColor: '#3cb371',
  },

  titleStyle: {
    marginLeft: 15,
    fontFamily: 'BMJUA_ttf',
    color: '#000000',
    fontSize: 25,
    flex: 1,
  },

  iconsStartStyle: {
    alignSelf: 'flex-start',
  },

  iconsEndStyle: {
    alignSelf: 'flex-end',
  },

  serviceQueryBtn:{
    fontFamily: 'BMJUA_ttf',
    fontSize: 20,
    right: 5,
  }
  
});
