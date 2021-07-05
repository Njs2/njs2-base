import React from 'react';
import { Card, CardBody, CardHeader, CardTitle } from 'reactstrap';
import Avatar from '../../components/Avatar';
import { FaArrowRight } from 'react-icons/fa';
import * as PropTypes from 'prop-types';

export default function FriendListCard(props) {
  return (
    <Card>
      <CardHeader>
        <span>Friends ({props.friends ? props.friends.length : 0})</span>
      </CardHeader>
      <CardBody>
        <div className="row">
          <div className="position-relative">
            <div className={'d-flex justify-content-around'}>
              {props.friends.length === 0 ? (<p className={'mx-3'}>No Friends yet..</p>) : ''}
              {props.friends.length !== 0 && props.friends.slice(0, props.itemCount).map((friend, index) => {
                return (
                  <div className="d-flex flex-row flex-wrap" key={index}>
                    <Card style={{ width: '10rem' }} className="mx-1">
                      <CardBody className="d-flex flex-column justify-content-between align-items-center">
                        <Avatar className="rounded-circle"
                                src={friend.profile_picture && friend.profile_picture.length !== 0 ? friend.profile_picture : '/default-profile-pic.png'}
                                style={{ height: 50, width: 50 }} />
                        <CardTitle className="text-center flex-1">
                          {friend.user_name}
                        </CardTitle>
                      </CardBody>
                    </Card>
                  </div>
                );
              })}
            </div>
            {
              props.friends.length > props.itemCount ?
                <button className="btn btn-light btn-circle btn-xl position-absolute text-center"
                        style={{ 'top': '35%', 'right': '-0.5rem' }}
                        onClick={props.onClick}><FaArrowRight /></button>
                : ''
            }
          </div>
        </div>
      </CardBody>
    </Card>);
}

FriendListCard.propTypes = {
  friends: PropTypes.arrayOf(PropTypes.any),
  onClick: PropTypes.func,
};