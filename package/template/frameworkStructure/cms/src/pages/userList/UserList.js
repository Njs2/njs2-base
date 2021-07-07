import React, { useState } from 'react';
import { Container } from 'reactstrap';
import { useHistory } from 'react-router-dom';
import UserSearchComponent from './UserSearchComponent';
import { MdPersonPin } from 'react-icons/md';
import UserTable from './User';
import apiClient from '../../lib/apiClient';
import Response from '../../lib/Response';

const containerStyle = {
  // width: '100vw',
  height: '90vh',
  overflowY: 'auto'
}

export default function UserList(props) {
  const [searchText, setSearchText] = useState('');
  const [lastIndex, setLastIndex] = useState(0);
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [inProgress, setInProgress] = useState(false);
  const [loadMoreData, setLoadMoreData] = useState(true);
  const [filterType, setFilterType] = useState(0);

  let history = useHistory();

  const loadUsersList = async (reset) => {
    if ((reset && inProgress) || !loadMoreData) return;
    setInProgress(true);
    const res = await apiClient('/admin/search_users', 'GET', null, { type: 1, last_index: reset ? 0 : lastIndex, search_text: searchText, filtered_on: filterType }, props.accessToken);
    if (res.responseCode === Response.STATUS_OK) {
      reset ? setUserList([...res.responseData.users]) : setUserList([...userList, ...res.responseData.users]);
      if (!res.responseData.users || res.responseData.users.length < 10) setLoadMoreData(false);
      else setLastIndex(res.responseData.users[res.responseData.users.length - 1].user_index);
    } else if (res.responseCode === Response.TOKEN_EXPIRED) {
      props.resetAccessToken();
    } else {
      setError(true);
    }
    setInProgress(false);
    setLoading(false);
  }

  const handleClick = (userId) => {
    let path = `/user_profile/${userId}`;
    props.setRouteBreadcrumbs("");
    history.push(path);
  };

  function handleParamChange(e) {
    e.preventDefault();
    setLoadMoreData(true);
    const value = e.target.value;
    setSearchText(value);
  }

  function handleTypeChange(e) {
    e.preventDefault();
    setLoadMoreData(true);
    setSearchText("");
  }

  function onSetFilterType(val) {
    setLoadMoreData(true);
    setFilterType(val);
  }

  React.useEffect(() => {
    loadUsersList(true);
  }, [searchText]);

  React.useEffect(() => {
    loadUsersList(true);
  }, [filterType]);

  const scrollCheck = event => {
    if (!event.target.scrollTop) return;
    const bottom = event.target.scrollHeight - event.target.scrollTop === event.target.clientHeight;
    if (bottom) {
      loadUsersList(false);
      // console.log("At The Bottom"); //Add in what you want here
    }
  };

  const heightCheck = event => {
    event.preventDefault();
    if (window.outerHeight > 1000 && userList.length < 20 && loadMoreData && !inProgress) {
      loadUsersList(false);
    }
  };

  return (
    <Container className="" style={containerStyle} onScroll={scrollCheck} onLoad={heightCheck}>
      <UserSearchComponent
        onParamChange={handleParamChange}
        onTypeChange={handleTypeChange}
        filterType={filterType}
        setFilterType={onSetFilterType}
      />
      <div>
        <div className="d-flex flex-column align-items-center">
          {loading && <h1>Loading...</h1>}
          {error && <h1>Error. Try Refreshing.</h1>}
          {!error && userList.length === 0 && ((!inProgress && loadUsersList(true) && false) || (!loading && (!loadMoreData ? <h1>No Data found</h1> : <h1>Loading...</h1>)))}
          {userList.length !== 0 &&
            <UserTable
              headers={[
                <MdPersonPin size={25} />,
                'name',
                'email',
                'location',
                'Sign up date',
                'last sign in',
                ''
              ]}
              usersData={userList.map(user => {
                let location = user.user_location.name.split(',');
                let expectedLocation =
                  location.length > 3
                    ? location[location.length - 3] +
                    ', ' +
                    location[location.length - 1].split(' ')[0] +
                    location[location.length - 1]
                    : location.join(', ');
                return {
                  avatar: user.profile_picture && user.profile_picture.length !== 0 ? user.profile_picture : "/default-profile-pic.png",
                  id: user.user_id,
                  name: user.user_name ? user.user_name : "",
                  email: user.email_id,
                  location: expectedLocation,
                  sign_up_date: new Date(user.signed_up_at).toLocaleDateString(),
                  last_sign_in: new Date(user.last_sign_in_at).toLocaleDateString(),
                  btnText: "View Profile",
                  onButtonClick: handleClick
                }
              })}
            />}
          {userList.length !== 0 && loadMoreData && (
            <div className="loading">
              <p>Loading More....</p>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}
