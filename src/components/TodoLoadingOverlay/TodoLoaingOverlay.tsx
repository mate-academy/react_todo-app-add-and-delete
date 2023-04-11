import React from 'react';

export const TodoLoadingOverlay: React.FC = () => {
  return (
    <>
      {/* 'is-active' class puts this modal on top of the todo */}
      <div className="modal overlay is-active">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </>
  );
};
