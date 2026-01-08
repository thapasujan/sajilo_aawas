import { useState } from "react";
import { Lock, Mail } from "react-feather";

export const Field = () => {
  const [userDetails, setUserDetails] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUserDetails({ ...userDetails, [e.target.name]: value });
  };

  const LogInFields = [
    {
      id: 1,
      name: "email",
      placeholder: "email....",
      iconName: Mail,
      type: "text",
      value: userDetails.email,
      onchange: (e: React.ChangeEvent<HTMLInputElement>) => handleChange(e),
    },
    {
      id: 2,
      name: "password",
      placeholder: "password....",
      iconName: Lock,
      type: "password",
      value: userDetails.password,
      onchange: (e: React.ChangeEvent<HTMLInputElement>) => handleChange(e),
    },
  ];
  return { LogInFields };
};
