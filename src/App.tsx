/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect } from 'react';
import { USER_ID } from './utils/constans';
import { TodoApp } from './components/TodoApp';
import { TodosContext } from './context/TodoContext';
import { Todo } from './types/Todo';
import { getTodos } from './api/todos';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    getTodos(USER_ID)
      .then((data) => setTodos(data))
      .catch(() => {
        setErrorMsg('Unable to fetch todos');
      });
  }, []);

  return (
    <TodosContext.Provider value={[todos, setTodos, errorMsg, setErrorMsg]}>
      <TodoApp />
    </TodosContext.Provider>
  );
};
