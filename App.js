import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import CategorySelector from './screens/CategorySelector';
import StoreSelector from './screens/StoreSelector'
import StorePage from './screens/StorePage'
import Reservation from './screens/Reservation'
import ReserveQueryPage from './screens/ReserveQueryPage'
import ReserveCheckPage from './screens/ReserveCheckPage'

const RootStack = createStackNavigator({
  CategorySelector: CategorySelector,
  StoreSelector: StoreSelector,
  StorePage: StorePage,
  Reservation: Reservation,
  ReserveQueryPage: ReserveQueryPage,
  ReserveCheckPage: ReserveCheckPage
}, {
  initialRouteName: 'CategorySelector',
});

console.disableYellowBox = true;

const AppContainer = createAppContainer(RootStack);

export default AppContainer;
