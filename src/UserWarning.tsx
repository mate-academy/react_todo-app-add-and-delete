import React, { useState } from 'react';

interface Props {
  onLogin: (email: string) => void;
}

export const UserWarning: React.FC<Props> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      return;
    }

    setIsLoading(true);

    // Simulate login by storing user email
    const user = { email: trimmedEmail };

    // Store user and proceed with login
    localStorage.setItem('user', JSON.stringify(user));
    onLogin(trimmedEmail);
    setIsLoading(false);
  };

  return (
    <section className="section">
      <div className="box">
        <h1 className="title">Todo App</h1>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="email" className="label">
              Email
            </label>
            <div className="control">
              <input
                id="email"
                autoFocus
                className="input"
                disabled={isLoading}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                type="email"
                value={email}
              />
            </div>
          </div>
          <div className="field is-grouped">
            <div className="control">
              <button
                className="button is-link"
                disabled={isLoading || !email.trim()}
                type="submit"
              >
                {isLoading ? 'Loading...' : 'Login'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};
