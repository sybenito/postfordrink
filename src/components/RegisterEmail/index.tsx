import React, { useReducer } from "react";
import type { FC } from "react";
import { Input, Form, Button } from "antd";
import type { Rule } from "antd/lib/form";

interface RegisterEmailProps {
  handleSubmit: (registration: RegistrationType) => void;
  isLoading?: boolean;
}

interface RegistrationType {
  email: string;
  name: string;
}

const registrationInitState: RegistrationType = {
  email: "",
  name: "",
};

const emailValidationRules: Rule[] = [
  {
    required: true,
    message: "Please input your email address",
  },
  {
    type: "email",
    message: "Please enter a valid email address",
  },
];

const nameValidationRules: Rule[] = [
  {
    required: true,
    message: "Please input your name",
  },
];

const emailReducer = (state: RegistrationType, action: { type: string; payload: string }) => {
  switch (action.type) {
    case "UPDATE_EMAIL":
      return { ...state, email: action.payload };
    case "UPDATE_NAME":
      return { ...state, name: action.payload };
    default:
      return state;
  }
};

const RegisterEmail: FC<RegisterEmailProps> = ({ handleSubmit, isLoading }) => {
  const [registration, reduceRegistration] = useReducer(emailReducer, registrationInitState);

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    reduceRegistration({ type: "UPDATE_EMAIL", payload: event.target.value });
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    reduceRegistration({ type: "UPDATE_NAME", payload: event.target.value });
  };

  const handleFormSubmit = () => {
    handleSubmit(registration);
  };

  return (
    <div className="register-email">
      <Form onFinish={handleFormSubmit}>
        <Form.Item label="Name" name="name" rules={nameValidationRules}>
          <Input
            type="text"
            placeholder="Your Name"
            value={registration.name}
            onChange={handleNameChange}
            disabled={isLoading}
          />
        </Form.Item>
        <Form.Item label="Email Address" name="email" rules={emailValidationRules}>
          <Input
            type="email"
            placeholder="email@address.com"
            value={registration.email}
            onChange={handleEmailChange}
            disabled={isLoading}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            Sign In
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default RegisterEmail;
export type { RegistrationType };
