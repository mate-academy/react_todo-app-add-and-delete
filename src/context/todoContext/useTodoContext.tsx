import { useContext } from 'react';
import { TodoContext } from './todoContext';

export const useTodoContext = () => useContext(TodoContext);
