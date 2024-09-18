import React, { useState } from 'react';

interface LoginRegisterFormProps {
  onLogin: (username: string, password: string) => void;
  onRegister: (username: string, password: string) => void;
}

const LoginRegisterForm: React.FC<LoginRegisterFormProps> = ({ onLogin, onRegister }) => {
  const [usernameLogin, setUsernameLogin] = useState('');
  const [passwordLogin, setPasswordLogin] = useState('');
  const [usernameRegister, setUsernameRegister] = useState('');
  const [passwordRegister, setPasswordRegister] = useState('');

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onLogin(usernameLogin, passwordLogin);
  };

  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onRegister(usernameRegister, passwordRegister);
  };

  return (
    <div className='loginregister'>
      <form onSubmit={handleLogin}>
        <h2>Login</h2>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={usernameLogin}
          onChange={(e) => setUsernameLogin(e.target.value)}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={passwordLogin}
          onChange={(e) => setPasswordLogin(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>

      <form onSubmit={handleRegister}>
        <h2>Register</h2>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={usernameRegister}
          onChange={(e) => setUsernameRegister(e.target.value)}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={passwordRegister}
          onChange={(e) => setPasswordRegister(e.target.value)}
          required
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default LoginRegisterForm;
