import React from 'react';
import { Card, CardBody, CardHeader, CardTitle } from 'reactstrap';
import Avatar from '../../components/Avatar';
import { FaArrowRight } from 'react-icons/fa';
import * as PropTypes from 'prop-types';

export default function CommunitiesCard(props) {
  return (
    <Card>
      <CardHeader>
        <span>Communities</span>
      </CardHeader>
      <CardBody>
        <div className="row">
          <div className="position-relative">
            <div className={'d-flex justify-content-around'}>
              {props.communities.length === 0 ? (<p className={'mx-3'}>No communities yet..</p>) : ''}
              {props.communities.length !== 0 && props.communities.slice(0, props.itemCount).map((community, index) => {
                return (
                  <div className="d-flex flex-row flex-wrap" key={index}>
                    <Card style={{ width: '10rem' }} className="mx-1">
                      <CardBody className="d-flex flex-column justify-content-between align-items-center">
                        <Avatar className="rounded-circle"
                                src={community.community_picture_url && community.community_picture_url.length !== 0 ? community.community_picture_url : '/default-profile-pic.png'}
                                style={{ height: 50, width: 50 }}
                        />
                        <CardTitle className="text-center flex-1">
                          {community.community_name}
                        </CardTitle>
                      </CardBody>
                    </Card>
                  </div>
                );
              })}
            </div>
            {
              props.communities.length > props.itemCount ?
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

CommunitiesCard.propTypes = {
  communities: PropTypes.arrayOf(PropTypes.any),
  onClick: PropTypes.func,
};