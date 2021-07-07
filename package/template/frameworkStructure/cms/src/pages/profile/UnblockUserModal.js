import React from 'react';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import Response from '../../lib/Response';
import apiClient from '../../lib/apiClient';

export default function UnblockUserModal(props) {

  const updateUserBlockStatus = async () => {
    try {
      let resetUserPassword = await apiClient(
        '/admin/unblock_user',
        'POST',
        { user_id: props.userId },
        {},
        props.accessToken,
      );

      if (resetUserPassword.responseCode === Response.STATUS_OK) {
        props.loadUsersList();
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
          Unblock {props.user_name} ?
        </div>
      </ModalHeader>
      <ModalBody>
        <p className="text-center">{props.user_name} will be unblocked with immediate effect</p>
        <div className="d-flex w-100 justify-content-center">
          <button className="btn btn-outline-primary mx-2" onClick={updateUserBlockStatus}>Yes</button>
          <button className="btn btn-primary mx-2" onClick={() => props.toggle()}>No</button>
        </div>
      </ModalBody>
    </Modal>
  );
}
