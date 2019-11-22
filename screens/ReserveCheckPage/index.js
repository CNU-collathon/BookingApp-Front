import React, { Component } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import { Avatar, Button, Card, Title, Paragraph, Divider, DataTable, Appbar, TextInput, ActivityIndicator, Colors } from 'react-native-paper';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'react-native-axios'
import TimePicker from 'react-native-24h-timepicker';
import NumericInput from 'react-native-numeric-input';

import FixedTopBar from '../../components/FixedTopBar';
import MenuRecord from '../../components/MenuRecord';
import MenuSelector from '../../components/MenuSelector';

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
      WorkPlaceID: '',
      dateTimeSelectorModal: null,
      menuModal: null,

      reservationDoNotExist: false,

      TimeToEdit: "",
      DateToEdit: "",

      workPlaceMenu: []
    };
  }

  async componentDidMount() {

    await fetch(BACKEND_URL + '/reservation/lookup/' + this.props.navigation.getParam('reservationID', null))
    .then(response => response.json())
    .then(reservation => {
      if(reservation.result === 0){
        this.setState({
          reservationDoNotExist: true,
          isLoading: false
        });
        this.doNotExistReservation.show();
      }
      else{
        this.setState({
          Address: reservation.Address,
          WorkPlaceInfo: reservation.WorkPlaceInfo,
          ReservedDateTime: reservation.ReservedDateTime,
          EndDateTime: reservation.EndDateTime,
          Menu: reservation.Menu,
          WorkPlaceID: reservation.WorkPlaceID
        });
      }
    })

    await fetch(BACKEND_URL + '/menu/' + this.state.WorkPlaceID)
    .then(response => response.json())
    .then(menu => {
      this.setState({
        workPlaceMenu: menu,
        isLoading: false
      });
    });
  }

  reserveChange() {

    let beginningSelectedTime = this.state.ReservedDateTime;
    let endSelectedTime = this.state.EndDateTime;

    if(this.state.DateToEdit !== ''){
      let yymmdd = this.state.DateToEdit.split("-");
      let yy = yymmdd[0];
      let mm = yymmdd[1] - 1;
      let dd = yymmdd[2];

      let bg_time = this.state.TimeToEdit.split(" ~ ")[0].split(":");
      let bg_hh = bg_time[0];
      let bg_mm = bg_time[1];
      let bg_ss = bg_time[2];
      beginningSelectedTime = new Date(yy, mm, dd, bg_hh, bg_mm, bg_ss).toISOString();
      endSelectedTime = "";

      if(this.state.TimeToEdit.split(" ~ ").length > 1) {
        let ed_time = this.state.TimeToEdit.split(" ~ ")[1].split(":");
        let ed_hh = ed_time[0];
        let ed_mm = ed_time[1];
        let ed_ss = ed_time[2];
        endSelectedTime = new Date(yy, mm, dd, ed_hh, ed_mm, ed_ss).toISOString();
      }
    }

    axios({
      headers: {'Access-Control-Allow-Origin': '*'},
      method: 'put',
      // fill this url
      url: BACKEND_URL + '/reservation/' + this.state.reservationID,
      data: {

        ReservedDateTime: beginningSelectedTime,

        EndDateTime: endSelectedTime,

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

          <MenuSelector menus={this.state.workPlaceMenu}
                        menuClickEvent={(selectedMenuName, selectedMenuPrice) => {
                          let items = [...this.state.Menu];
                          let item = {...items[this.state.Menu.length]};

                          item = {
                            MenuName: selectedMenuName,
                            Price: selectedMenuPrice,
                            Personnel: 1
                          }

                          items[this.state.Menu.length] = item;

                          this.setState({
                             Menu : items,
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
        <Text style={modalBoxStyles.selectedDateTime}>{`변경할 날짜: ${this.state.DateToEdit}`}</Text>
        <Text style={modalBoxStyles.selectedDateTime}>{`변경할 시간: ${this.state.TimeToEdit}`}</Text>
      </View>

      <Calendar current={`${new Date().getFullYear()}-${new Date().getMonth() + 1}`}
                minDate={`${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`}
                onDayPress={
                  (day) => {
                    this.setState({ DateToEdit : day.dateString });
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
          this.setState({ TimeToEdit : `${hour}:${minute}:00` });
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

          this.setState({ TimeToEdit : `${this.state.TimeToEdit} ~ ${hour}:${minute}:00` });

          let timeToEdit = `${this.state.TimeToEdit} ~ ${hour}:${minute}:00`;

          let yymmdd = this.state.DateToEdit.split("-");
          let yy = yymmdd[0];
          let mm = yymmdd[1] - 1;
          let dd = yymmdd[2];

          let bg_time = timeToEdit.split(" ~ ")[0].split(":");
          let bg_hh = bg_time[0];
          let bg_mm = bg_time[1];
          let bg_ss = bg_time[2];
          let beginningSelectedTime = new Date(yy, mm, dd, bg_hh, bg_mm, bg_ss).toISOString();
          let endSelectedTime = "";

          if(timeToEdit.split(" ~ ").length > 1) {
            let ed_time = timeToEdit.split(" ~ ")[1].split(":");
            let ed_hh = ed_time[0];
            let ed_mm = ed_time[1];
            let ed_ss = ed_time[2];
            endSelectedTime = new Date(yy, mm, dd, ed_hh, ed_mm, ed_ss).toISOString();
          }

          this.setState({
            ReservedDateTime: beginningSelectedTime,
            EndDateTime: endSelectedTime,
          });

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

  }

  render() {

    if (this.state.isLoading) {
      return (
        <ActivityIndicator style={styles.ActivityIndicatorStyle} animating={true} color={Colors.blue200} />
      )
    }

    else if(this.state.reservationDoNotExist){
      return(
        <DialogComponent dialogTitle={<DialogTitle title="Dialog Title" />}
                         ref={(dialogComponent) => { this.doNotExistReservation = dialogComponent; }}
                         onDismissed={() => this.toCategorySelector()}>
          <DialogContent>
            <View>
              <Text>존재하지 않는 예약입니다. 초기화면으로 돌아갑니다.</Text>
            </View>
          </DialogContent>
        </DialogComponent>
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
        <Appbar style={appBarStyles.topFixed}>
          <Text style={appBarStyles.titleStyle}>{"예약 내역 확인 및 변경"}</Text>
          <Appbar.Action icon="add" onPress={() =>{
            this.setState({ menuModal: 2 });
          }} />
        </Appbar>

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
          <Appbar.Content titleStyle={styles.reserveBtn} title="예약 취소" onPress={() => this.reserveCancel()}/>
        </Appbar>

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
    flex: 1,
    backgroundColor: '#ffffff',
  },

  ActivityIndicatorStyle:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  reserveBtn: {
    fontSize: 22,
    textAlign: 'center',
    fontFamily: 'BMJUA_ttf'
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
