import React from 'react';

const INITIAL_STATE = {
  isDeleting: false,
  deletedId: -1,
};

export const DeleteContext = React.createContext(INITIAL_STATE);
