/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';

import * as todoService from './api/todos';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import { TodoList } from './components/TodoList';
import { NotificationHandler } from './components/NotificationHandler';
import { getFilteredTodos } from './services/filteredTodos';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { wait } from './utils/fetchClient';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState(Filter.ALL);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processedId, setProcessedId] = useState(0);

  useEffect(() => {
    wait(3000).then(() => setErrorMessage(''));
  }, [errorMessage]);

  useEffect(() => {
    todoService
      .getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage('Unable to load todos'));
  }, []);

  const resetSubmit = () => {
    setLoading(false);
    setTempTodo(null);
  };

  const resetDelete = () => {
    setLoading(false);
    setProcessedId(0);
  };

  const createTodo = ({ title, completed, userId }: Omit<Todo, 'id'>) => {
    setErrorMessage('');
    setLoading(true);
    setTempTodo({
      id: 0,
      title,
      completed,
      userId,
    });

    return todoService
      .createTodo({ title, completed, userId })
      .then(newTodo => setTodos(currentTodos => [...currentTodos, newTodo]))
      .catch(error => {
        setErrorMessage('Unable to add a todo');
        throw new Error(`${error.status}: ${error.message}`);
      })
      .finally(resetSubmit);
  };

  const deleteTodo = (todoId: number) => {
    setLoading(true);
    setProcessedId(todoId);

    todoService
      .deleteTodo(todoId)
      .then(() =>
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        ),
      )
      .catch(error => {
        setErrorMessage('Unable to delete a todo');
        throw new Error(`${error.status}: ${error.message}`);
      })
      .finally(resetDelete);
  };

  const filteredTodos = getFilteredTodos(todos, filter);
  const hasEveryCompletedTodo = todos.every(({ completed }) => completed);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          hasEveryCompletedTodo={hasEveryCompletedTodo}
          onSubmit={createTodo}
          setErrorMessage={setErrorMessage}
          loading={loading}
        />

        <TodoList
          todos={filteredTodos}
          onDelete={deleteTodo}
          processedId={processedId}
          tempTodo={tempTodo}
        />

        {!!todos.length && (
          <Footer
            todos={todos}
            currentFilter={filter}
            setFilter={setFilter}
            onDelete={deleteTodo}
          />
        )}
      </div>

      <NotificationHandler errorMessage={errorMessage} />
    </div>
  );
};
