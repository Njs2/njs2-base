import React from 'react';
import ChatHistoryModel from './ChatHistoryModel';
import * as PropTypes from 'prop-types';
import { Card, CardBody, CardHeader, Button } from 'reactstrap';

export default function ChatHistoryCard(props) {
  return (
    <Card>
      <CardHeader>
        <span>Chat</span>
      </CardHeader>
      <CardBody className="d-flex justify-content-center my-2">
        <Button
        color="primary"
          className="btn"
          size="sm"
          onClick={props.onClick}
          block
        >
          View Chat History
        </Button>
        <ChatHistoryModel
          accessToken={props.accessToken}
          userId={props.userId}
          isOpen={props.open}
          toggle={props.toggle}
        />
      </CardBody>
    </Card>
  );
}

ChatHistoryCard.propTypes = {
  onClick: PropTypes.func,
  accessToken: PropTypes.any,
  userId: PropTypes.any,
  open: PropTypes.bool,
  toggle: PropTypes.func,
};