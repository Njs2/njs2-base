import React, { useState } from 'react';
import { Input, Modal, ModalBody, ModalHeader } from 'reactstrap';
import Response from '../../lib/Response';
import apiClient from '../../lib/apiClient';

export default function TimeBalanceModal(props) {
  let [hour, setHour] = useState(0);
  let [min, setMin] = useState(0);
  let [error, setError] = useState('');

  const updateUserTimeBalance = async () => {
    if (hour === 0 || min === 0) {
      setError('Please fill all the values');
      return;
    }
    try {
      let timeBalanceUpdate = await apiClient(
        '/admin/update_users_currency',
        'POST',
        { user_id: props.userId, hours: hour, mins: min },
        {},
        props.accessToken,
      );

      if (timeBalanceUpdate.responseCode === Response.STATUS_OK) {
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
          Add Time Currency
        </div>
      </ModalHeader>
      <ModalBody>
        {error && (<p className="text-center text-danger">{error}</p>)}
        <p>Current Time : {props.timeBalance ? `${props.timeBalance.hours}.${props.timeBalance.minutes}` : 0} Hrs</p>
        <p>Add Time : </p>
        <div className="col-12 mb-3">
          <Input type="number" name="hour" className="col-4" style={{ 'display': 'inline-block' }} onChange={(e) => {
            setError('');
            e.target.value
              ? setHour(parseFloat(e.target.value))
              : setHour(0);
          }} />
          <span className="mx-2">Hrs</span>
          <Input type="number" name="min" className="col-4" style={{ 'display': 'inline-block' }} onChange={(e) => {
            setError('');
            e.target.value
              ? setMin(e.target.value)
              : setMin(0);
          }} />
          <span className="mx-2">Mins</span>
        </div>

        <p>
          Total Time
          : {hour ? `${props.timeBalance.hours + hour}.${props.timeBalance.minutes + min}` : (props.timeBalance ? `${props.timeBalance.hours}.${props.timeBalance.minutes}` : 0)} Hrs</p>
        <button className="btn btn-primary float-right" onClick={updateUserTimeBalance}>Confirm</button>
      </ModalBody>
    </Modal>
  );
}
