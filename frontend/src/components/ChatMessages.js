import { Avatar, Tooltip } from '@chakra-ui/react';
import React from 'react';
import { useSelector } from 'react-redux';
import ScrollableFeed from 'react-scrollable-feed';
import {
	isLastMessage,
	isSameSender,
	isSameSenderMargin,
	isSameUser,
} from '../config/ChatLogics';

const ChatMessages = ({ messages }) => {
	const user = useSelector(state => state.scribbler.user);

	return (
		<ScrollableFeed>
			{messages &&
				messages.map((mes, index) => (
					<div style={{ display: 'flex' }} key={mes._id}>
						{(isSameSender(messages, mes, index, user._id) ||
							isLastMessage(messages, index, user._id)) && (
							<Tooltip
								label={mes.sender.name}
								placement={'bottom-start'}
								hasArrow
							>
								<Avatar
									size={'sm'}
									cursor={'pointer'}
									name={mes.sender.name}
									src={mes.sender.pic}
									mt={'7px'}
									mr={1}
								/>
							</Tooltip>
						)}

						<span
							style={{
								backgroundColor: `${
									mes.sender._id === user._id ? '#4285B4' : '#44944A'
								}`,
								borderRadius: '20px',
								padding: '5px 15px',
								maxWidth: '75%',
								marginLeft: isSameSenderMargin(messages, mes, index, user._id),
								marginTop: isSameUser(messages, mes, index, user._id) ? 3 : 10,
							}}
						>
							{mes.content}
						</span>
					</div>
				))}
		</ScrollableFeed>
	);
};

export default ChatMessages;
