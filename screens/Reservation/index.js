import React, { Component } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import { Avatar, Button, Card, Title, Paragraph, Divider, DataTable, TextInput, Appbar } from 'react-native-paper';
import Modal from 'react-native-modal';
import TimePicker from 'react-native-24h-timepicker';
import NumericInput from 'react-native-numeric-input'
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'react-native-axios'
import DialogManager, { ScaleAnimation, DialogContent, DialogComponent, DialogTitle } from 'react-native-dialog-component';

import FixedTopBar from '../../components/FixedTopBar';
import MenuSelector from '../../components/MenuSelector';
import MenuRecord from '../../components/MenuRecord';

const BACKEND_URL = 'http://bookingapp.ga:3000';

export default class Reservation extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      header: null,
      menus: navigation.getParam('menus', 'Unknown'),
      workPlaceID: navigation.getParam('workPlaceID', 'Unknown'),
    };
  };

  constructor(props) {
    super(props);

    this.state = {
      name : "",
      phoneNum: "",
      selectedTime: "",
      selectedDate: "",

      // Name, Price, PersonCnt, File
      menuRecordSet: [],

      // modal 창을 띄우기 위한 플래그 변수
      dateTimeSelectorModal: null,
      menuModal: null,

      reservationID: "",
    };
  }

  reserve(){

    let yymmdd = this.state.selectedDate.split("-");
    let yy = yymmdd[0];
    let mm = yymmdd[1] - 1;
    let dd = yymmdd[2];

    let bg_time = this.state.selectedTime.split(" ~ ")[0].split(":");
    let bg_hh = bg_time[0];
    let bg_mm = bg_time[1];
    let bg_ss = bg_time[2];
    let beginningSelectedTime = new Date(yy, mm, dd, bg_hh, bg_mm, bg_ss).toISOString();
    let endSelectedTime = "";

    if(this.state.selectedTime.split(" ~ ").length > 1) {
      let ed_time = this.state.selectedTime.split(" ~ ")[1].split(":");
      let ed_hh = ed_time[0];
      let ed_mm = ed_time[1];
      let ed_ss = ed_time[2];
      endSelectedTime = new Date(yy, mm, dd, ed_hh, ed_mm, ed_ss).toISOString();
    }

    axios({
      headers: {'Access-Control-Allow-Origin': '*'},
      method: 'post',
      // fill this url
      url: BACKEND_URL + '/reservation',
      data: {
        Detail: {
          UserName: this.state.name,
          PhoneNum: this.state.phoneNum,
        },

        WorkPlaceID: this.props.navigation.getParam('workPlaceID', null),

        ReservedDateTime: beginningSelectedTime,

        EndDateTime: endSelectedTime,

        Menus: this.state.menuRecordSet,
      }
    })
    .then(response => {
      console.log(response)
      console.log(response.data);
      this.setState({
        reservationID: response.data.ID
      });

    });

    this.dialogComponent.show();
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
                          let items = [...this.state.menuRecordSet];
                          let item = {...items[this.state.menuRecordSet.length]};

                          item = {
                            MenuName: selectedMenuName,
                            Price: selectedMenuPrice,
                            Personnel: 1
                          }

                          items[this.state.menuRecordSet.length] = item;

                          this.setState({
                             menuRecordSet : items,
                             menuModal: undefined
                          });
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
        <Text style={modalBoxStyles.timePickerBtn}>예약</Text>
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

    this.state.menuRecordSet[childIndex].Personnel = newCnt;

    this.forceUpdate();

  }

  render() {
    const { navigation } = this.props;

    let reservationItems = [];

    let index = 0;
    this.state.menuRecordSet.forEach((item) => {
      reservationItems.push(
          <MenuRecord menuPressed={() => console.log()}
                      menuName={item.MenuName}
                      personCnt={item.Personnel}
                      price={item.Price}
                      index={index}
                      callback={(childIndex, updatedCnt) => this.updatePersonCnt(childIndex, index, updatedCnt)}
          />
      );
      index += 1;
    })

    return (
      <>
        <Appbar style={appBarStyles.topFixed}>
          <Text style={appBarStyles.titleStyle}>{"예약"}</Text>
          <Appbar.Action icon="add" onPress={() =>{
            this.setState({ menuModal: 2 });
          }} />
        </Appbar>

        <View style={styles.container}>
          <ScrollView>
            <Modal isVisible={this.state.dateTimeSelectorModal === 2}
                   backdropColor={'white'}
                   backdropOpacity={1}
                   animationIn={'zoomInDown'}
                   animationOut={'zoomOutUp'}
                   animationInTiming={1000}
                   animationOutTiming={1000}
                   backdropTransitionInTiming={1000}
                   backdropTransitionOutTiming={1000}>
              {this.calendarModalRender()}
            </Modal>

            <Modal isVisible={this.state.menuModal === 2}
                   backdropColor={'white'}
                   backdropOpacity={1}
                   animationIn={'zoomInDown'}
                   animationOut={'zoomOutUp'}
                   animationInTiming={1000}
                   animationOutTiming={1000}
                   backdropTransitionInTiming={1000}
                   backdropTransitionOutTiming={1000}>
              {this.menuModalRender()}
            </Modal>

            <DataTable>
              <DataTable.Header>
                <DataTable.Title>예약 날짜 및 시간</DataTable.Title>
              </DataTable.Header>
              <DataTable.Row>
                <TouchableOpacity onPress={() => this.setState({ dateTimeSelectorModal: 2 })}>
                  <DataTable.Cell>
                    {this.state.selectedDate !== "" ?
                      `${this.state.selectedDate}, ${this.state.selectedTime}` : "터치하여 예약 시간을 선택하세요."}
                  </DataTable.Cell>
                </TouchableOpacity>
              </DataTable.Row>
            </DataTable>

            <DataTable>
              <DataTable.Header>
                <DataTable.Title>예약자 정보 입력</DataTable.Title>
              </DataTable.Header>

              <TextInput label='성함'
                         value={this.state.name}
                         onChangeText={name => this.setState({ name })}
                         style={styles.textInput}
                         placeholder='성함을 입력해주세요'
                         />

              <TextInput label='핸드폰 번호'
                         value={this.state.phoneNum}
                         onChangeText={phoneNum => this.setState({ phoneNum })}
                         style={styles.textInput}
                         placeholder='핸드폰 번호를 입력해주세요'
                         keyboardType={'numeric'}
                         />

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
        <Appbar.Content titleStyle={styles.reserveBtn} title="예약하기" onPress={() => this.reserve()}/>
        <Divider style={[{borderColor: 'black', borderWidth: 1, height: 25}]}></Divider>
        <Appbar.Content titleStyle={styles.reserveBtn} title="취소하기" onPress={() => this.props.navigation.goBack()}/>
      </Appbar>

      <DialogComponent dialogTitle={<DialogTitle title="Dialog Title" />}
                       ref={(dialogComponent) => { this.dialogComponent = dialogComponent; }}
                       onDismissed={() => this.toCategorySelector()}>
        <DialogContent>
          <View>
            <Text>예약을 완료했습니다. 예약 번호는 {this.state.reservationID} 입니다.</Text>
            <Text>초기화면으로 돌아갑니다.</Text>
          </View>
        </DialogContent>
      </DialogComponent>
      </>
    );
  }
}

// flex1이 아이콘들을 오른쪽에 붙게함
const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },

  text: {
    fontFamily: 'BMJUA_ttf',
    marginBottom: 10,
    fontSize: 16,
  },

  cardContainer: {
    backgroundColor: '#f5f5f5',
  },

  cityTitle: {
    fontSize: 35,
  },

  ActivityIndicatorStyle:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  reserveBtn: {
    fontSize: 20,
    textAlign: 'center',
    fontFamily: 'BMJUA_ttf',
  },

  textInput: {
    backgroundColor: '#ffffff'
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
    fontSize: 25,
    flex: 1,
  },

  iconsStartStyle: {
    alignSelf: 'flex-start',
  },

  iconsEndStyle: {
    alignSelf: 'flex-end',
  },

});

const modalBoxStyles = StyleSheet.create({

  timePickerBtn: {
    fontSize: 30,
    textAlign: 'center',
    fontFamily: 'JejuGothic',
    backgroundColor: "#c9c9c9",
    paddingVertical: 1,
    paddingHorizontal: 17,
    borderRadius: 3,
    marginVertical: 50
  },

  selectedDateTime: {
    fontSize: 15,
    fontFamily: 'JejuGothic',
    lineHeight: 30,
  },

  selectedDateTiemContainer: {
    backgroundColor: "#c9c9c9",
    paddingVertical: 1,
    paddingHorizontal: 17,
    borderRadius: 3,
    marginVertical: 50,
  },

});
