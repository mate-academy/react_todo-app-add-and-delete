import { useContext } from 'react';
import { TodoContext } from '../TodoContext/TodoContext';

export const useTodos = () => useContext(TodoContext);
