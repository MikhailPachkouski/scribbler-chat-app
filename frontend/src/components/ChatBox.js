import { Box } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import SingleChat from './SingleChat';

const ChatBox = () => {

	const selectedChat = useSelector(state => state.scribbler.selectedChat);

	return (
		<Box
			d={{ base: selectedChat ? 'flex' : 'none', md: 'flex' }}
			alignItems='center'
			flexDir='column'
			p={3}
			bg='white'
			w={{ base: '100%', md: '68%' }}
			borderRadius='lg'
			borderWidth='1px'
		>
			<SingleChat/>
		</Box>
	);
};

export default ChatBox;
