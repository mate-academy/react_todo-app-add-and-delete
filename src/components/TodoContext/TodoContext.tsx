import React, { useMemo, useState } from 'react';
import { Todo } from '../../types/Todo';
import { StateFilter } from '../../types/StateFilter';
import { Context } from '../../types/Context';

export const TodoContext = React.createContext<(Context)>({
  todos: [],
  setTodos: () => { },
  selectedState: StateFilter.All,
  setSelectedState: () => { },
});

type Props = {
  children: React.ReactNode,
};

export const TodoProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedState, setSelectedState] = useState(StateFilter.All);

  const value = useMemo(() => ({
    todos,
    setTodos,
    selectedState,
    setSelectedState,
  }), [todos, selectedState]);

  return (
    <TodoContext.Provider value={value}>
      {children}
    </TodoContext.Provider>
  );
};
