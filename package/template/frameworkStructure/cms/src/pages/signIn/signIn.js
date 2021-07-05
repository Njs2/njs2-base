import React, { useState } from "react";
import { FormGroup, Input, Col, Card, Row, Form, Button, Label } from "reactstrap";
import Response from "../../lib/Response";
import apiClient from "../../lib/apiClient";
import { APP_TITLE } from "../../config/settings";

export default function SignIn({ onAccessTokenUpdate }) {
  let [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function signInHandler(e) {
    e.preventDefault();
    setError("");
    const res = await apiClient("/users/sign_in", "POST", {
      email: email,
      password: password,
      type: 5,
    });

    if (res.responseCode === Response.STATUS_OK) {
      onAccessTokenUpdate(res.responseData.access_token);
      localStorage.setItem("access_token", res.responseData.access_token);
      window.location.href = '/';
    } else {
      setError(res.responseMessage);
    }
  }

  return (
    <Row
      style={{
        height: '100vh',
        width: '100vw',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Col md={6} lg={4}>
        <Card body style={{ margin: '0 0 0 1.5rem' }}>
          <Form
            onSubmit={signInHandler}
          >
            <div className="text-center pb-4">
              <h3 className="text-center">{APP_TITLE}</h3>
            </div>
            <hr />
            <FormGroup>
              <Label for="email">{"Email Id"}</Label>
              <Input
                name="email"
                type="email"
                placeholder="your@email.com"
                onChange={(e) => { setEmail(e.target.value); }}
              />
            </FormGroup>
            <FormGroup>
              <Label for="password">{"Password"}</Label>
              <Input name="password" placeholder="Password" type="password" onChange={(e) => { setPassword(e.target.value); }} />
            </FormGroup>
            <hr />
            <Button type="submit" size="lg" block color="primary" className="border-0">
              Login
            </Button>
            {error && <p className="mt-2 text-danger text-center">{error}</p>}
          </Form>
        </Card>
      </Col>
    </Row>
  );
}