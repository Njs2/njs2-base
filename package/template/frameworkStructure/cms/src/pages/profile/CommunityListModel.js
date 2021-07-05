import React, { useState } from 'react';
import { Modal, Card, ModalBody, ModalHeader, CardTitle, CardBody, CardImg, CardText } from 'reactstrap';
import apiClient from '../../lib/apiClient';
import Response from '../../lib/Response';

export default function CommunityListCard({ show, onHide, accessToken, resetAccessToken, userId }) {
  const [lastIndex, setLastIndex] = useState(0);
  const [communityList, setCommunityList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [inProgress, setInProgress] = useState(false);
  const [loadMoreData, setLoadMoreData] = useState(true);

  const loadCommunityList = async (reset) => {
    if ((reset && inProgress) || !loadMoreData) return;
    setInProgress(true);
    const res = await apiClient('/community/list', 'GET', null, { type: 1, last_community_id: lastIndex && !reset ? lastIndex : undefined, other_user_id: userId }, accessToken);
    if (res.responseCode === Response.STATUS_OK) {
      reset ? setCommunityList([...res.responseData.communities]) : setCommunityList([...communityList, ...res.responseData.communities]);
      if (!res.responseData.communities || res.responseData.communities.length < 10) setLoadMoreData(false);
      else setLastIndex(res.responseData.communities[res.responseData.communities.length - 1].community_id);
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
      loadCommunityList(false);
      // console.log("At The Bottom"); //Add in what you want here
    }
  };

  const heightCheck = event => {
    event.preventDefault();
    if (window.outerHeight > 1000 && communityList.length < 20 && loadMoreData && !inProgress) {
      loadCommunityList(false);
    }
  };

  const modelStyle = { height: '70vh', overflow: 'scroll' };
  return (
    <Modal
      isOpen={show}
      toggle={onHide}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      onScroll={scrollCheck}
      onLoad={heightCheck}
    >
      <ModalHeader toggle={onHide}>
        Community List
      </ModalHeader>
      <ModalBody style={modelStyle}>
        {loading && <h1>Loading...</h1>}
        {error && <h1>Error. Try Refreshing.</h1>}
        {!error && communityList.length === 0 && ((!inProgress && show && loadCommunityList(true) && false) || (!loading && (!loadMoreData ? <h1>No Data found</h1> : <h1>Loading...</h1>)))}
        {communityList.map((community) => {
          return (
            <Card className="flex-row mb-2" key={community.community_id}>
              <CardImg
                className="card-img-left"
                src={community.community_picture_url}
                style={{ width: 150, height: 150 }}
              />
              <CardBody>
                <CardTitle>{community.community_name}</CardTitle>
                <CardText>
                  {community.community_description}
                </CardText>
              </CardBody>
            </Card>
          );
        })}
        {communityList.length !== 0 && loadMoreData && (
          <div className="loading">
            <p>Loading More....</p>
          </div>
        )}

      </ModalBody>
    </Modal>
  );
}
