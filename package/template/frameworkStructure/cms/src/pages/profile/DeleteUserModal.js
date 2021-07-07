import React from 'react';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import Response from '../../lib/Response';
import { useHistory } from 'react-router-dom';
import apiClient from '../../lib/apiClient';

export default function DeleteUserModal(props) {
  let history = useHistory();

  const deleteUser = async () => {
    try {
      let timeBalanceUpdate = await apiClient(
        '/admin/delete',
        'POST',
        { user_id: props.userId },
        {},
        props.accessToken,
      );

      if (timeBalanceUpdate.responseCode === Response.STATUS_OK) {
        history.push('/users');
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
          Delete user ?
        </div>
      </ModalHeader>
      <ModalBody>
        <p className="text-center"><strong>{props.username}</strong> will be permanently deleted</p>
        <div className="d-flex w-100 justify-content-center">
          <button className="btn btn-outline-primary mx-2" onClick={deleteUser}>Yes</button>
          <button className="btn btn-primary mx-2" onClick={() => props.toggle()}>No</button>
        </div>
      </ModalBody>
    </Modal>
  );
}
