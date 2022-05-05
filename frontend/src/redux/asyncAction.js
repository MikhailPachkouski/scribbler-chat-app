import axios from 'axios';
import { changeChats } from './rootReducer';

export const fetchChatsAsync = user => {
	return async function (dispatch) {
		const config = {
			headers: {
				Authorization: `Bearer ${user.token}`,
			},
		};

		const { data } = await axios.get('/api/chat', config);
		dispatch(changeChats(data));
	};
};
