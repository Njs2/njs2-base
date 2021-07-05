import React from 'react';
import Avatar from '../../components/Avatar';
import { FaEnvelopeOpen, FaStar } from 'react-icons/fa';


export default function ProfileCard(props) {
  return <div>
    <div className="card align-items-center">
      <div className="my-3">
        <Avatar src={props.user.profile_picture_url ? props.user.profile_picture_url : '/default-profile-pic.png'}
          style={{ width: 70, height: 70 }} />
      </div>
      <div className="text-center">
        <h4>
          {props.user.user_name}
        </h4>
        <p><span><FaStar /></span> {props.user.ratings}</p>
        <small>{props.userLocation}</small>
      </div>
      <div className="d-flex flex-column text-center w-100">
        <small><FaEnvelopeOpen /> {props.user.email_id}</small>
        <hr className="w-100" />
        <div className="d-flex justify-content-center w-100 mb-3">
          <small style={{ 'flex': 1 }}>Sign Up date
            : <br /> {props.user.signed_up_at ? new Date(props.user.signed_up_at).toLocaleDateString() : ''}</small>
          <small style={{ 'flex': 1 }}>
            Last Sign in
            : <br /> {props.user.last_sign_in_at ? new Date(props.user.last_sign_in_at).toLocaleDateString() : ''}
          </small>
        </div>
      </div>
    </div>
  </div>;
}