import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	user: JSON.parse(localStorage.getItem('userInfo')) || {},
	selectedChat: null,
	notification: [],
	chats: null,
	fetchAgain: false,
};

export const scribblerSlice = createSlice({
	name: 'scribbler',
	initialState,
	reducers: {
		changeUser: (state, action) => {
			state.user = action.payload;
		},
		changeSelectedChat: (state, action) => {
			state.selectedChat = action.payload;
		},
		changeNotification: (state, action) => {
			state.notification = [...action.payload];
		},
		changeChats: (state, action) => {
			state.chats = [...action.payload];
		},
		toggleFetchAgain: state => {
			state.fetchAgain = !state.fetchAgain;
		},
	},
});

export const {
	changeUser,
	changeSelectedChat,
	changeNotification,
	changeChats,
	toggleFetchAgain,
} = scribblerSlice.actions;

export default scribblerSlice.reducer;
