/* eslint-disable no-lone-blocks */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';

{
  /* Add the 'hidden' class to hide the message smoothly */
}

export const ErrorNotifications: React.FC = () => {
  return (
    <div className="notification is-danger is-light has-text-weight-normal">
      <button type="button" className="delete" />
      {/* show only one message at a time */}
      Unable to add a todo
      <br />
      Unable to delete a todo
      <br />
      Unable to update a todo
    </div>
  );
};
