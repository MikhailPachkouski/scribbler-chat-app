import { configureStore } from '@reduxjs/toolkit'

import scribblerReducer from './rootReducer'


export const store = configureStore({
	reducer: {
		scribbler: scribblerReducer
	}
})