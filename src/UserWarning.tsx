import React, { useState } from 'react';

export const UserWarning: React.FC = () => {
  const [userId, setUserId] = useState('');

  const handleSave = () => {
    const id = Number(userId);

    if (!isNaN(id) && id > 0) {
      localStorage.setItem('user', JSON.stringify({ id }));
      alert('User ID збережено!');
      window.location.reload(); // Щоб перезапустити додаток із новим userId
    } else {
      alert('Будь ласка, введіть дійсний числовий ID.');
    }
  };

  return (
    <section className="section">
      <p className="box is-size-3">
        Please get your <b> userId </b>{' '}
        <a href="https://mate-academy.github.io/react_student-registration">
          here
        </a>{' '}
        and save it in the app{' '}
        <pre>
          const USER_ID ={' '}
          <input
            type="number"
            value={userId}
            onChange={e => setUserId(e.target.value)}
            className="input mb-2"
            placeholder="Ваш userId"
          />
          <button onClick={handleSave}>Зберегти userId</button>
        </pre>
        All requests to the API must be sent with this
        <b> userId.</b>
      </p>
    </section>
  );
};
