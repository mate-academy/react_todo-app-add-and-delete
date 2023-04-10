import React from 'react';

export const TodoEditForm: React.FC = () => {
  return (
    <>
      {/* This form is shown instead of the title and remove button */}
      <form>
        <input
          type="text"
          className="todo__title-field"
          placeholder="Empty todo will be deleted"
          value="Todo is being edited now"
        />
      </form>
    </>
  );
};
