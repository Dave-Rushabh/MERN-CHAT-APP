import { Avatar, Tooltip } from '@chakra-ui/react';
import React from 'react';
import ScrollableFeed from 'react-scrollable-feed';
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from '../../config/ChatLogics';

const ScrollableChat = ({ messages, currentUser }) => {
  /**
   * TODO : to fix the user profile picture not placed properly..
   */
  return (
    <>
      <ScrollableFeed>
        {messages &&
          messages.map((message, index) => (
            <div key={index} style={{ display: 'flex' }}>
              {isSameSender(messages, message, index, currentUser._id) ||
                (isLastMessage(messages, index, currentUser._id) && (
                  <Tooltip
                    label={message?.sender?.name}
                    placement="bottom-start"
                    hasArrow
                  >
                    <Avatar
                      mt="7px"
                      mr={1}
                      size="sm"
                      cursor="pointer"
                      name={message?.sender?.name}
                      src={message?.sender?.pic}
                    />
                  </Tooltip>
                ))}
              <span
                style={{
                  backgroundColor: `${
                    message?.sender._id === currentUser._id
                      ? '#a2d2ff'
                      : '#023047'
                  }`,
                  color: `${
                    message?.sender._id === currentUser._id ? 'black' : 'white'
                  }`,
                  borderRadius: '20px',
                  padding: '5px 15px',
                  maxWidth: '75%',
                  fontSize: '14px',
                  marginLeft: isSameSenderMargin(
                    messages,
                    message,
                    index,
                    currentUser._id,
                  ),
                  marginTop: isSameUser(messages, message, index) ? 3 : 10,
                }}
              >
                {message?.content}
              </span>
            </div>
          ))}
      </ScrollableFeed>
    </>
  );
};

export default ScrollableChat;
