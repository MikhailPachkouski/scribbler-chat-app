import { Box } from '@chakra-ui/layout';
import SideDrawer from '../components/miscellaneous/SideDrawer';
import MyChats from '../components/MyChats';
import ChatBox from '../components/ChatBox';
import { useSelector } from 'react-redux';

const ChatPage = () => {
	const user = useSelector(state => state.scribbler.user);

	return (
		<div style={{ width: '100%' }}>
			{user && <SideDrawer />}
			<Box
				d={'flex'}
				justifyContent={'space-between'}
				w={'100%'}
				h={'91.5vh'}
				p={'10px'}
			>
				{user && <MyChats />}
				{user && <ChatBox />}
			</Box>
		</div>
	);
};

export default ChatPage;
