import React from 'react';
import PropTypes from 'utils/propTypes';
import { Table, Button } from 'reactstrap';
import Avatar from 'components/Avatar';

const UserTable = ({ headers, usersData, ...restProps }) => {
  return (
    <Table responsive hover {...restProps}>
      <thead>
        <tr className="text-capitalize align-middle text-center">
          {headers.map((item, index) => <th key={index}>{item}</th>)}
        </tr>
      </thead>
      <tbody>
        {usersData.map(({ avatar, id, name, email, location, sign_up_date, last_sign_in, btnText, onButtonClick }, index) => (
          <tr key={index}>
            <td className="align-middle text-center">
              <Avatar src={avatar} />
            </td>
            <td className="align-middle text-center">{name}</td>
            <td className="align-middle text-center">{email}</td>
            <td className="align-middle text-center">{location}</td>
            <td className="align-middle text-center">{sign_up_date}</td>
            {last_sign_in && (<td className="align-middle text-center">{last_sign_in}</td>)}
            <td className="align-middle text-center">
              <Button color="primary" size="sm" onClick={() => onButtonClick(id)}>
                {btnText}
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table >
  );
};

UserTable.propTypes = {
  headers: PropTypes.node,
  usersData: PropTypes.arrayOf(
    PropTypes.shape({
      avatar: PropTypes.string,
      name: PropTypes.string,
      date: PropTypes.date,
    })
  ),
};

UserTable.defaultProps = {
  headers: [],
  usersData: [],
};

export default UserTable;
