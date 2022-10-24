import { Avatar, Tooltip } from '@chakra-ui/react';
import React from 'react';
import ScrollableFeed from 'react-scrollable-feed';
import { isSameSenderMargin, isSameUser } from '../../config/ChatLogics';
import ProfileModal from './ProfileModal';

const ScrollableChat = ({ messages, currentUser }) => {
  const array1 = messages.map((message) =>
    message.sender._id !== currentUser._id ? message : 'x',
  );
  const array2 = array1.map((val, idx) =>
    typeof val === 'object' &&
    (array1[idx + 1] === 'x' ||
      array1[idx + 1] === undefined ||
      val?.sender._id !== array1[idx + 1]?.sender._id)
      ? idx
      : undefined,
  );
  const array3 = messages.map((val, idx) =>
    array2[idx] !== undefined
      ? { ...val, photo: true }
      : { ...val, photo: false },
  );

  return (
    <>
      <ScrollableFeed>
        {array3 &&
          array3.map((message, index) => (
            <div key={index} style={{ display: 'flex' }}>
              {message.photo && (
                <ProfileModal currentUser={message?.sender}>
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
                </ProfileModal>
              )}
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
