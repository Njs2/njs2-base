import React from 'react';
import { Card, CardBody, CardHeader } from 'reactstrap';
import { FaChevronRight, FaClock } from 'react-icons/fa';
import TimeBalanceModal from './TimeBalanceModal';
import TransactionListModal from './TransactionListModal';
import * as PropTypes from 'prop-types';

export default function TimeBalanceCard(props) {
  return (
    <Card>
      <CardHeader>
        <span>Time Balance</span>
      </CardHeader>
      <CardBody>
        <div className="d-flex">
          <div className="card col-10 d-inline-flex ">
            <div className="d-flex my-2 justify-content-between align-items-center">
              <FaClock style={{ 'fontSize': '1.2rem' }} />
              <span>{props.user.user_time_currency ? `${props.user.user_time_currency.hours}.${props.user.user_time_currency.minutes}` : 0} HRS</span>
              <FaChevronRight className="text-success pointer" style={{ 'fontSize': '1.2rem' }}
                onClick={props.onClick} />
            </div>
          </div>
          <button
            className="btn btn-primary rounded-circle mx-3 align-self-center"
            onClick={props.onClick1}
          >
            +
        </button>
        </div>
      </CardBody>
      <TimeBalanceModal
        accessToken={props.accessToken}
        userId={props.userId}
        isOpen={props.open}
        toggle={props.toggle}
        timeBalance={props.user.user_time_currency}
      />
      <TransactionListModal
        accessToken={props.accessToken}
        userId={props.userId}
        isOpen={props.open1}
        toggle={props.toggle1}
      />
    </Card>);
}

TimeBalanceCard.propTypes = {
  user: PropTypes.shape({}),
  onClick: PropTypes.func,
  onClick1: PropTypes.func,
  accessToken: PropTypes.any,
  userId: PropTypes.any,
  open: PropTypes.bool,
  toggle: PropTypes.func,
  open1: PropTypes.bool,
  toggle1: PropTypes.func,
};