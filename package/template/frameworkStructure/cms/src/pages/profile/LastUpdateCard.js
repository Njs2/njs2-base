import React from 'react';
import { FaComment, FaClock } from 'react-icons/fa';
import Avatar from '../../components/Avatar';
import { Card, CardBody, CardHeader } from 'reactstrap';

export default function LastUpdateCard({ update }) {
  let location = update && update.location.name.split(',');
  let expectedLocation =
    location.length > 3
      ? location[location.length - 3] +
      ', ' +
      location[location.length - 1].split(' ')[0] +
      location[location.length - 1]
      : location.join(', ');
  return (
    <Card className="w-100">
      <CardHeader>
        <span>Last Update</span>
      </CardHeader>
      <CardBody>
        <div className="d-flex flex-1 align-items-center mb-2">
          <Avatar src={update.profile_picture_url ? update.profile_picture_url : '/default-profile-pic.png'}
                  style={{ width: 60, height: 60 }}
                  alt={update.user_name}
          />
          <div className="mx-3">
            <small><strong>{update.user_name}</strong></small><br />
            <small>{expectedLocation}</small>
          </div>
          {update.community_name && <p>{update.community_name}</p>}
        </div>
        <div>
          <h5>{update.title}</h5>
        </div>
        <div>
          <p>{update.description}</p>
        </div>
        <div className="position-relative">
          {update.required_hours && (
            <span className="position-absolute bg-light p-1 m-1 d-flex align-items-center">
              <FaClock
                className="mr-2" /> {update.required_hours && update.required_hours.hours} {update.required_hours && ('Hrs')} {update.required_hours && update.required_hours.hours} {update.required_hours && 'Min'}
            </span>
          )}
          <img src={update.image_url} className="updated-card-bg w-100" height="160px" alt={update.title} />
        </div>
        <span>
          <FaComment /> {update.comment_count}
        </span>
      </CardBody>
    </Card>
  );
}
