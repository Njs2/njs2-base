import React from 'react';
import { Button, Card, CardBody, CardHeader, CardTitle, Progress } from 'reactstrap';
import Avatar from '../../components/Avatar';
import { FaArrowRight } from 'react-icons/fa';
import * as PropTypes from 'prop-types';

export default function MileStoneCard(props) {
  return <Card className="w-100 h-100">
    <CardHeader>
      <span>Milestones</span>
    </CardHeader>
    <CardBody className="d-flex">
      <div className="row position-relative">
        {props.milestones.length === 0 &&
        (<p className={'mx-3'}>Milestones not completed yet.</p>)
        }
        {props.milestones.slice(0, props.itemCount).map((milestone, index) => {
          return (
            <div className="d-flex flex-row flex-wrap" key={index}>
              <Card style={{ width: '10rem' }} className="mx-1">
                <CardBody className="d-flex flex-column justify-content-between align-items-center">
                  <div className="flex-1 d-flex flex-column justify-content-center align-items-center">
                    <Avatar src={milestone.milestone_image.length !== 0 ? milestone.milestone_image : '/default-profile-pic.png'}
                            className="flex-1"
                            style={{ height: 50, width: 50 }} />
                    <CardTitle className="text-center flex-1">
                      {milestone.milestone_name}
                    </CardTitle>
                  </div>
                  <div className="flex-1 d-flex flex-column justify-content-center align-items-center">
                    <p className="mt-5">Earn 5 Hours</p>
                    <Progress color="success"
                      value={(milestone.milestone_count_achived / milestone.milestone_count_required) * 100}
                      className="mb-3 w-100" style={{ height: 5 }} />
                    <p>
                      {milestone.milestone_count_achived}/
                      {milestone.milestone_count_required}
                    </p>
                  </div>
                </CardBody>
              </Card>
            </div>
          );
        })}
        {props.milestones.length !== 0 && props.milestones.length > props.itemCount && (
          <Button
            type="button"
            className="btn btn-light btn-circle btn-xl position-absolute text-center"
            style={{
              right: '-0.5rem',
              top: '45%',
            }}
            onClick={props.onClick}
          >
            <FaArrowRight />
          </Button>
        )}
      </div>
    </CardBody>
  </Card>;
}

MileStoneCard.propTypes = {
  milestones: PropTypes.arrayOf(PropTypes.any),
  onClick: PropTypes.func,
};