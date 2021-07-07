import React from 'react';
import { Card, CardBody, CardHeader } from 'reactstrap';

export default function SkillCard(props) {
  return (
    <Card>
      <CardHeader>
        <span>Skills</span>
      </CardHeader>
      <CardBody>
        {
          props.userSkillNames.length !== 0 && (
            <div className="d-flex flex-wrap">
              {props.userSkillNames.map((skill, index) => {
                return (
                  <span className="badge-outline-primary mr-2 mb-2" key={index}>
                  {skill}
                </span>
                );
              })}
            </div>
          )
        }
        {
          props.userSkillNames.length === 0 && (
            <p>No skills yet.. </p>
          )
        }
      </CardBody>
    </Card>
  );
}