// components/RegisterForm.tsx
import React, { useState } from 'react';

interface RegisterFormProps {
  onSubmit: (username: string, password: string) => void;
  onSwitch: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit, onSwitch }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(username, password);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="username"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Register</button>
      <button type="button" onClick={onSwitch}>Switch to Login</button>
    </form>
  );
};

export default RegisterForm;
