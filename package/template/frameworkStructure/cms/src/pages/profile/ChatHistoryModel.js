import React, { useEffect, useState } from 'react';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import Response from '../../lib/Response';
import Avatar from '../../components/Avatar';
import apiClient from '../../lib/apiClient';

export default function ChatHistoryModel(props) {

  let [conversations, setConversations] = useState([]);
  let [currentConversation, setCurrentConversation] = useState();
  let [chatType, setChatType] = useState(undefined);
  let [aboutChat, setAboutChat] = useState({});
  let [loading, setLoading] = useState(true);
  let [messages, setMessages] = useState([]);
  let [lastMessageId, setLastMessageId] = useState(undefined);
  let [lastMessageTime, setLastMessageTime] = useState(undefined);
  const chatTypes = {
    'Private chat': 1,
    'Service': 2,
    'Group': 3,
    'Request': 4,
    'Items': 5,
  };

  const dealTypes = {
    'Give': 1,
    'Receive': 2,
  };

  const getChatConversations = async (reset) => {
    try {
      let conversationRequest = await apiClient(
        '/chat',
        'GET',
        null,
        { chat_type: 0, other_user_id: props.userId, last_message_time: lastMessageTime },
        props.accessToken,
      );

      if (conversationRequest.responseCode === Response.STATUS_OK) {
        setConversations([...conversations, ...conversationRequest.responseData.chat_conversations]);
        if (!(conversationRequest.responseData.chat_conversations.length < 10)) {
          let lastConversation = conversationRequest.responseData.chat_conversations[0];
          setLastMessageTime(lastConversation.last_message_time);
        } else {
          setLastMessageTime(undefined);
        }
        if (reset) {
          if (conversationRequest.responseData.chat_conversations.length) {
            let chatId = conversationRequest.responseData.chat_conversations[0].chat_id;
            let UserId = conversationRequest.responseData.chat_conversations[0].user_id;
            setCurrentConversation(chatId);
            await getChatDetails(chatId, conversationRequest.responseData.chat_conversations[0].chat_type, UserId);
          } else {
            setCurrentConversation(undefined);
            setChatType(undefined);
          }

        }
      }

    } catch (e) {
      console.log(e);
    }
  };

  const getChatMessages = async (reset) => {
    if (reset) {
      setLoading(true);
    }
    try {
      let messagesRequest = await apiClient(
        '/chat/messages',
        'GET',
        null,
        { chat_id: currentConversation, other_user_id: props.userId, last_message_id: lastMessageId },
        props.accessToken,
      );

      if (messagesRequest.responseCode === Response.STATUS_OK) {
        reset ? setMessages(messagesRequest.responseData.messages) : setMessages([...messages, ...messagesRequest.responseData.messages]);
        setLoading(false);
        if (!(messagesRequest.responseData.messages.length < 10)) {
          let lastMessage = messagesRequest.responseData.messages[messagesRequest.responseData.messages.length - 1];
          setLastMessageId(lastMessage.message_id);
        } else {
          setLastMessageId(undefined);
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getChatDetails = async (chatId, chatType, userId) => {
    try {
      let chatDetailsRequest = await apiClient(
        '/chat/details',
        'GET',
        null,
        { chat_id: chatId, other_user_id: props.userId, chat_type: chatType, user_id: userId },
        props.accessToken,
      );

      if (chatDetailsRequest.responseCode === Response.STATUS_OK) {
        if (chatDetailsRequest.responseData.chat_conversations) {
          setAboutChat(chatDetailsRequest.responseData.chat_conversations[0]);
        } else {
          setAboutChat({});
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  const canShowAboutSection = (chatType) => {
    return chatType === chatTypes['Service'] || chatType === chatTypes['Items'];

  };

  const formatAMPM = (date) => {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    return hours + ':' + minutes + ' ' + ampm;
  };

  const getChatType = (type) => {
    return Object.keys(chatTypes).filter(key => chatTypes[key] === type);
  };

  const getDealType = (type) => {
    return Object.keys(dealTypes).filter(key => dealTypes[key] === type);
  };

  const memberScrollCheck = event => {
    if (!event.target.scrollTop) return;
    const bottom = event.target.scrollHeight - event.target.scrollTop === event.target.clientHeight;
    if (bottom && lastMessageTime) {
      getChatConversations(false).catch(console.log);
    }
  };
  const messagesScrollCheck = event => {
    if (!event.target.scrollTop) return;
    const bottom = event.target.scrollHeight - event.target.scrollTop === event.target.clientHeight;
    if (bottom && lastMessageId) {
      getChatMessages(false).catch(console.log);
    }
  };

  useEffect(() => {
    getChatConversations(true).catch(console.log);
  }, []);

  useEffect(() => {
    if (currentConversation) {
      getChatMessages(true).catch(console.log);
    }
  }, [currentConversation]);


  return (
    <Modal
      isOpen={props.isOpen}
      toggle={props.toggle}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <ModalHeader toggle={props.toggle}>
        <span id="contained-modal-title-vcenter" className="text-center">
          Chart History
        </span>
      </ModalHeader>
      <ModalBody className={'chat-room rare-wind-gradient'}>
        {
          conversations.length === 0 && (
            <p className={'text-center'}>No chat history</p>
          )
        }
        {
          conversations.length !== 0 && (
            <div className="row px-lg-2 px-2">
              <div className="col-md-6 col-xl-4 px-0">
                <h6 className="font-weight-bold mb-3 text-center text-lg-left">Members</h6>
                <div className="white z-depth-1 px-2 pt-3 pb-0 members-panel-1 scrollbar-light-blue"
                     onScroll={memberScrollCheck}>
                  <ul className="list-unstyled friend-list">
                    {conversations.map((conversation, index) => {
                      return (
                        <li className="p-2" key={index}>
                          <div className="d-flex" onClick={() => {
                            setLastMessageId(undefined);
                            setCurrentConversation(conversation.chat_id);
                            getChatDetails(conversation.chat_id, conversation.chat_type, conversation.user_id);
                          }}>
                            <Avatar src={conversation.image_url ? conversation.image_url : '/default-profile-pic.png'}
                                    style={{ width: 50, height: 50 }}
                                    alt={conversation.user_name}
                                    className="avatar d-flex align-self-center mr-2 z-depth-1"
                            />
                            <div className="text-small text-truncate">
                              <div className="d-flex  justify-content-between">
                                <strong>{conversation.user_name}</strong>
                                <small
                                  className="text-smaller text-muted mb-0"><small
                                  className="mx-1 badge badge-service">{getChatType(conversation.chat_type)}</small> {formatAMPM(new Date(conversation.last_message_time))}
                                </small>
                              </div>

                              <div className="d-flex  justify-content-between">
                                <p className="last-message text-muted d-inline-block mb-0 text-truncate"
                                   style={{ 'width': '240px' }}>{conversation.last_message}</p>
                                <small className="mx-1 badge badge-gary">{conversation.unread_count}</small>
                              </div>
                            </div>
                          </div>
                        </li>
                      );
                    })
                    }
                  </ul>
                </div>

              </div>
              <div className="col-md-6 col-xl-8 pl-md-3 px-lg-auto px-0">
                <h6 className="font-weight-bold mb-3 text-center text-lg-left">Messages</h6>
                <div className="chat-message" onScroll={messagesScrollCheck}>

                  {loading && (<p className={'text-center'}>Loading ...</p>)}
                  {!loading && !messages.length && (<p className={'text-center'}>No messages...</p>)}
                  {!loading && messages.length ?
                    <>
                      {canShowAboutSection(aboutChat.chat_type) &&
                      <div className="d-flex justify-content-between mb-4 bg-white">
                        <div className="chat-body white p-3 ml-2 z-depth-1">
                          <div className="header">
                            <small className="pull-right text-muted">
                              <i
                                className="far fa-clock" /> Now chatting about <small
                              className="mx-1 badge badge-service">{getDealType(aboutChat.dealing_type)}</small>
                            </small>
                          </div>
                          <p className="mb-0">
                            "{aboutChat.post_title}"
                          </p>
                        </div>
                        <img
                          src={aboutChat.image_url ? aboutChat.image_url : '/default-profile-pic.png'}
                          style={{ width: '100px', height: '100px' }}
                          alt='us'
                        />
                      </div>
                      }
                      <ul className="list-unstyled chat-1 scrollbar-light-blue"
                          style={{ height: canShowAboutSection(aboutChat.chat_type) ? '426Px' : '550px' }}>
                        {messages.map((message, index) => {
                          let date = new Date(message.message_sent_time);
                          if (message.sender_id === props.userId) {
                            return (
                              <li className="d-flex justify-content-between mb-4" key={index}>
                                <Avatar
                                  src={props.user.profile_picture_url ? props.user.profile_picture_url : '/default-profile-pic.png'}
                                  style={{ width: 50, height: 50 }}
                                  alt={props.user.user_name}
                                />
                              <div className="chat-body white p-3 ml-2 z-depth-1">
                                <div className="header">
                                  <strong className="primary-font">{props.user.user_name}</strong>
                                  <small className="pull-right text-muted">
                                    <i
                                      className="far fa-clock" /> {date.toLocaleTimeString()} | {date.toLocaleDateString()}
                                  </small>
                                </div>
                                <hr className="w-100" />
                                <p className="mb-0">
                                  {message.message}
                                </p>
                              </div>
                            </li>
                          );
                        } else {
                          return (
                            <li className="d-flex justify-content-between mb-4" key={index}>
                              <div className="chat-body white p-3 z-depth-1 w-100">
                                <div className="header d-flex justify-content-between">
                                  <strong className="primary-font">{message.sender_name}</strong>
                                  <small
                                    className="pull-right text-muted"> {date.toLocaleTimeString()} | {date.toLocaleDateString()}</small>
                                </div>
                                <hr className="w-100" />
                                <p className="mb-0">
                                  {message.message}
                                </p>
                              </div>
                              <Avatar src={message.sender_image ? message.sender_image : '/default-profile-pic.png'}
                                      style={{ width: 50, height: 50 }}
                                      alt={message.sender_name}
                                      className={'mx-1'}
                              />
                            </li>
                          );
                        }
                      })
                      }
                    </ul>
                    </>
                    : ''
                  }
                </div>
              </div>
            </div>
          )
        }
      </ModalBody>
    </Modal>
  );
}
