import React, { useState } from "react";
import { MdPersonPin, MdEdit } from "react-icons/md";
import { Table, Container, Button } from "reactstrap";
import PropTypes from 'utils/propTypes';
import Avatar from "../../components/Avatar";
import MilestoneUpdateModal from "./milestoneUpdateModel";
import apiClient from "../../lib/apiClient";
import Response from "../../lib/Response";

const UserMilestoneTable = ({ headers, usersData, showUpdateMilestoneModel, ...restProps }) => {
  return (
    <Table responsive hover {...restProps}>
      <thead>
        <tr className="text-capitalize align-middle text-center">
          {headers.map((item, index) => <th key={index}>{item}</th>)}
        </tr>
      </thead>
      <tbody>
        {usersData.map(({ id, avatar, name, description, avatar_completed }, index) => (
          <tr key={index}>
            <td className="align-middle text-center">{name}</td>
            <td className="align-middle text-center">{description}</td>
            <td className="align-middle text-center">
              <Avatar src={avatar} />
            </td>
            <td className="align-middle text-center">
              <Avatar src={avatar_completed} />
            </td>
            <td className="align-middle text-center">
              <Button color="primary" size="sm" onClick={(e) => { e.preventDefault(); showUpdateMilestoneModel(id); }}><MdEdit size={25} /></Button>
            </td>
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

export default function MileStoneList(props) {
  const [mileStoneList, setMileStoneList] = useState([]);
  const [error, setError] = useState(false);
  const [milestoneModalShow, setMilestoneModalShow] = useState(false);
  const [milestoneId, setMilestoneId] = useState(0);
  const [milestoneName, setMilestoneName] = useState(0);

  const loadMilestoneList = async () => {
    const res = await apiClient('/master/milestone', 'GET', null, null, props.accessToken);
    if (res.responseCode === Response.STATUS_OK) {
      setMileStoneList([...res.responseData.milestones]);
    } else if (res.responseCode === Response.TOKEN_EXPIRED) {
      props.resetAccessToken();
    } else {
      setError(true);
    }
  }

  const showUpdateMilestoneModel = (milestoneId) => {
    setMilestoneId(milestoneId);
    setMilestoneName(mileStoneList.filter(milestone => milestone.milestone_id === milestoneId)[0].milestone_name);
    setMilestoneModalShow(true);
  }

  return (
    <Container>
      {mileStoneList.length === 0 && !error && loadMilestoneList() && ""}

      <UserMilestoneTable
        showUpdateMilestoneModel={showUpdateMilestoneModel}
        headers={[
          'name',
          'Description',
          'Image',
          'Completed Image',
          'Action'
        ]}
        usersData={mileStoneList.map(milestone => {
          return {
            id: milestone.milestone_id,
            name: milestone.milestone_name,
            description: milestone.milestone_desc,
            avatar: milestone.milestone_image ? milestone.milestone_image : "/default-profile-pic.png",
            avatar_completed: milestone.milestone_image_completed ? milestone.milestone_image_completed : "/default-profile-pic.png",
          }
        })}
      />

      <MilestoneUpdateModal
        accessToken={props.accessToken}
        isOpen={milestoneModalShow}
        milestoneId={milestoneId}
        milestoneName={milestoneName}
        toggle={() => { setMilestoneModalShow(false); loadMilestoneList(); }}
      />
    </Container>);
}