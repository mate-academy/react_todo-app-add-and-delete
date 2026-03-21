import React from 'react';
import { TodoContextType } from '../types/Todo';

export const TodoContext = React.createContext<TodoContextType | undefined>(
  undefined,
);
