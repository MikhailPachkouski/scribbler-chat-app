import {
	Button,
	IconButton,
	Image,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Text,
	useDisclosure,
} from '@chakra-ui/react';
import { ViewIcon } from '@chakra-ui/icons';
import React from 'react';

const ProfileModal = ({ user, children }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();

	return (
		<>
			{children ? (
				<div onClick={onOpen}>{children}</div>
			) : (
				<IconButton
					// d={{ base: 'flex' }}
					icon={<ViewIcon />}
					onClick={onOpen}
				/>
			)}

			<Modal size={'lg'} isOpen={isOpen} onClose={onClose} isCentered>
				<ModalOverlay />
				<ModalContent h={'400px'}>
					<ModalHeader
						d={'flex'}
						justifyContent={'center'}
						fontSize={'30px'}
						fontFamily={'Work sans'}
					>
						{user.name}
					</ModalHeader>
					<ModalCloseButton />
					<ModalBody
						d={'flex'}
						flexDirection={'column'}
						justifyContent={'space-between'}
						alignItems={'center'}
					>
						<Image
							borderRadius={'full'}
							boxSize={'150px'}
							src={user.pic}
							name={user.name}
						/>
						<Text
							fontSize={{ base: '28px', md: '30px' }}
							fontFamily={'Work sans'}
						>
							Email: {user.email}
						</Text>
					</ModalBody>

					<ModalFooter>
						<Button colorScheme='blue' mr={3} onClick={onClose}>
							Close
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default ProfileModal;
