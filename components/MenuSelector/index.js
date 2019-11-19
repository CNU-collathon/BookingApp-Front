import React, { Component } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View, ScrollView, Image } from 'react-native';
import { Avatar, Button, Card, Title, Paragraph, Divider } from 'react-native-paper';
import { Appbar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

import FixedTopBar from '../../components/FixedTopBar';

export default class MenuSelector extends Component {

  constructor(props){
    super(props);
    
    this.state = {
      menues: [
        {name: '청춘 돈까스', won: '5500원', source: require('./StoreMenu/ChungChun_Menu/menu1.jpg')},
        {name: '불빨간 돈까스', won: '6000원', source: require('./StoreMenu/ChungChun_Menu/menu2.jpg')},
        {name: '와사비 카레 돈까스', won: '6500원', source: require('./StoreMenu/ChungChun_Menu/menu3.jpg')},
        {name: '치즈 롤 돈까스', won: '6500원', source: require('./StoreMenu/ChungChun_Menu/menu4.jpg')},
      ],
    };
  }

  renderItem(menu, menuClickEvent) {
    return (
      <View>
        <Card style={[{backgroundColor: 'black'}]}>
          <TouchableOpacity onPress={() => menuClickEvent(menu.Name , menu.Price)}>
            <Card.Title style={cardtitle.card} title={menu.Name} titleStyle={cardtitle.title} subtitle={`${menu.Price}원`} subtitleStyle={cardtitle.subtitle} 
            left={(props) =>
              <Image {...props} style={image.imageStyle} source={menu.source} />} 
            />
          </TouchableOpacity>
        </Card>
        <Divider />
      </View>
    );
  }

  render() {
    const { menus, menuClickEvent } = this.props;

    return (
      <>
        <FlatList renderItem={({ item }) => this.renderItem(item, menuClickEvent)}
                  keyExtractor={item => item}
                  data={menus}
        />
      </>
    );
  }
}

const cardtitle = new StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    height: 100,
    borderBottomWidth: 1,
    borderBottomColor: 'black',
  },

  title: {
    marginLeft: 50,
    fontSize: 25,
    fontFamily: 'BMJUA_ttf',
  },
  
  subtitle:{
    marginLeft: 60,
    fontSize: 20,
    marginTop: 10,
    fontFamily: 'BMJUA_ttf',
  }
});

const image = new StyleSheet.create({
  imageStyle: {
    height: 85,
    width: 85,
  }
});
