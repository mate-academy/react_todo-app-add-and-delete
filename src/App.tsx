/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect } from 'react';

import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { TempTodo } from './components/TempTodo/TempTodo';
import { Footer } from './components/Footer/Fotter';
import { Error } from './components/Error/Erros';
import { getTodos, addTodo, deleteTodo } from './api/todos';

import { Todo } from './types/Todo';
import { TodoStatus } from './types/Status';

function filterTodos(todos: Todo[], status: TodoStatus) {
  const todosCopy = [...todos];

  switch (status) {
    case TodoStatus.active:
      return todosCopy.filter(todo => !todo.completed);
    case TodoStatus.completed:
      return todosCopy.filter(todo => todo.completed);
    case TodoStatus.all:
      return todosCopy;
  }
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [status, setStatus] = useState<TodoStatus>(TodoStatus.all);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deleteIds, setDeletedIds] = useState<number[]>([]);
  const noTodos = todos.length === 0;
  const filteredTodos = filterTodos(todos, status);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage('Unable to load todos'));
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const normalizeTitle = title.trim();

    if (!normalizeTitle) {
      setErrorMessage('Title should not be empty');

      return;
    }

    setLoading(true);
    const newTodo = {
      userId: 2042,
      title: normalizeTitle,
      completed: false,
    };

    setTempTodo({
      id: 0,
      ...newTodo,
    });

    addTodo(newTodo)
      .then(response => {
        setTitle('');
        setTodos(existing => [...existing, response]);
      })
      .catch(() => setErrorMessage('Unable to add a todo'))
      .finally(() => {
        setLoading(false);
        setTempTodo(null);
      });
  };

  const handleDeleteOneTodo = (id: number) => {
    setLoading(true);
    setDeletedIds(existing => [...existing, id]);
    deleteTodo(id)
      .then(() => {
        setTodos(existing => existing.filter(current => current.id !== id));
      })
      .catch(() => setErrorMessage('Unable to delete a todo'))
      .finally(() => {
        setLoading(false);
        setDeletedIds([]);
      });
  };

  const handleDeleteCompletedTodos = () => {
    todos.forEach(todo => {
      if (todo.completed) {
        setLoading(true);
        setDeletedIds(existing => [...existing, todo.id]);
        deleteTodo(todo.id)
          .then(() =>
            setTodos(existing =>
              existing.filter(current => current.id !== todo.id),
            ),
          )
          .catch(() => setErrorMessage('Unable to delete a todo'))
          .finally(() => {
            setLoading(false);
            setDeletedIds(existing => existing.filter(id => id !== todo.id));
          });
      }
    });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          noTodos={noTodos}
          onSubmit={handleSubmit}
          loading={loading}
          title={title}
          onTitleChange={value => setTitle(value)}
        />

        <TodoList
          filteredTodos={filteredTodos}
          onDelete={handleDeleteOneTodo}
          loading={loading}
          deleteIds={deleteIds}
        />

        {tempTodo && <TempTodo todo={tempTodo} />}

        {!noTodos && (
          <Footer
            todos={todos}
            status={status}
            onStatusChange={(value: TodoStatus) => setStatus(value)}
            clearCompletedTodos={handleDeleteCompletedTodos}
          />
        )}
      </div>

      <Error errorMessage={errorMessage} hideError={setErrorMessage} />
    </div>
  );
};
