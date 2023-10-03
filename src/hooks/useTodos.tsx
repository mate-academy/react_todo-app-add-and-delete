import React from 'react';
import { TodosContext } from '../TodosContext/TodosContext';

export const useTodos = () => React.useContext(TodosContext);
