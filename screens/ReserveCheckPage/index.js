import React, { Component } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import { Avatar, Button, Card, Title, Paragraph, Divider, DataTable, Appbar, TextInput, ActivityIndicator, Colors } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'react-native-axios'
import NumericInput from 'react-native-numeric-input'

import FixedTopBar from '../../components/FixedTopBar';
import MenuRecord from '../../components/MenuRecord';

import DialogManager, { ScaleAnimation, DialogContent, DialogComponent, DialogTitle } from 'react-native-dialog-component';

// API URL
const BACKEND_URL = 'http://bookingapp.ga:3000';

export default class ReserveCheckPage extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      header: null,
      reservationID: navigation.getParam('reservationID', 'Unknown'),
    };
  };

  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      reservationID: this.props.navigation.getParam('reservationID', null),

      Address: '',
      WorkPlaceInfo: '',
      ReservedDateTime: '',
      EndDateTime: '',
      Menu: [],

      dateTimeSelectorModal: null,
      menuModal: null,
    };
  }

  async componentDidMount() {
    fetch(BACKEND_URL + '/reservation/lookup/' + this.props.navigation.getParam('reservationID', null))
    .then(response => response.json())
    .then(reservation => {
      this.setState({
        Address: reservation.Address,
        WorkPlaceInfo: reservation.WorkPlaceInfo,
        ReservedDateTime: reservation.ReservedDateTime,
        EndDateTime: reservation.EndDateTime,
        Menu: reservation.Menu,
        isLoading: false
      });
    });
  }

  reserveChange() {

    axios({
      headers: {'Access-Control-Allow-Origin': '*'},
      method: 'put',
      // fill this url
      url: BACKEND_URL + '/reservation/' + this.state.reservationID,
      data: {
        ReservedDateTime: this.state.ReservedDateTime,
        EndDateTime: this.state.EndDateTime,
        Menu: this.state.Menu,
      }
    });

    this.dialogComponent.show();

  }

  reserveCancel() {
    axios({
      headers: {'Access-Control-Allow-Origin': '*'},
      method: 'delete',
      // fill this url
      url: BACKEND_URL + '/reservation/cancel/' + this.state.reservationID,
      data: {
      }
    });

    this.cancelDialogComponent.show();
  }

  menuModalRender = () => (
    <>
      <ScrollView>
          <Card>
            <Card.Content>
              <Title>Menu Information</Title>
            </Card.Content>
          </Card>

          <Divider />

          <MenuSelector menus={this.props.navigation.getParam('menus', null)}
                        menuClickEvent={(selectedMenuName, selectedMenuPrice) => {

                          let findingIndex = -1;
                          for (let i = 0; i < this.state.Menu.length; i++){
                            if(selectedMenuName === this.state.Menu[i].Name){
                              findingIndex = i;
                              break;
                            }
                          }

                          this.state.Menu[findingIndex].MenuName = selectedMenuName;
                          this.state.Menu[findingIndex].Price = selectedMenuPrice;

                          this.forceUpdate();
                        }
                      }
          />
      </ScrollView>
    </>
  );

  calendarModalRender = () => (
    <>
      <View style={modalBoxStyles.selectedDateTiemContainer}>
        <Text style={modalBoxStyles.selectedDateTime}>예약 날짜 : {this.state.selectedDate}</Text>
        <Text style={modalBoxStyles.selectedDateTime}>예약 시간 : {this.state.selectedTime}</Text>
      </View>

      <Calendar current={`${new Date().getFullYear()}-${new Date().getMonth() + 1}`}
                minDate={`${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`}
                onDayPress={
                  (day) => {
                    this.setState({ selectedDate : day.dateString });
                    this.StartTimePicker.open();
                   }
                 }
                monthFormat={'yyyy MM'}
                hideExtraDays={true}
                disableMonthChange={false}
                firstDay={1}
                hideDayNames={true}
                showWeekNumbers={true}
                onPressArrowLeft={substractMonth => substractMonth()}
                onPressArrowRight={addMonth => addMonth()} />

      <TouchableOpacity onPress={() => this.setState({ dateTimeSelectorModal: undefined })}
                        style={modalBoxStyles.timePickerBtn}>
        <Text style={modalBoxStyles.timePickerBtn}>예약 시간 변경</Text>
      </TouchableOpacity>

      {/* Start TimePicker */}
      <TimePicker
        ref={ref => {
          this.StartTimePicker = ref;
        }}
        onCancel={() => this.StartTimePicker.close()}
        onConfirm={(hour, minute) => {
          this.setState({ selectedTime : `${hour}:${minute}:00` });
          this.EndTimePicker.open();
          this.StartTimePicker.close()
        }}
        hourInterval="1"
        minuteInterval="30"
      />

      {/* End TimePicker */}
      <TimePicker
        ref={ref => {
          this.EndTimePicker = ref;
        }}
        onCancel={() => this.EndTimePicker.close()}
        onConfirm={(hour, minute) => {
          this.setState({ selectedTime : `${this.state.selectedTime} ~ ${hour}:${minute}:00` });
          this.EndTimePicker.close();
        }}
        hourInterval="1"
        minuteInterval="30"
      />
    </>
  );

  toCategorySelector(){
    this.props.navigation.navigate(
      'CategorySelector',
      {
      }
    );
  }

  updatePersonCnt(childIndex, index, newCnt){

    this.state.Menu[childIndex].Personnel = newCnt;

    this.forceUpdate();

    console.log(this.state.Menu);
  }

  render() {

    if (this.state.isLoading) {
      return (
        <ActivityIndicator style={styles.ActivityIndicatorStyle} animating={true} color={Colors.blue200} />
      )
    }

    let reservationItems = [];

    let index = 0;

    this.state.Menu.forEach((item) => {
      reservationItems.push(
          <>
            <MenuRecord menuPressed={() => console.log()}
                        menuName={item.MenuName}
                        personCnt={item.Personnel}
                        price={item.Price}
                        index={index}
                        callback={(childIndex, updatedCnt) => this.updatePersonCnt(childIndex, index, updatedCnt)}
            />
          </>
      );
      index += 1;
    })


    const { navigation } = this.props;

    return (
      <>
        <FixedTopBar title={"예약 내역 확인 및 변경"} iconStr="" />
        <View style={styles.container}>
          <ScrollView>

            <DataTable>
              <DataTable.Header>
                <DataTable.Title>매장 주소</DataTable.Title>
              </DataTable.Header>

              <DataTable.Row>
                <DataTable.Cell>
                  {this.state.Address}
                </DataTable.Cell>
              </DataTable.Row>
            </DataTable>

            <DataTable>
              <DataTable.Header>
                <DataTable.Title>예약 시간</DataTable.Title>
              </DataTable.Header>
              <DataTable.Row>
                <TouchableOpacity onPress={() => this.setState({ dateTimeSelectorModal: 2 })}>
                  <DataTable.Cell>
                    {`${this.state.ReservedDateTime} ~ ${this.state.EndDateTime}`}
                  </DataTable.Cell>
                </TouchableOpacity>
              </DataTable.Row>
            </DataTable>

            <DataTable>
              <DataTable.Header>
                <DataTable.Title>예약 항목</DataTable.Title>
                <DataTable.Title>가격</DataTable.Title>
                <DataTable.Title numeric>예약 인원</DataTable.Title>
              </DataTable.Header>
              {reservationItems}
            </DataTable>

          </ScrollView>
        </View>

        <Appbar style={appBarStyles.bottomFixed}>
          <Appbar.Content titleStyle={styles.reserveBtn} title="예약 변경" onPress={() => this.reserveChange()}/>
          <Appbar.Content titleStyle={styles.reserveBtn} title="예약 취소" onPress={() => console.log("2")}/>
        </Appbar>

        <DialogComponent dialogTitle={<DialogTitle title="Dialog Title" />}
                         ref={(dialogComponent) => { this.dialogComponent = dialogComponent; }}
                         onDismissed={() => this.toCategorySelector()}>
          <DialogContent>
            <View>
              <Text>예약 변경을 완료했습니다. 초기화면으로 돌아갑니다.</Text>
            </View>
          </DialogContent>
        </DialogComponent>

        <DialogComponent dialogTitle={<DialogTitle title="Dialog Title" />}
                         ref={(dialogComponent) => { this.cancelDialogComponent = dialogComponent; }}
                         onDismissed={() => this.toCategorySelector()}>
          <DialogContent>
            <View>
              <Text>예약 취소를 완료했습니다. 초기화면으로 돌아갑니다.</Text>
            </View>
          </DialogContent>
        </DialogComponent>
      </>
    );
  }
}

// flex1이 아이콘들을 오른쪽에 붙게함
const styles = StyleSheet.create({

  textInput: {
    marginBottom: 30,
    backgroundColor: '#ffffff'
  },

  container: {
    marginTop: 55,
    flex: 1,
    backgroundColor: '#ffffff',
  },

  ActivityIndicatorStyle:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  reserveBtn: {
    fontSize: 18,
    textAlign: 'center',
    fontFamily: 'JejuGothic'
  },

});


const appBarStyles = StyleSheet.create({

  topFixed: {
    left: 0,
    right: 0,
    top: 0,
    backgroundColor: '#3cb371',
  },

  bottomFixed: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#3cb371',
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
  },

  iconsEndStyle: {
    alignSelf: 'flex-end',
  },

});
