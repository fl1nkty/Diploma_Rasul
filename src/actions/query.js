// src/actions/query.js

// Action-creator для установки SQL-запроса в Redux
export const setQuery = (queryText) => {
  return {
    type: 'SET_QUERY',
    payload: queryText
  };
};
