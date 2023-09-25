/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect, useMemo } from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import { TodoFilterBar } from './components/TodoFilter';
import { TodoErrors } from './components/TodoErrors';
import { Todo } from './types/Todo';
import { FilterParams } from './types/FilteredParams';
import { TodoForm } from './components/TodoForm';
import { TodoList } from './components/TodoList';
import {
  addTodo,
  getTodos,
  deleteTodo,
  patchTodoStatus,
  patchTodoTitle,
} from './api/todos';
import { USER_ID } from './utils/userId';
import { getPreperedTodos } from './utils/getPreparedTodos';
import { TodoItem } from './components/TodoItem';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[] | []>([]);
  const [filter, setFilter] = useState(FilterParams.all);
  const [errorMessage, setErrorMessage] = useState('');
  const [loaderId, setLoaderId] = useState<number[]>([]);
  const [todoTitle, setTodoTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [newTodoTitle, setNewTodoTitle] = useState('');

  const unSetError = () => {
    setErrorMessage('');
  };

  const preparedTodos = useMemo(() => {
    return getPreperedTodos(todos, filter);
  }, [todos, filter]);

  const checkTodo = todos.length > 0;

  const removeTodo = async (todoId: number) => {
    try {
      await deleteTodo(todoId);
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
    } catch (error) {
      setTodos(todos);
      setErrorMessage('Unable to delete a todo');
    }
  };

  const setClearCompletedTodo = () => {
    const completedTodo = todos.filter(todo => todo.completed);

    completedTodo.forEach(todo => {
      setLoaderId(prevIds => [...prevIds, todo.id]);

      removeTodo(todo.id)
        .finally(() => setLoaderId([]));
    });
  };

  const createTodo = async () => {
    if (!todoTitle) {
      setErrorMessage('Title shouldn`t be empty');

      return;
    }

    setTempTodo({
      id: 0,
      title: todoTitle,
      completed: false,
      userId: USER_ID,
    });

    try {
      const newTodo = await addTodo({
        title: todoTitle,
        completed: false,
        userId: USER_ID,
      });

      setTodos(prevTodos => [...prevTodos, newTodo]);
    } catch (error) {
      setErrorMessage('Unable to add todo');
    } finally {
      setTempTodo(null);
    }
  };

  const updateTodoStatus = async (todoId: number) => {
    try {
      const switchedTodo = todos.find(t => t.id === todoId);

      await patchTodoStatus(todoId, { completed: !switchedTodo?.completed });
      setTodos(prevTodos => {
        return prevTodos.map(todo => {
          return todo.id === todoId
            ? { ...todo, completed: !todo.completed } : todo;
        });
      });
    } catch (error) {
      setErrorMessage('Unable to update todo');
    }
  };

  const updateTodoTitle = async (todoId: number) => {
    try {
      const changedTodo = todos.find(t => t.id === todoId);

      await patchTodoTitle(todoId, { title: newTodoTitle });
      if (changedTodo) {
        setTodos(prevTodos => prevTodos.map(todo => {
          if (todo.id === todoId) {
            return { ...todo, title: newTodoTitle };
          }

          return todo;
        }));
      }
    } catch (error) {
      setErrorMessage('Unable to update todo');
      throw error;
    }
  };

  useEffect(() => {
    setErrorMessage('');

    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to get todos');
      });
  }, []);

  const toggleAll = () => {
    const todosToUpdate = todos.every(todo => todo.completed)
      ? todos.filter(todo => todo.completed)
      : todos.filter(todo => !todo.completed);

    todosToUpdate.forEach(todo => {
      setLoaderId(prevIds => [...prevIds, todo.id]);
      updateTodoStatus(todo.id)
        .finally(() => setLoaderId([]));
    });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <header className="todoapp__header">
        {checkTodo && (
          <button
            type="button"
            className={classNames('todoapp__toggle-all', {
              active: todos.every(todo => todo.completed),
            })}
            onClick={toggleAll}
          />
        )}

        <TodoForm
          todoTitle={todoTitle}
          onTodoCreate={setTodoTitle}
          createTodo={createTodo}
        />
      </header>

      <div className="todoapp__content">
        {checkTodo && (
          <TodoList
            todos={preparedTodos}
            removeTodo={removeTodo}
            loaderId={loaderId}
            updateTodo={updateTodoStatus}
            updateTodoTitle={updateTodoTitle}
            switchTodoTitle={setNewTodoTitle}
            newTodoTitle={newTodoTitle}
          />
        )}

        {tempTodo && (
          <TodoItem
            todo={tempTodo}
            removeTodo={removeTodo}
            updateTodo={updateTodoStatus}
            updateTodoTitle={updateTodoTitle}
            switchTodoTitle={setNewTodoTitle}
            newTodoTitle={newTodoTitle}
            loaderId={[tempTodo.id]}
          />
        )}

        {checkTodo && (
          <TodoFilterBar
            filter={filter}
            setFilter={setFilter}
            setClearCompletedTodo={setClearCompletedTodo}
            todos={todos}
          />
        )}
      </div>

      <TodoErrors
        error={errorMessage}
        unSetError={unSetError}
      />
    </div>
  );
};
