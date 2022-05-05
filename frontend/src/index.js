import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';
import { store } from '../src/redux/store';
import { Provider } from 'react-redux';

ReactDOM.render(
	<BrowserRouter>
		<Provider store={store}>
			<ChakraProvider>
				<App />
			</ChakraProvider>
		</Provider>
	</BrowserRouter>,
	document.getElementById('root')
);
