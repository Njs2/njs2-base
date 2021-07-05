import { Row, Col, Form, FormGroup, Input, Button } from "reactstrap";
import React, { useState } from 'react';

export default function UserSearchComponent({ onParamChange, onTypeChange }) {
  const [searchText, setSearchText] = useState("");

  return (
    <Row >
      <Col xl={2} />
      <Col xl={10}>
        <Form className="mb-4 mt-5" onSubmit={(e) => e.preventDefault()}>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Input
                  onChange={(e) => { setSearchText(e.target.value); onParamChange(e); }}
                  name="search_text"
                  type="text"
                  value={searchText}
                  placeholder="Search Name or Email ID"
                />
              </FormGroup>
            </Col>
            <Col>
              <FormGroup xs="auto" className="ml-2">
                <Button onClick={(e) => { setSearchText(""); onTypeChange(e); }} color="primary">
                  Clear
              </Button>
              </FormGroup>
            </Col>
            {/* <Col>
              <FormGroup xs="auto">
                <ButtonGroup>
                  <UncontrolledButtonDropdown>
                    <DropdownToggle color="primary" caret>{dropdownText[filterType]}</DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem onClick={() => setFilterType(0)}>{dropdownText[0]}</DropdownItem>
                      <DropdownItem onClick={() => setFilterType(1)}>{dropdownText[1]}</DropdownItem>
                      <DropdownItem onClick={() => setFilterType(2)}>{dropdownText[2]}</DropdownItem>
                    </DropdownMenu>
                  </UncontrolledButtonDropdown>
                </ButtonGroup>
              </FormGroup>
            </Col> */}
          </Row>
        </Form>
      </Col>
      <Col md={2} />
    </Row>
  );
}