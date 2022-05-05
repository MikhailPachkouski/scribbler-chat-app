import { Box, Button, Stack, Text, useToast } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { AddIcon } from '@chakra-ui/icons';
import ChatLoading from './ChatLoading';
import { getSender } from '../config/ChatLogics';
import GroupChatModal from './miscellaneous/GroupChatModal';
import { useDispatch, useSelector } from 'react-redux';
import { changeSelectedChat } from '../redux/rootReducer';
import { fetchChatsAsync } from '../redux/asyncAction';

const MyChats = () => {
	const [loggedUser, setLoggedUser] = useState(
		JSON.parse(localStorage.getItem('userInfo'))
	);

	const dispatch = useDispatch();

	const user = useSelector(state => state.scribbler.user);
	const chats = useSelector(state => state.scribbler.chats);
	const selectedChat = useSelector(state => state.scribbler.selectedChat);
	const fetchAgain = useSelector(state => state.scribbler.fetchAgain);

	const toast = useToast();

	useEffect(() => {
		try {
			dispatch(fetchChatsAsync(user));
		} catch (error) {
			toast({
				title: 'Error Occured!',
				description: 'Failed to Load the chats',
				status: 'error',
				duration: 5000,
				isClosable: true,
				position: 'bottom-left',
			});
		}

		setLoggedUser(JSON.parse(localStorage.getItem('userInfo')));
		// eslint-disable-next-line
	}, [fetchAgain]);

	return (
		<Box
			d={{ base: selectedChat ? 'none' : 'flex', md: 'flex' }}
			flexDir={'column'}
			alignItems={'center'}
			p={3}
			bg={'white'}
			w={{ base: '100%', md: '31%' }}
			borderRadius={'lg'}
			borderWidth={'1px'}
		>
			<Box
				pb={3}
				px={3}
				fontSize={{ base: '25px', md: '28px' }}
				fontFamily={'Work sans'}
				d={'flex'}
				w={'100%'}
				justifyContent={'space-between'}
				alignItems={'center'}
				flexDirection={'column'}
			>
				My Chats
				<GroupChatModal>
					<Button
						d={'flex'}
						fontSize={{ base: '17px', md: '10px', lg: '17px' }}
						rightIcon={<AddIcon />}
					>
						New Group Chat
					</Button>
				</GroupChatModal>
			</Box>

			<Box
				d={'flex'}
				flexDir={'column'}
				p={3}
				bg={'#F8F8F8'}
				w={'100%'}
				h={'100%'}
				borderRadius={'lg'}
				overflowY={'hidden'}
			>
				{chats ? (
					<Stack overflowY={'scroll'}>
						{chats.map(chat => (
							<Box
								onClick={() => dispatch(changeSelectedChat(chat))}
								cursor='pointer'
								bg={selectedChat === chat ? '#38B2AC' : '#E8E8E8'}
								color={selectedChat === chat ? 'white' : 'black'}
								px={3}
								py={2}
								minH={'55px'}
								borderRadius='lg'
								key={chat._id}
							>
								<Text>
									{!chat.isGroupChat
										? getSender(loggedUser, chat.users)
										: chat.chatName}
								</Text>
								{chat.latestMessage && (
									<Text fontSize='xs'>
										<b>{chat.latestMessage.sender.name} : </b>
										{chat.latestMessage.content.length > 50
											? chat.latestMessage.content.substring(0, 51) + '...'
											: chat.latestMessage.content}
									</Text>
								)}
							</Box>
						))}
					</Stack>
				) : (
					<ChatLoading />
				)}
			</Box>
		</Box>
	);
};

export default MyChats;
