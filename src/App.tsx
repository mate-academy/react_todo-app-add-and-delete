import React, { useEffect, useMemo, useState } from 'react';

import * as todosService from './api/todos';
import { UserWarning } from './UserWarning';
import { DELAY, USER_ID } from './constans';
import { getTodosByOptions } from './services/todos';

import { TodoList } from './components/TodoList';
import { TodoFilter } from './components/TodoFilter';
import { ErrorMessage } from './components/ErrorMessage';
import { TodoForm } from './components/TodoForm';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  /* eslint-disable react-hooks/rules-of-hooks */
  if (!USER_ID) {
    return <UserWarning />;
  }

  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [option, setOption] = useState('All');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [deletedTodosId, setDeletedTodosId] = useState<number[] | null>(null);

  const newError = (error: string) => {
    setErrorMessage(error);
    setTimeout(() => setErrorMessage(''), DELAY);
  };

  function loadTodos() {
    setErrorMessage('');

    todosService
      .getTodos()
      .then(setTodos)
      .catch(() => newError('Unable to load todos'));
  }

  useEffect(loadTodos, []);

  function addTodo({ userId, completed, title }: Todo) {
    setErrorMessage('');

    return todosService
      .creatTodo({ userId, completed, title })
      .then(newTodo => setTodos(currentTodos => [...currentTodos, newTodo]))
      .catch(error => {
        newError('Unable to add a todo');

        throw error;
      })
      .finally(() => setTempTodo(null));
  }

  function deletedTodo(todosId: number[]) {
    setErrorMessage('');
    setLoading(true);
    setDeletedTodosId(todosId);

    const deletedTodos = todosId.map(id =>
      todosService
        .deleteTodo(id)
        .then(() =>
          setTodos(currentTodo => currentTodo.filter(todo => todo.id !== id)),
        )
        .catch(error => {
          newError('Unable to delete a todo');

          throw error;
        }),
    );

    Promise.allSettled([...deletedTodos]).finally(() => {
      setLoading(false);
      setDeletedTodosId(null);
    });
  }

  const todosByOption = useMemo(
    () => getTodosByOptions(option, todos),
    [option, todos],
  );

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoForm
          addTodo={addTodo}
          newError={newError}
          onTempTodo={setTempTodo}
          loading={loading}
          onLoading={setLoading}
          todos={todos}
        />

        {!!todos.length && (
          <>
            <TodoList
              todos={todosByOption}
              onSelect={setSelectedTodo}
              selectedId={selectedTodo?.id}
              tempTodo={tempTodo}
              onDelete={deletedTodo}
              loading={loading}
              deletedTodosId={deletedTodosId}
            />

            <TodoFilter
              todos={todos}
              option={option}
              onOption={setOption}
              onDelete={deletedTodo}
            />
          </>
        )}
      </div>

      <ErrorMessage
        errorMessage={errorMessage}
        onErrorMessage={setErrorMessage}
      />
    </div>
  );
};
