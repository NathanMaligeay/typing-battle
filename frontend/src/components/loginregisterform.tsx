<<<<<<< HEAD
<<<<<<< HEAD:frontend/src/components/loginregisterform.tsx
=======
>>>>>>> 25358cb7 (rewrote backend in .NET in directory /backend/csharp, move old into /backend/node)
import React, { useState } from 'react';

interface LoginRegisterFormProps {
  onLogin: (username: string, password: string) => void;
  onRegister: (username: string, password: string) => void;
  loginErrMessage: string;
  registerErrMessage: string;
}

const LoginRegisterForm: React.FC<LoginRegisterFormProps> = ({ onLogin, onRegister, loginErrMessage, registerErrMessage }) => {
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
          autoComplete="off"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={passwordLogin}
          onChange={(e) => setPasswordLogin(e.target.value)}
          required
          autoComplete="off"
        />
        <div style={{marginBottom: '5px'}}>{loginErrMessage}</div>
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
          autoComplete="off"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={passwordRegister}
          onChange={(e) => setPasswordRegister(e.target.value)}
          required
          autoComplete="off"
        />
        <div style={{marginBottom: '5px'}}>{registerErrMessage}</div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default LoginRegisterForm;
<<<<<<< HEAD
=======
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
          autoComplete="off"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={passwordLogin}
          onChange={(e) => setPasswordLogin(e.target.value)}
          required
          autoComplete="off"
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
          autoComplete="off"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={passwordRegister}
          onChange={(e) => setPasswordRegister(e.target.value)}
          required
          autoComplete="off"
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default LoginRegisterForm;
>>>>>>> 9ceb53ed (added games list fetching + some UI fix, bug discovery with useWords intervalRef todo):src/components/loginregisterform.tsx
=======
>>>>>>> 25358cb7 (rewrote backend in .NET in directory /backend/csharp, move old into /backend/node)
