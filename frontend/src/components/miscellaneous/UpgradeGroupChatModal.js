import { ViewIcon } from '@chakra-ui/icons';
import {
	Box,
	Button,
	FormControl,
	IconButton,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Spinner,
	useDisclosure,
	useToast,
} from '@chakra-ui/react';
import axios from 'axios';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changeSelectedChat, toggleFetchAgain } from '../../redux/rootReducer';
import UserBadgeItem from '../UserBadgeItem';
import UserListItem from '../UserListItem';

const UpgradeGroupChatModal = ({ fetchMessages }) => {
	const dispatch = useDispatch();

	const user = useSelector(state => state.scribbler.user);
	const selectedChat = useSelector(state => state.scribbler.selectedChat);

	const { isOpen, onOpen, onClose } = useDisclosure();

	const [groupChatName, setGroupChatName] = useState('');
	const [search, setSearch] = useState('');
	const [searchResult, setSearchResult] = useState([]);
	const [loading, setLoading] = useState(false);
	const [renameLoading, setRenameLoading] = useState(false);

	const toast = useToast();

	const handleDelete = async userItem => {
		if (selectedChat.groupAdmin._id !== user._id && userItem._id !== user._id) {
			toast({
				title: 'Only admins can remove someone!',
				status: 'error',
				duration: 5000,
				isClosable: true,
				position: 'bottom',
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
			const { data } = await axios.put(
				`/api/chat/groupremove`,
				{
					chatId: selectedChat._id,
					userId: userItem._id,
				},
				config
			);

			userItem._id === user._id
				? dispatch(changeSelectedChat())
				: dispatch(changeSelectedChat(data));
			dispatch(toggleFetchAgain());

			fetchMessages();
			setLoading(false);
		} catch (error) {
			toast({
				title: 'Error Occured!',
				description: error.response.data.message,
				status: 'error',
				duration: 5000,
				isClosable: true,
				position: 'bottom',
			});
			setLoading(false);
		}
		// setGroupChatName("");
	};

	const handleAddUser = async userItem => {
		if (selectedChat.users.find(u => u._id === userItem._id)) {
			toast({
				title: 'User Already in group!',
				status: 'error',
				duration: 5000,
				isClosable: true,
				position: 'bottom',
			});
			return;
		}

		if (selectedChat.groupAdmin._id !== user._id) {
			toast({
				title: 'Only admins can add someone!',
				status: 'error',
				duration: 5000,
				isClosable: true,
				position: 'bottom',
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
			const { data } = await axios.put(
				`/api/chat/groupadd`,
				{
					chatId: selectedChat._id,
					userId: userItem._id,
				},
				config
			);

			dispatch(changeSelectedChat(data));
			dispatch(toggleFetchAgain());

			setLoading(false);
		} catch (error) {
			toast({
				title: 'Error Occured!',
				description: error.message,
				status: 'error',
				duration: 5000,
				isClosable: true,
				position: 'bottom',
			});
			setLoading(false);
		}
		// setGroupChatName("");
	};

	const handleRename = async () => {
		if (!groupChatName) {
			return;
		}

		try {
			setRenameLoading(true);
			const config = {
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
			};

			const { data } = await axios.put(
				`/api/chat/rename`,
				{
					chatId: selectedChat._id,
					chatName: groupChatName,
				},
				config
			);

			dispatch(changeSelectedChat(data));
			dispatch(toggleFetchAgain());

			setRenameLoading(false);
		} catch (error) {
			toast({
				title: 'Error Occured!',
				description: error.message,
				status: 'error',
				duration: 5000,
				isClosable: true,
				position: 'bottom',
			});
			setRenameLoading(false);
		}
		setGroupChatName('');
	};

	const handleSearch = async query => {
		setSearch(query);
		if (!query) {
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
			console.log(data);
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
			setLoading(false);
		}
	};

	return (
		<>
			<IconButton icon={<ViewIcon />} onClick={onOpen} />

			<Modal isOpen={isOpen} onClose={onClose} isCentered>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader
						fontSize='35px'
						fontFamily='Work sans'
						d='flex'
						justifyContent='center'
					>
						{selectedChat.chatName}
					</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Box d={'flex'} flexWrap={'wrap'} w={'100%'} pb={3}>
							{selectedChat.users.map(user => (
								<UserBadgeItem
									key={user._id}
									user={user}
									handleClick={() => handleDelete(user)}
								/>
							))}
						</Box>
						<FormControl d='flex'>
							<Input
								placeholder='Chat Name'
								mb={3}
								value={groupChatName}
								onChange={e => setGroupChatName(e.target.value)}
							/>
							<Button
								variant='solid'
								colorScheme='teal'
								ml={1}
								isLoading={renameLoading}
								onClick={handleRename}
							>
								Update
							</Button>
						</FormControl>
						<FormControl>
							<Input
								placeholder='Add users'
								mb={'1'}
								onChange={e => handleSearch(e.target.value)}
							/>
						</FormControl>
						{loading ? (
							<Spinner size='lg' />
						) : (
							searchResult?.map(user => (
								<UserListItem
									key={user._id}
									user={user}
									handleClickUser={() => handleAddUser(user)}
								/>
							))
						)}
					</ModalBody>

					<ModalFooter>
						<Button colorScheme='red' mr={3} onClick={() => handleDelete(user)}>
							Leave Group
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default UpgradeGroupChatModal;
