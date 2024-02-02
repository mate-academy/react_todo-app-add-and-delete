/* eslint-disable max-len */

import { createContext } from 'react';
import { TodoContextProps } from './types/interfaces';

export const TodoContext = createContext<TodoContextProps | undefined>(undefined);
