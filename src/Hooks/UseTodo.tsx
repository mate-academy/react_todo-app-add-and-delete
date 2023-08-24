import React from 'react';
import { TodosContext } from '../types/TodosContext';
import { TodoContext } from '../Components/TodosContext';

export const useTodo = (): TodosContext => React.useContext(TodoContext);
