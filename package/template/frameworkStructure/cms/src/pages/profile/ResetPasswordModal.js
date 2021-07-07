import React from 'react';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import Response from '../../lib/Response';
import apiClient from '../../lib/apiClient';

export default function ResetPasswordModal(props) {

  const updateUserTimeBalance = async () => {
    try {
      let resetUserPassword = await apiClient(
        '/admin/reset_user_password',
        'POST',
        { user_id: props.userId },
        {},
        props.accessToken,
      );

      if (resetUserPassword.responseCode === Response.STATUS_OK) {
        props.toggle();
      }

    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Modal
      isOpen={props.isOpen}
      toggle={props.toggle}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <ModalHeader toggle={props.toggle}>
        <div id="contained-modal-title-vcenter">
          Reset Password
        </div>
      </ModalHeader>
      <ModalBody>
        <p className="text-center">Password Recovery link will be sent to user's email</p>
        <div className="d-flex w-100 justify-content-center">
          <button className="btn btn-outline-primary mx-2" onClick={updateUserTimeBalance}>Yes</button>
          <button className="btn btn-primary mx-2" onClick={() => props.toggle()}>No</button>
        </div>
      </ModalBody>
    </Modal>
  );
}
