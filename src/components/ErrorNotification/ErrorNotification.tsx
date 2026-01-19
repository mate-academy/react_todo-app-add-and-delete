import React from 'react';

type Props = {
  messages: string[];
  hidden?: boolean;
  onClose: () => void;
};

export const ErrorNotification: React.FC<Props> = ({
  messages,
  hidden = true,
  onClose,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={`notification is-danger is-light has-text-weight-normal ${hidden ? 'hidden' : ''}`}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={onClose}
      />
      {messages.map((message, index) => (
        <React.Fragment key={index}>
          {message}
          <br />
        </React.Fragment>
      ))}
    </div>
  );
};
