import { createStore } from 'redux';


const staticUsername = 'admin';
const staticPassword = 'password123';


const initialState = {
  username: staticUsername,
  password: staticPassword,
};


const SET_USERNAME = 'SET_USERNAME';
const SET_PASSWORD = 'SET_PASSWORD';


export const setUsername = (username) => ({
  type: SET_USERNAME,
  payload: username,
});

export const setPassword = (password) => ({
  type: SET_PASSWORD,
  payload: password,
});


const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USERNAME:
      return { ...state, username: action.payload };
    case SET_PASSWORD:
      return { ...state, password: action.payload };
    default:
      return state;
  }
};


const store = createStore(reducer);

export default store;
