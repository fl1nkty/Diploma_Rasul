// src/reducers/index.js

import { combineReducers } from 'redux';
import tabledata from './tabledata'; // ваш существующий редюсер, загружающий JSON (users) или initialState
import query from './query';        // только что созданный редюсер для SQL

export const reducers = combineReducers({
  tabledata,
  query
});
