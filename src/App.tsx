import React, { useEffect, useState } from 'react';
import { TodoHeader } from './components/TodoHeader';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import classNames from 'classnames';
import { Todo } from './types/Todo';
import * as todosService from './api/todos';
import { ErrorTypes } from './types/ErrorTypes';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todosToDisplay, setTodosToDisplay] = useState<Todo[]>([]);

  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingTodoIds, setDeletingTodoIds] = useState<number[]>([]);

  const [errorMessage, setErrorMessage] = useState<ErrorTypes | null>(null);

  async function loadTodos() {
    try {
      const currentTodos = await todosService.getTodos();

      setTodos(currentTodos);
      setTodosToDisplay(currentTodos);
    } catch (error) {
      setErrorMessage('Unable to load todos');

      throw error;
    }
  }

  async function addTodo({ userId, title, completed }: Omit<Todo, 'id'>) {
    setErrorMessage(null);
    setTempTodo({ id: 0, userId, title, completed });

    try {
      const response = await todosService.addTodos({
        userId,
        title,
        completed,
      });

      setTodosToDisplay(currentTodos => [...currentTodos, response]);
      setTodos(currentTodos => [...currentTodos, response]);
    } catch (error) {
      setErrorMessage('Unable to add a todo');

      throw error;
    } finally {
      setTempTodo(null);
    }
  }

  async function deleteTodo(todoId: number) {
    setErrorMessage(null);
    setDeletingTodoIds(ids => [...ids, todoId]);

    try {
      await todosService.deleteTodo(todoId);

      setTodos(current => current.filter(todo => todo.id !== todoId));
      setTodosToDisplay(current => current.filter(todo => todo.id !== todoId));
    } catch (error) {
      setErrorMessage('Unable to delete a todo');
    } finally {
      setDeletingTodoIds(ids => ids.filter(id => id !== todoId));
    }
  }

  useEffect(() => {
    loadTodos();
  }, []);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(null), 3000);

      return () => clearTimeout(timer);
    }

    return;
  }, [errorMessage]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          onSetTitleError={setErrorMessage}
          todos={todos}
          onSubmit={addTodo}
        />

        <TodoList
          todos={todosToDisplay}
          tempTodo={tempTodo}
          onDelete={deleteTodo}
          deletingTodoIds={deletingTodoIds}
        />

        {todos.length > 0 && (
          <TodoFooter
            todos={todos}
            setTodosToDisplay={setTodosToDisplay}
            onDelete={deleteTodo}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !errorMessage },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage(null)}
        />
        {errorMessage}
      </div>
    </div>
  );
};
