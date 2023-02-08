/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { Errors } from './components/Errors';
import { TodoContent } from './components/TodoContent';
import { UserWarning } from './UserWarning';
import { getTodos, addTodo } from './api/todos';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';

const USER_ID = 6232;

// create().then((response) => console.log(response));

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
  const [error, setError] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isInputDisabled, setIsInputDisabled] = useState(false);

  const filterTodos = (filterBy: Filter) => {
    if (filterBy === Filter.active) {
      setFilteredTodos(todos.filter((todo) => todo.completed === false));
    } else if (filterBy === Filter.completed) {
      setFilteredTodos(todos.filter((todo) => todo.completed === true));
    } else {
      setFilteredTodos(todos);
    }
  };

  const setErrors = (e: string) => {
    setError(e);
  };

  const createTodo = async (title: string) => {
    setIsInputDisabled(true);

    const newTodo = {
      title,
      userId: USER_ID,
      completed: false,
    };

    setTempTodo({ ...newTodo, id: 0 });
    await addTodo(newTodo)
      .then((response) => {
        setTempTodo(null);

        setFilteredTodos((state) => [...state, response]);
      })
      .catch(() => {
        setErrors('Unable to add a todo');
      });

    setIsInputDisabled(false);
  };

  useEffect(() => {
    getTodos(USER_ID)
      .then((result) => {
        setTodos(result);
        setFilteredTodos(result);
      })
      .catch(() => {
        setErrors('Unable to load todos');
      });
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <TodoContent
        todos={filteredTodos}
        filterTodos={filterTodos}
        onError={setErrors}
        createTodo={createTodo}
        tempTodo={tempTodo}
        isInputDisabled={isInputDisabled}
      />

      {error !== '' && <Errors error={error} setError={setError} />}
    </div>
  );
};
