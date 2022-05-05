import {
	Box,
	Button,
	FormControl,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	useDisclosure,
	useToast,
} from '@chakra-ui/react';
import axios from 'axios';
import React, { useState } from 'react';
import UserBadgeItem from '../UserBadgeItem';
import UserListItem from '../UserListItem';

import { useSelector, useDispatch } from 'react-redux';
import { changeChats } from '../../redux/rootReducer';

const GroupChatModal = ({ children }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [groupChatName, setGroupChatName] = useState();
	const [selectedUsers, setSelectedUsers] = useState([]);
	const [search, setSearch] = useState('');
	const [searchResult, setSearchResult] = useState([]);
	const [loading, setLoading] = useState(false);

	const dispatch = useDispatch();

	const user = useSelector(state => state.scribbler.user);

	const toast = useToast();

	const handleSearch = async text => {
		setSearch(text);

		if (!text) {
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

	const handleSubmit = async () => {
		if (!groupChatName || !selectedUsers) {
			toast({
				title: 'Please fill all the feilds',
				status: 'warning',
				duration: 5000,
				isClosable: true,
				position: 'top',
			});
			return;
		}

		try {
			const config = {
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
			};

			const { data } = await axios.post(
				'/api/chat/group',
				{
					name: groupChatName,
					users: JSON.stringify(selectedUsers.map(u => u._id)),
				},
				config
			);

			dispatch(changeChats(data));
			onClose();
			toast({
				title: 'New Group Chat Created!',
				status: 'success',
				duration: 5000,
				isClosable: true,
				position: 'bottom',
			});
		} catch (error) {
			toast({
				title: 'Failed to Create the Chat!',
				description: error.response.data,
				status: 'error',
				duration: 5000,
				isClosable: true,
				position: 'bottom',
			});
		}
	};

	const handleGroup = user => {
		if (selectedUsers.includes(user)) {
			toast({
				title: 'User already added',
				status: 'warning',
				duration: 5000,
				isClosable: true,
				position: 'top',
			});
			return;
		}
		setSelectedUsers([...selectedUsers, user]);
	};

	const handleDelete = user => {
		setSelectedUsers(selectedUsers.filter(u => u._id !== user._id));
	};

	return (
		<>
			<span onClick={onOpen}>{children}</span>

			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader
						fontSize={'25px'}
						fontFamily={'Work sans'}
						d={'flex'}
						justifyContent={'center'}
					>
						Create Group Chat
					</ModalHeader>
					<ModalCloseButton />
					<ModalBody d={'flex'} flexDir={'column'} alignItems={'center'}>
						<FormControl>
							<Input
								placeholder='Chat Name'
								mb={'3'}
								onChange={e => setGroupChatName(e.target.value)}
							/>
							<Input
								placeholder='Add users'
								mb={'1'}
								onChange={e => handleSearch(e.target.value)}
							/>
						</FormControl>
						<Box d={'flex'} flexWrap={'wrap'} w={'100%'}>
							{selectedUsers.map(user => (
								<UserBadgeItem
									key={user._id}
									user={user}
									handleClick={() => handleDelete(user)}
								/>
							))}
						</Box>
						{loading ? (
							<div>loading</div>
						) : (
							searchResult
								?.slice(0, 3)
								.map(user => (
									<UserListItem
										key={user._id}
										user={user}
										handleClickUser={() => handleGroup(user)}
									/>
								))
						)}
					</ModalBody>

					<ModalFooter>
						<Button colorScheme='blue' mr={3} onClick={handleSubmit}>
							Create Group
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default GroupChatModal;
