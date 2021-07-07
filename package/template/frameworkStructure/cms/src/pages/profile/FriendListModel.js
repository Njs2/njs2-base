import React, { useState } from 'react';
import { Modal, ModalBody, ModalHeader, Table } from 'reactstrap';
import Avatar from '../../components/Avatar';
import PropTypes from 'utils/propTypes';
import { MdPersonPin } from 'react-icons/md';
import apiClient from '../../lib/apiClient';
import Response from '../../lib/Response';

const UserFriendsTable = ({ headers, usersData, ...restProps }) => {
  return (
    <Table responsive hover {...restProps}>
      <thead>
        <tr className="text-capitalize align-middle text-center">
          {headers.map((item, index) => <th key={index}>{item}</th>)}
        </tr>
      </thead>
      <tbody>
        {usersData.map(({ avatar, name }, index) => (
          <tr key={index}>
            <td className="align-middle text-center">
              <Avatar src={avatar} />
            </td>
            <td className="align-middle text-center">{name}</td>
          </tr>
        ))}
      </tbody>
    </Table >
  );
};

UserFriendsTable.propTypes = {
  headers: PropTypes.node,
  usersData: PropTypes.arrayOf(
    PropTypes.shape({
      avatar: PropTypes.string,
      name: PropTypes.string,
      date: PropTypes.date,
    })
  ),
};

UserFriendsTable.defaultProps = {
  headers: [],
  usersData: [],
};

export default function FriendListModel({ show, onHide, accessToken, resetAccessToken, userId }) {
  const [lastIndex, setLastIndex] = useState(0);
  const [friendsList, setFriendsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [inProgress, setInProgress] = useState(false);
  const [loadMoreData, setLoadMoreData] = useState(true);

  const loadFriendsList = async (reset) => {
    if ((reset && inProgress) || !loadMoreData) return;
    setInProgress(true);
    const res = await apiClient('/friends', 'GET', null, { friendship_type: 3, last_request_id: lastIndex && !reset ? lastIndex : undefined, other_user_id: userId }, accessToken);
    if (res.responseCode === Response.STATUS_OK) {
      reset ? setFriendsList([...res.responseData]) : setFriendsList([...friendsList, ...res.responseData]);
      if (!res.responseData || res.responseData.length < 10) setLoadMoreData(false);
      else setLastIndex(res.responseData[res.responseData.length - 1].request_id);
    } else if (res.responseCode === Response.TOKEN_EXPIRED) {
      resetAccessToken();
    } else {
      setError(true);
    }
    setInProgress(false);
    setLoading(false);
  }

  const scrollCheck = event => {
    if (!event.target.scrollTop) return;
    const bottom = event.target.scrollHeight - event.target.scrollTop === event.target.clientHeight;
    if (bottom) {
      loadFriendsList(false);
      // console.log("At The Bottom"); //Add in what you want here
    }
  };

  const heightCheck = event => {
    event.preventDefault();
    if (window.outerHeight > 1000 && friendsList.length < 20 && loadMoreData && !inProgress) {
      loadFriendsList(false);
    }
  };

  const modelStyle = { height: '70vh', overflow: 'scroll' };
  return (
    <Modal
      isOpen={show}
      toggle={onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      onScroll={scrollCheck}
      onLoad={heightCheck}
    >
      <ModalHeader toggle={onHide}>
        Friends List
      </ModalHeader>
      <ModalBody style={modelStyle}>
        {loading && <h1>Loading...</h1>}
        {error && <h1>Error. Try Refreshing.</h1>}
        {!error && friendsList.length === 0 && ((!inProgress && show && loadFriendsList(true) && false) || (!loading && (!loadMoreData ? <h1>No Data found</h1> : <h1>Loading...</h1>)))}
        {!error && friendsList.length !== 0 && <UserFriendsTable
          headers={[
            <MdPersonPin size={25} />,
            'name'
          ]}
          usersData={friendsList.map(friend => {
            return {
              avatar: friend.profile_picture && friend.profile_picture.length !== 0 ? friend.profile_picture : "/default-profile-pic.png",
              id: friend.request_id,
              name: friend.user_name
            }
          })}
        />}
        {friendsList.length !== 0 && loadMoreData && (
          <div className="loading">
            <p>Loading More....</p>
          </div>
        )}

      </ModalBody>
    </Modal>
  );
}
