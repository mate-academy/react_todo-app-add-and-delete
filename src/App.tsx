import React, { useEffect, useState } from 'react';
import { TodoApp } from './components/TodoApp';
import { TodosContext } from './context/TodosContext';
import { USER_ID } from './variables';
import { getTodos } from './api/todos';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    getTodos(USER_ID)
      .then((fetchTodos) => setTodos(fetchTodos))
      .catch(() => {
        setErrorMsg('Unable to fetch todos');

        return [] as Todo[];
      });
  }, []);

  return (
    <TodosContext.Provider value={[todos, setTodos, errorMsg, setErrorMsg]}>
      <TodoApp />
    </TodosContext.Provider>
  );
};
