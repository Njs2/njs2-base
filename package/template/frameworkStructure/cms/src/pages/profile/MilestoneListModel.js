import React from 'react';
import { Modal, ModalBody, ModalHeader, Table, Progress } from 'reactstrap';
import Avatar from '../../components/Avatar';
import PropTypes from 'utils/propTypes';
import { MdPersonPin } from 'react-icons/md';

const UserMilestoneTable = ({ headers, usersData, ...restProps }) => {
  return (
    <Table responsive hover {...restProps}>
      <thead>
        <tr className="text-capitalize align-middle text-center">
          {headers.map((item, index) => <th key={index}>{item}</th>)}
        </tr>
      </thead>
      <tbody>
        {usersData.map(({ avatar, name, description, progress, completed, max_progress }, index) => (
          <tr key={index}>
            <td className="align-middle text-center">
              <Avatar src={avatar} />
            </td>
            <td className="align-middle text-center">{name}</td>
            <td className="align-middle text-center">{description}</td>
            <td className="align-middle text-center">
              <Progress value={progress} max={max_progress} style={{ height: 5 }} />
            </td>
            <td className="align-middle text-center">{completed}</td>
            <td className="align-middle text-center">{parseInt(progress >= max_progress ? 100 : (progress / max_progress) * 100)}%</td>
          </tr>
        ))}
      </tbody>
    </Table >
  );
};

UserMilestoneTable.propTypes = {
  headers: PropTypes.node,
  usersData: PropTypes.arrayOf(
    PropTypes.shape({
      avatar: PropTypes.string,
      name: PropTypes.string,
      date: PropTypes.date,
    })
  ),
};

UserMilestoneTable.defaultProps = {
  headers: [],
  usersData: [],
};

export default function MilestoneListModel({ show, onHide, milestones }) {
  const modelStyle = { height: '70vh', overflow: 'scroll' };
  return (
    <Modal
      isOpen={show}
      toggle={onHide}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <ModalHeader toggle={onHide}>
        Milestone List
      </ModalHeader>
      <ModalBody style={modelStyle}>
        <UserMilestoneTable
          headers={[
            <MdPersonPin size={25} />,
            'name',
            'Description',
            'progress',
            'completed',
            'percentage',
          ]}
          usersData={milestones.map(milestone => {
            return {
              avatar: milestone.milestone_image.length !== 0 ? milestone.milestone_image : '/default-profile-pic.png',
              id: milestone.milestone_id,
              name: milestone.milestone_name,
              description: milestone.milestone_desc,
              progress: milestone.milestone_count_achived,
              completed: `${milestone.milestone_count_achived}/${milestone.milestone_count_required}`,
              max_progress: milestone.milestone_count_required
            }
          })}
        />
      </ModalBody>
    </Modal>
  );
}
