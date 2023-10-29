/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { TodoItem } from './components/TodoItem';
import { Todo } from './types/Todo';
import * as todoService from './api/todos';
import { TodoHeader } from './components/TodoHeader';
import { StatusState } from './types/StatusState';

const USER_ID = 11613;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [errorMessage, setErrorMessage] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processingTodoIds, setIsProcessingTodoIds] = useState<number[]>([]);

  useEffect(() => {
    todoService.getTodos(USER_ID)
      .then(setTodos)
      .catch(() => setErrorMessage('Unable to load todos'));
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  }, []);

  const displayTodos = todos.filter(todo => {
    switch (statusFilter) {
      case StatusState.Active:
        return !todo.completed;
      case StatusState.Completed:
        return todo.completed;
      case StatusState.All:
      default:
        return todo;
    }
  });

  if (!USER_ID) {
    return <UserWarning />;
  }

  const addTodo = (todoTitle: string) => {
    setErrorMessage('');
    setTempTodo({
      id: 0,
      title: todoTitle,
      userId: 0,
      completed: false,
    });

    return todoService.createTodo(todoTitle)
      .then((newTodo) => {
        setTodos((currentTodos: Todo[]) => [...currentTodos, newTodo]);
      })
      .catch(() => {
        setErrorMessage('UNABLE_ADD_TODO');
        throw new Error();
      })
      .finally(() => {
        setTempTodo(null);
      });
  };

  function deleteTodo(todoId: number) {
    setIsProcessingTodoIds((prevTodoIds) => [...prevTodoIds, todoId]);
    todoService.deleteTodos(todoId)
      .then((() => {
        setTodos((prevTodos) => prevTodos.filter(todo => todo.id !== todoId));
      }))
      .catch(() => {
        setErrorMessage('UNABLE_DELETE_TODO');
      })
      .finally(() => {
        setIsProcessingTodoIds(
          (prevTodoIds) => prevTodoIds.filter(id => id !== todoId),
        );
      });
  }

  const handleClearComletedTodo = () => {
    todos
      .filter(todo => todo.completed)
      .forEach(todo => {
        deleteTodo(todo.id);
      });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          todos={todos}
          onTodoAdd={addTodo}
          onTodoAddError={setErrorMessage}
        />

        <section className="todoapp__main" data-cy="TodoList">
          {displayTodos.map(todo => (
            <TodoItem
              todo={todo}
              onTodoDelete={() => deleteTodo(todo.id)}
              isProcessing={processingTodoIds.includes(todo.id)}
              key={todo.id}
            />
          ))}

          {tempTodo && (
            <TodoItem
              todo={tempTodo}
              isProcessing
            />
          )}
        </section>

        {todos.length > 0 && (
          <footer className="todoapp__footer">
            <span className="todo-count">
              {todos.filter(todo => !todo.completed).length}
              {' '}
              items left
            </span>

            <nav className="filter">
              <a
                href="#/"
                className={`filter__link ${statusFilter === 'all' ? 'selected' : ''}`}
                onClick={() => setStatusFilter('all')}
              >
                All
              </a>

              <a
                href="#/active"
                className={`filter__link ${statusFilter === 'active' ? 'selected' : ''}`}
                onClick={() => setStatusFilter('active')}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={`filter__link ${statusFilter === 'completed' ? 'selected' : ''}`}
                onClick={() => setStatusFilter('completed')}
              >
                Completed
              </a>
            </nav>

            <button
              type="button"
              className="todoapp__clear-completed"
              onClick={handleClearComletedTodo}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <div className={`notification is-danger is-light has-text-weight-normal
  ${!errorMessage && 'hidden'}`}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />

        {errorMessage}

      </div>
    </div>
  );
};
