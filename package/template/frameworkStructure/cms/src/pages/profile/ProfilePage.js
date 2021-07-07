import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import MileStoneCard from './MileStoneCard';
import LastUpdateCard from './LastUpdateCard';
import Response from '../../lib/Response';
import DeleteUserModal from './DeleteUserModal';
import BlockUserModal from './BlockUserModal';
import ResetPasswordModal from './ResetPasswordModal';
import CommunityListCard from './CommunityListModel';
import MilestoneListModel from './MilestoneListModel';
import FriendListModel from './FriendListModel';
import ProfileCard from './ProfileCard';
import SkillCard from './SkillCard';
import TimeBalanceCard from './TimeBalanceCard';
import ChatHistoryCard from './ChatHistoryCard';
import FriendListCard from './FriendListCard';
import CommunitesCard from './CommunitesCard';
import Page from 'components/Page';
import { Button, Card, Col, Row } from 'reactstrap';
import apiClient from '../../lib/apiClient';

export default function ProfilePage({ accessToken, resetAccessToken }) {
  let [user, setUser] = useState({});
  let [masterSkills, setMasterSkills] = useState([]);
  let [userLocation, setUserLocation] = useState('');
  let [userSkillNames, setUserSkillNames] = useState([]);
  let [milestones, setMilestones] = useState([]);
  let [modalShow, setModalShow] = useState(false);
  let [deleteUserModalShow, setDeleteUserModalShow] = useState(false);
  let [resetPasswordModalShow, setResetPasswordModalShow] = useState(false);
  let [transactionListModalShow, setTransactionListModalShow] = useState(false);
  let [chatModalShow, setChatModalShow] = useState(false);
  let [communityListModalShow, setCommunityListModalShow] = useState(false);
  let [milestoneListModalShow, setMilestoneListModalShow] = useState(false);
  let [friendListModalShow, setFriendListModalShow] = useState(false);
  let [blockUserModalShow, setBlockUserModalShow] = useState(false);
  let [lastUpdate, setLastUpdate] = useState();
  let [friends, setFriends] = useState([]);
  let [communities, setCommunities] = useState([]);
  let history = useHistory();
  let { userId } = useParams();
  // userId = 252;

  const getViewport = () => {
    const width = Math.max(
      document.documentElement.clientWidth,
      window.innerWidth || 0
    );

    if (width <= 576) return 2;
    if (width <= 768) return 2;
    if (width <= 992) return 2;
    if (width <= 1200) return 2;
    return 3;
  }

  const itemCount = getViewport();
  let fetchUserProfile = async (userId, accessToken) => {
    try {
      let userPromise = apiClient('/users', 'GET', null, {
        other_user_id: userId,
      }, accessToken,
      );
      let userMilestonePromise = apiClient('/users/milestones', 'GET', null, {
        other_user_id: userId,
        type: 0,
      }, accessToken,
      );

      let lastUpdatePromise = apiClient('/posts', 'GET', null, {
        filter_type: 3,
        type: 3,
      }, accessToken,
      );

      let getUsersFriendPromise = apiClient('/friends', 'GET', null, {
        friendship_type: 3,
        other_user_id: userId,
        // last_request_id: 0,
        limit: 20,
      }, accessToken,
      );

      let communitiesListPromise = apiClient('/community/list', 'GET', null, {
        type: 1,
        last_community_id: undefined,
        limit: 10,
        other_user_id: userId,
      }, accessToken,
      );

      return await Promise.all([
        userPromise,
        userMilestonePromise,
        lastUpdatePromise,
        getUsersFriendPromise,
        communitiesListPromise,
      ]);
    } catch (e) {
      console.log(e);
    }
  };

  const fetchUserSkills = async (user) => {
    try {
      let masterSills = await apiClient('/master/skills', 'GET', null, {},
        accessToken,
      );
      if (masterSills.responseCode === Response.TOKEN_EXPIRED) {
        resetAccessToken();
      }
      if (masterSills.responseCode === Response.STATUS_OK) {
        setMasterSkills(masterSills.responseData.skills);

        let skills = {};
        for (const skill of masterSills.responseData.skills) {
          skills[skill.skill_id] = skill.skill_name;
        }

        let userSkill = user.skils_list;

        for (const skill of Object.entries(skills)) {
          if (userSkill && userSkill.includes(parseFloat(skill[0]))) {
            setUserSkillNames((pre) => pre.concat(skill[1]));
          }
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  // load user profile on component mount only
  useEffect(() => {
    fetchUserProfile(userId, accessToken)
      .then((res) => {
        let [userProfile, userMileStones, lastUpdates, friendList, communitiesList] = res;
        if (
          userProfile.responseCode === Response.TOKEN_EXPIRED ||
          userMileStones.responseCode === Response.TOKEN_EXPIRED ||
          lastUpdates.responseCode === Response.TOKEN_EXPIRED ||
          friendList.responseCode === Response.TOKEN_EXPIRED ||
          communitiesList.responseCode === Response.TOKEN_EXPIRED
        ) {
          resetAccessToken();
        }
        if (userProfile.responseCode === Response.STATUS_OK) {
          setUser(userProfile.responseData);

          let location = userProfile.responseData.user_location.name.split(',');
          let expectedLocation =
            location.length > 3
              ? location[location.length - 3] +
              ', ' +
              location[location.length - 1].split(' ')[0] +
              location[location.length - 1]
              : location.join(', ');

          setUserLocation(expectedLocation);

          fetchUserSkills(userProfile.responseData).catch(console.log);
        }
        if (userMileStones.responseCode === Response.STATUS_OK) {
          setMilestones(userMileStones.responseData);
        }
        if (lastUpdates.responseCode === Response.STATUS_OK) {
          setLastUpdate(lastUpdates.responseData.posts.shift());
        }
        if (friendList.responseCode === Response.STATUS_OK && lastUpdates.responseData.length !== 0) {
          setFriends(friendList.responseData);
        }
        if (communitiesList.responseCode === Response.STATUS_OK) {
          setCommunities(communitiesList.responseData.communities);
        }
      })
      .catch(console.log);
  }, []);

  return (
    <Page
      className="DashboardPage"
    >
      <Row>
        <Col sm={2} lg={2}>
          <Button onClick={() => {
            history.push('/users');
          }}
            color="primary"
            size="sm"
            block
          >
            Back
          </Button>
        </Col>
      </Row>

      <Row>
        <Col md="6" sm="12" xs="12">
          <Card>
            <Row>
              <Col>
                <ProfileCard user={user} userLocation={userLocation} />
              </Col>
            </Row>
            <Row className="mx-1">
              <Col sm={1} md={6} lg={4}>
                <Button color="primary" size="sm" onClick={() => setBlockUserModalShow(true)} block>Block</Button>
              </Col>
              <Col sm={1} md={6} lg={4}>
                <Button color="primary" size="sm" onClick={() => setResetPasswordModalShow(true)} block>Reset
                  Password</Button>
              </Col>
              <Col sm={1} md={6} lg={4} style={{ 'marginLeft': 'auto', 'marginRight': 'auto' }}>
                <Button color="primary" size="sm" onClick={() => setDeleteUserModalShow(true)} block>Delete
                  User</Button>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col md="6" sm="12" xs="12">
          <Col className="px-0">
            <SkillCard userSkillNames={userSkillNames} />
          </Col>
          <Col className="px-0">
            <Row>
              <Col md="6" sm="12" xs="12">
                <TimeBalanceCard
                  user={user}
                  onClick={() => setTransactionListModalShow(true)}
                  onClick1={() => setModalShow(true)}
                  accessToken={accessToken}
                  userId={userId}
                  open={modalShow}
                  toggle={() => setModalShow(false)}
                  open1={transactionListModalShow}
                  toggle1={() => setTransactionListModalShow(false)}
                />
              </Col>
              <Col md="6" sm="12" xs="12">
                <ChatHistoryCard
                  onClick={() => setChatModalShow(true)}
                  accessToken={accessToken}
                  userId={userId}
                  user={user}
                  open={chatModalShow}
                  toggle={() => setChatModalShow(false)}
                />
              </Col>
            </Row>
          </Col>
        </Col>

      </Row>

      <Row>
        <Col md="6" sm="12" xs="12">
          <FriendListCard itemCount={itemCount} friends={friends} onClick={() => setFriendListModalShow(true)} />
        </Col>
        <Col md="6" sm="12" xs="12">
          <CommunitesCard itemCount={itemCount} communities={communities} onClick={() => setCommunityListModalShow(true)} />
        </Col>
      </Row>

      <Row>
        <Col md="6" sm="12" xs="12">
          <MileStoneCard itemCount={itemCount} milestones={milestones} onClick={() => setMilestoneListModalShow(true)} />
        </Col>
        <Col md="6" sm="12" xs="12">
          {lastUpdate && <LastUpdateCard update={lastUpdate} />}
        </Col>
      </Row>

      <CommunityListCard
        accessToken={accessToken}
        show={communityListModalShow}
        onHide={() => setCommunityListModalShow(false)}
        userId={userId}
      />
      <MilestoneListModel
        milestones={milestones}
        show={milestoneListModalShow}
        onHide={() => setMilestoneListModalShow(false)}
      />
      <FriendListModel
        accessToken={accessToken}
        show={friendListModalShow}
        onHide={() => setFriendListModalShow(false)}
        userId={userId}
      />
      <ResetPasswordModal
        accessToken={accessToken}
        userId={userId}
        isOpen={resetPasswordModalShow}
        toggle={() => setResetPasswordModalShow(false)}
      />
      <BlockUserModal
        accessToken={accessToken}
        userId={userId}
        username={user.user_name}
        isOpen={blockUserModalShow}
        toggle={() => setBlockUserModalShow(false)}
      />
      <DeleteUserModal
        accessToken={accessToken}
        userId={userId}
        username={user.user_name}
        isOpen={deleteUserModalShow}
        toggle={() => setDeleteUserModalShow(false)}
      />
    </Page>
  );
}