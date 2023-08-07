import React, { useState } from "react";
import type { FC } from "react";
import { Input, Form, Button } from "antd";
import type { Rule } from "antd/lib/form";

interface RegisterEmailProps {
  handleSubmit: (email: string) => void;
  isLoading?: boolean;
}

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


const RegisterEmail: FC<RegisterEmailProps> = ({handleSubmit, isLoading}) => {
  const [email, setEmail] = useState<string>("");

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  }

  const handleFormSubmit = () => {
    handleSubmit(email);
  }

  return (
    <div className="register-email">
      <Form onFinish={handleFormSubmit}>
        <Form.Item
        label="Email Address"
        name="email"
        rules={emailValidationRules}
        >
          <Input type="email" placeholder="email@address.com" value={email} onChange={handleEmailChange} disabled={isLoading} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            Register
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default RegisterEmail;