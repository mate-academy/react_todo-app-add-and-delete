/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import React, {
  useEffect, useMemo, useState,
} from 'react';
import * as todoService from './api/todos';
import { ErrorNotification } from './components/TodoError';
import { TodoFilter } from './components/TodoFilter';
import { TodoForm } from './components/TodoForm';
import { TodoList } from './components/TodoList';
import { Error } from './types/Error';
import { Filter } from './types/Filter';
import { Todo } from './types/Todo';
import { UserWarning } from './UserWarning';
import { USER_ID } from './utils/constant';
import { getVisibleTodos } from './utils/getVisibleTodos';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<Error>(Error.none);
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [deletedTodos, setDeletedTodos] = useState<number[]>([]);

  const visibleTodos = useMemo(() => (
    getVisibleTodos(todos, filter)
  ), [todos, filter]);

  useEffect(() => {
    todoService.getTodos(USER_ID)
      .then(setTodos)
      .catch(() => setErrorMessage(Error.load));
  }, []);

  const numberOfActiveTodos = useMemo(() => (
    todos.filter(todo => !todo.completed).length
  ), [todos]);

  const hasActiveTodos = useMemo(() => (
    todos.some(todo => !todo.completed)
  ), [todos]);

  const completedTodos = useMemo(() => (
    todos.filter(todo => todo.completed)
  ), [todos]);

  const deleteTodo = (todoId: number) => {
    setIsProcessing(true);
    deletedTodos.push(todoId);

    return todoService.removeTodo(todoId)
      .then(() => setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId)))
      .catch(() => {
        setErrorMessage(Error.delete);
      }).finally(() => {
        setDeletedTodos([]);
        setIsProcessing(false);
      });
  };

  const deleteCompletedTodos = () => {
    completedTodos.forEach(completedTodo => {
      deleteTodo(completedTodo.id);
    });
  };

  const addTodo = ({ title, userId, completed }: Todo) => {
    setErrorMessage(Error.none);

    return todoService.createTodo({ title, userId, completed })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
      })
      .catch(() => {
        setErrorMessage(Error.add);
      });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {numberOfActiveTodos > 0 && (
            <button
              type="button"
              className={classNames('todoapp__toggle-all', {
                active: hasActiveTodos,
              })}
            />
          )}

          <TodoForm
            addTodo={addTodo}
            setErrorMessage={setErrorMessage}
            setTempTodo={setTempTodo}
          />
        </header>

        {numberOfActiveTodos > 0 && (
          <TodoList
            todos={visibleTodos}
            deleteTodo={deleteTodo}
            isProcessing={isProcessing}
            deletedTodos={deletedTodos}
          />
        )}

        {tempTodo && (
          <div className="todo">
            <label className="todo__status-label">
              <input type="checkbox" className="todo__status" />
            </label>

            <span className="todo__title">{tempTodo?.title}</span>
            <button type="button" className="todo__remove">×</button>

            <div
              className={classNames('modal overlay', {
                'is-active': tempTodo,
              })}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        )}

        {numberOfActiveTodos > 0 && (
          <footer className="todoapp__footer">
            <span className="todo-count">
              {numberOfActiveTodos === 1 ? (
                `${numberOfActiveTodos} item left`
              ) : (
                `${numberOfActiveTodos} items left`
              )}
            </span>

            <TodoFilter
              filter={filter}
              setFilter={setFilter}
            />

            <button
              type="button"
              className="todoapp__clear-completed"
              onClick={deleteCompletedTodos}
            >
              {completedTodos.length > 0 && (
                'Clear completed'
              )}
            </button>

          </footer>
        )}
      </div>

      {errorMessage && (
        <ErrorNotification
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
        />
      )}
    </div>
  );
};
