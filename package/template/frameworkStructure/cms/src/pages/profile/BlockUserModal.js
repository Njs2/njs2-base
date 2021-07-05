import React, { useState } from 'react';
import { Col, Form, FormGroup, Input, Label, Modal, ModalBody, ModalHeader } from 'reactstrap';
import Response from '../../lib/Response';
import apiClient from '../../lib/apiClient';

export default function BlockUserModal(props) {
  let [startTime, setStartTime] = useState(0);
  let [endTime, setEndTime] = useState(0);
  let [startDate, setStartDate] = useState(0);
  let [endDate, setEndDate] = useState(0);
  let [error, setError] = useState('');

  const setBlockTime = async (e) => {
    e.preventDefault();
    if (startTime === 0 || endTime === 0 || startDate === 0 || endDate === 0) {
      setError('Please fill all the values');
      return;
    }
    try {
      let blockUser = await apiClient(
        '/admin/block_user',
        'POST',
        {
          start_datetime: new Date(`${startDate} ${startTime}`).getTime(),
          end_datetime: new Date(`${endDate} ${endTime}`).getTime(),
          user_id: props.userId,
        },
        {},
        props.accessToken,
      );

      if (blockUser.responseCode === Response.STATUS_OK) {
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
          Block user
        </div>
      </ModalHeader>
      <ModalBody>
        <p className="text-center">Block user <strong>{props.username}</strong></p>
        <Form>
          {error && (<p className="text-center text-danger">{error}</p>)}
          <div>
            <FormGroup row>
              <Label for="startTime" sm={3}>Start Time :</Label>
              <Col sm={6}>
                <Input type="time" name="startTime" id="startTime" requried="true" onChange={(e) => {
                  setError('');
                  e.target.value
                    ? setStartTime(e.target.value)
                    : setStartTime(0);
                }} />
              </Col>
            </FormGroup>
          </div>
          <div>
            <FormGroup row>
              <Label for="endTime" sm={3}>End Time :</Label>
              <Col sm={6}>
                <Input type="time" name="endTime" id="endTime" requried="true" onChange={(e) => {
                  setError('');
                  e.target.value
                    ? setEndTime(e.target.value)
                    : setEndTime(0);
                }} />
              </Col>
            </FormGroup>
          </div>
          <div>
            <FormGroup row>
              <Label for="startDate" sm={3}>Start Date :</Label>
              <Col sm={6}>
                <Input type="date" name="startDate" id="startDate" requried="true" onChange={(e) => {
                  setError('');
                  e.target.value
                    ? setStartDate(e.target.value)
                    : setStartDate(0);
                }} />
              </Col>
            </FormGroup>
          </div>
          <div>
            <FormGroup row>
              <Label for="endDate" sm={3}>End Date :</Label>
              <Col sm={6}>
                <Input type="date" name="endDate" id="endDate" requried="true" onChange={(e) => {
                  setError('');
                  e.target.value
                    ? setEndDate(e.target.value)
                    : setEndDate(0);
                }} />
              </Col>
            </FormGroup>
          </div>
          <div className="d-flex justify-content-center">
            <button className="btn btn-primary" type="submit" onClick={setBlockTime}>Confirm</button>
          </div>
        </Form>
      </ModalBody>
    </Modal>
  );
}
