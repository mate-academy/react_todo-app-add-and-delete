import React from 'react';

import { TodosContext } from '../context/TodosContext';
import { State } from '../types';

export const useTodos = () => React.useContext<State>(TodosContext);
