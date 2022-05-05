import {
	Avatar,
	Box,
	Button,
	Drawer,
	DrawerBody,
	DrawerCloseButton,
	DrawerContent,
	DrawerHeader,
	DrawerOverlay,
	Input,
	Menu,
	MenuButton,
	MenuDivider,
	MenuItem,
	MenuList,
	Spinner,
	Text,
	Tooltip,
	useDisclosure,
	useToast,
} from '@chakra-ui/react';
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons';
import React, { useState } from 'react';
import ProfileModal from './ProfileModal';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import ChatLoading from '../ChatLoading';
import UserListItem from '../UserListItem';
import { getSender } from '../../config/ChatLogics';
import NotificationBadge from 'react-notification-badge';
import { Effect } from 'react-notification-badge';

import { useSelector, useDispatch } from 'react-redux';
import {
	changeChats,
	changeNotification,
	changeSelectedChat,
} from '../../redux/rootReducer';

const SideDrawer = () => {
	const [search, setSearch] = useState('');
	const [searchResult, setSearchResult] = useState([]);
	const [loading, setLoading] = useState(false);
	const [loadingChat, setLoadingChat] = useState();

	const { isOpen, onOpen, onClose } = useDisclosure();

	const dispatch = useDispatch();

	const user = useSelector(state => state.scribbler.user);
	const chats = useSelector(state => state.scribbler.chats);
	const notification = useSelector(state => state.scribbler.notification);

	const toast = useToast();
	const history = useHistory();

	const logoutHandler = () => {
		localStorage.removeItem('userInfo');
		dispatch(changeSelectedChat(null));
		history.push('/');
	};

	const handleSearch = async () => {
		if (!search) {
			toast({
				title: 'Please Enter something in search',
				status: 'warning',
				duration: 5000,
				isClosable: true,
				position: 'top-left',
			});
			return;
		}

		try {
			setLoading(true);

			const config = {
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
			};

			const { data } = await axios.get(`/api/user?search=${search}`, config);

			setLoading(false);
			setSearchResult(data);
		} catch (error) {
			toast({
				title: 'Error Occured!',
				description: 'Failed to Load the Search Results',
				status: 'error',
				duration: 5000,
				isClosable: true,
				position: 'bottom-left',
			});
		}
	};

	const accessChat = async userId => {
		try {
			setLoadingChat(true);

			const config = {
				headers: {
					'Content-type': 'application/json',
					Authorization: `Bearer ${user.token}`,
				},
			};

			const { data } = await axios.post('/api/chat', { userId }, config);

			if (!chats.find(ch => ch._id === data._id))
				dispatch(changeChats([data, ...chats]));
			dispatch(changeSelectedChat(data));

			setLoadingChat(false);
			onClose();
		} catch (error) {
			toast({
				title: 'Error fetching the chat',
				description: error.message,
				status: 'error',
				duration: 5000,
				isClosable: true,
				position: 'bottom-left',
			});
		}
	};

	return (
		<>
			<Box
				d={'flex'}
				justifyContent={'space-between'}
				alignItems={'center'}
				bg={'white'}
				w={'100%'}
				p={'5px 10px 5px 10px'}
				borderWidth={'5px'}
			>
				<Tooltip label='Search Users to chat' hasArrow placement='bottom-end'>
					<Button variant={'ghost'} onClick={onOpen}>
						<i className='fa-brands fa-searchengin'></i>
						<Text d={{ base: 'none', md: 'flex' }} px={'3'}>
							Search User
						</Text>
					</Button>
				</Tooltip>

				<Text
					fontSize={{ base: '2xl', md: '3xl' }}
					fontFamily={'Work sans'}
					fontWeight={'bold'}
				>
					Scribbler
				</Text>

				<div>
					<Menu>
						<MenuButton p={'1'}>
							<NotificationBadge
								count={notification.length}
								effect={Effect.SCALE}
							/>
							<BellIcon fontSize={'2xl'} m={'1'}></BellIcon>
						</MenuButton>
						<MenuList pl={3}>
							{!notification.length && 'No New Messages'}
							{notification.map(notif => (
								<MenuItem
									key={notif._id}
									onClick={() => {
										dispatch(changeSelectedChat(notif.chat));
										dispatch(
											changeNotification(notification.filter(n => n !== notif))
										);
									}}
								>
									{notif.chat.isGroupChat
										? `New Message in ${notif.chat.chatName}`
										: `New Message from ${getSender(user, notif.chat.users)}`}
								</MenuItem>
							))}
						</MenuList>
					</Menu>

					<Menu>
						<MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
							<Avatar
								size={'sm'}
								cursor={'pointer'}
								name={user.name}
								src={user.pic}
							></Avatar>
						</MenuButton>
						<MenuList>
							<ProfileModal user={user}>
								<MenuItem>My Profile</MenuItem>
							</ProfileModal>
							<MenuDivider />
							<MenuItem onClick={logoutHandler}>Logout</MenuItem>
						</MenuList>
					</Menu>
				</div>
			</Box>

			<Drawer placement='left' isOpen={isOpen} onClose={onClose}>
				<DrawerOverlay />
				<DrawerContent>
					<DrawerCloseButton />
					<DrawerHeader borderBottomWidth={'1px'}>Search Users</DrawerHeader>

					<DrawerBody>
						<Box d={'flex'} pb={'2'}>
							<Input
								placeholder='Type here...'
								mr={'2'}
								value={search}
								onChange={e => setSearch(e.target.value)}
							/>
							<Button onClick={handleSearch}>Go</Button>
						</Box>

						{loading ? (
							<ChatLoading />
						) : (
							searchResult.map(user => (
								<UserListItem
									user={user}
									key={user._id}
									handleClickUser={() => accessChat(user._id)}
								/>
							))
						)}
						{loadingChat && <Spinner ml='auto' d='flex' />}
					</DrawerBody>
				</DrawerContent>
			</Drawer>
		</>
	);
};

export default SideDrawer;
