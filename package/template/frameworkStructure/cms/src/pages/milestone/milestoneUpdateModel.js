import React, { useState } from 'react';
import { Input, Modal, ModalBody, ModalHeader, Form, FormGroup, ButtonGroup, DropdownToggle, DropdownItem, UncontrolledButtonDropdown, DropdownMenu, Button, UncontrolledDropdown, Label, InputGroupText } from 'reactstrap';
import apiClient from '../../lib/apiClient';
import Response from '../../lib/Response';

export default function MilestoneUpdateModal(props) {
  let [iconType, setIconType] = useState(1);
  let [selectedFile, setSelectedFile] = useState();
  const [error, setError] = useState(false);
  const dropdownText = { 1: "Milestone Image", 2: "Milesone Completed Image" };

  const getUploadURL = async (extention) => {
    const res = await apiClient('/upload/url', 'GET', null, { file_extension: extention, path: "MILESTONE" }, props.accessToken);
    if (res.responseCode === Response.STATUS_OK) {
      return { upload_url: res.responseData.upload_url, key: res.responseData.image_id };
    } else if (res.responseCode === Response.TOKEN_EXPIRED) {
      props.resetAccessToken();
    } else {
      setError(true);
    }
  }

  const uploadFile = async (e) => {
    e.preventDefault();
    let data = new FormData();
    data.append('file', selectedFile);
    const uploadUrl = await getUploadURL(selectedFile.name.split('.')[selectedFile.name.split('.').length - 1]);
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", selectedFile.type);

    var requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      body: selectedFile,
      redirect: 'follow'
    };

    await fetch(uploadUrl.upload_url, requestOptions)
      .then(response => response.text());

    const res = await apiClient("/admin/milestone_icon", "PUT", { milestone_id: props.milestoneId, icon_type: iconType, icon_key: uploadUrl.key }, null, props.accessToken);
    if (res.responseCode === Response.STATUS_OK) {
      props.toggle();
    } else if (res.responseCode === Response.TOKEN_EXPIRED) {
      props.resetAccessToken();
    } else {
      setError(true);
    }
  }

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
          Update Milesone Icon
        </div>
      </ModalHeader>
      <ModalBody>
        {/* {!error && !uploadURL && getUploadURL() && ""} */}
        {!error && (
          <Form onSubmit={uploadFile}>
            <FormGroup>
              <InputGroupText>{props.milestoneName}</InputGroupText>
            </FormGroup>
            <FormGroup>
              <Label>Icon type:</Label>
              <UncontrolledDropdown>
                <DropdownToggle color="" caret>{dropdownText[iconType]}</DropdownToggle>
                <DropdownMenu>
                  <DropdownItem onClick={() => setIconType(1)}>{dropdownText[1]}</DropdownItem>
                  <DropdownItem onClick={() => setIconType(2)}>{dropdownText[2]}</DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </FormGroup>

            <FormGroup>
              <Label>Icon File</Label>
              <Input onChange={(e) => { e.preventDefault(); setSelectedFile(e.target.files[0]) }} type="file" name="file" required />
            </FormGroup>

            <FormGroup>
              <Button color="primary" type="submit">Submit</Button>
            </FormGroup>
          </Form>
        )}

      </ModalBody>
    </Modal>
  );
}
