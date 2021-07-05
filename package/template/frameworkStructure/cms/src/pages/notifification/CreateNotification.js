import React, { Component } from "react";
import { Row, Col, Card, CardHeader, CardBody, Form, FormGroup, Label, Input, Button } from "reactstrap";
import Response from "../../lib/Response";
import apiClient from "../../lib/apiClient";

export default class CreateNotification extends Component {
  state = {
    notificationName: null,
    notificationDescription: null,
    hours: null,
    minutes: null,
    startDate: null,
    msgStatus: { display: 'none' }
  };

  async componentDidMount() {
  }

  sendNotification = async (e) => {
    e.preventDefault();
    let hours = this.state.hours && this.state.hours.length === 1 ? '0' + this.state.hours : this.state.hours;
    let minutes = this.state.minutes && this.state.minutes.length === 1 ? '0' + this.state.minutes : this.state.minutes;
    const time = new Date(`${this.state.startDate}T${hours}:${minutes}:00.000Z`).getTime();
    const res = await apiClient('/admin/send_notification', 'POST', {
      user_ids: 0,
      notification_type: 1,
      notification_text: this.state.notificationDescription,
      notification_title: this.state.notificationName,
      time
    }, {}, this.props.accessToken);
    if (res.responseCode === Response.STATUS_OK) {
      this.setState({ msgStatus: { display: 'block', color: 'green' } });
      setTimeout(() => {
        this.setState({ msgStatus: { display: 'none' } });
      }, 5000);
    }
  }

  setFormState = (stateName, e) => {
    this.setState({ [stateName]: e.target.value });
  }

  render() {
    return (
        <Row>
          <Col md={1}></Col>
          <Col xl={6} lg={12} md={12}>
            <Card>
              <CardHeader>Create Notification</CardHeader>
              <CardBody>
                <Form onSubmit={this.sendNotification}>
                  <FormGroup>
                    <Label for="exampleEmail">Notification Name</Label>
                    <Input
                      type="text"
                      className="form-control"
                      id="notification_name"
                      placeholder="Enter notification name"
                      onChange={(e) => this.setFormState("notificationName", e)} required
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label for="exampleEmail">Notification Description</Label>
                    <Input
                      type="text"
                      className="form-control"
                      id="notification_description"
                      placeholder="Enter notification description"
                      onChange={(e) => this.setFormState("notificationDescription", e)} required
                    />
                  </FormGroup>

                  <FormGroup inline>
                    <Row>
                      <Col>
                        <Label htmlFor="hours">Start Time:</Label>
                      </Col>
                      <Col>
                        <Input type="number" min={0} max={24} id="hours" placeholder="00" onChange={(e) => this.setFormState("hours", e)} required />
                      </Col>
                      <Col>
                        <Label>Hrs</Label>
                      </Col>
                      <Col>
                        <Input type="number" step="1" min={0} max={60} id="minutes" onChange={(e) => this.setFormState("minutes", e)} placeholder="00" required />
                      </Col>
                      <Col><Label>Mins</Label></Col>
                    </Row>
                  </FormGroup>

                  <FormGroup>
                    <Label htmlFor="start_date">Strart Date:</Label>
                    <Input type="date" id="start_date" placeholder="Enter notification description" onChange={(e) => this.setFormState("startDate", e)} required />
                  </FormGroup>

                  <FormGroup>
                    <Button type="submit" color="primary" size="md" className="btn" block>Send Notification</Button>
                    <p className="row" style={this.state.msgStatus} >Notification sent</p>
                  </FormGroup>
                </Form>
              </CardBody>
            </Card>
          </Col>
          <Col md={1}></Col>
        </Row>
    );
  }
}