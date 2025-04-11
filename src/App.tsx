import React, { useEffect, useMemo, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import * as todoServices from './api/todos';
import { TodoForm } from './Components/TodoForm/TodoForm';
import { Footer } from './Components/Footer/Footer';
import { Filter } from './types/Filter';
import { TodoList } from './Components/TodoList/TodoList';
import classNames from 'classnames';
import { ErrorType } from './types/ErrorType';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [errorMessage, setErrorMessage] = useState<ErrorType>(
    ErrorType.DEFAULT,
  );
  const [deletingTodoId, setDeletingTodoId] = useState<number | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const activeTodos = todos.filter(todo => !todo.completed);
  const hasCompletedTodos = todos.some(todo => todo.completed);

  useEffect(() => {
    todoServices
      .getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ErrorType.LOADING);
        setTimeout(() => setErrorMessage(ErrorType.DEFAULT), 3000);
      });
  }, []);

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case Filter.Active:
        return todos.filter(todo => !todo.completed);
      case Filter.Completed:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  const addTodo = ({ id, userId, title, completed }: Todo) => {
    const newTempTodo = { id, userId, title, completed };

    setTempTodo(newTempTodo);

    return todoServices
      .createTodo({ title, userId, completed })
      .then(newTodo => setTodos(currentTodo => [...currentTodo, newTodo]))
      .catch(error => {
        setErrorMessage(ErrorType.ADD);
        throw error;
      })
      .finally(() => {
        setTempTodo(null);
      });
  };

  const deleteTodo = (todoId: number) => {
    setDeletingTodoId(todoId);

    return todoServices
      .deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodo => currentTodo.filter(todo => todo.id !== todoId));
      })
      .catch(error => {
        setErrorMessage(ErrorType.DELETE);
        throw error;
      })
      .finally(() => {
        setDeletingTodoId(null);
      });
  };

  const clearCompleted = () => {
    const todosCompletedId = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    todosCompletedId.forEach(completedTodo => deleteTodo(completedTodo));
  };

  if (!todoServices.USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoForm
          inputRef={inputRef}
          isLoading={!!tempTodo}
          setErrorMessage={setErrorMessage}
          addTodo={addTodo}
        />

        <TodoList
          todos={filteredTodos}
          onDeleteTodo={deleteTodo}
          tempTodo={tempTodo}
          isLoading={!!tempTodo}
          deletingTodoId={deletingTodoId}
        />

        {todos.length > 0 && (
          <Footer
            currentFilter={filter}
            setFilter={setFilter}
            activeTodos={activeTodos.length}
            hasCompletedTodos={hasCompletedTodos}
            clearCompleted={clearCompleted}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          { hidden: errorMessage === ErrorType.DEFAULT },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage(ErrorType.DEFAULT)}
        />
        {errorMessage}
      </div>
    </div>
  );
};
