/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';

import * as todoService from './api/todos';
import { getFilteredTodos } from './utils/getFilteredTodo';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { FilterStatus } from './types/FilterStatus';
import { TodoError } from './types/TodoError';
import {
  Header,
  TodoErrors,
  TodoFooter,
  TodoList,
} from './components';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterStatus>(FilterStatus.ALL);
  const [errorMessage, setErrorMessage] = useState(TodoError.none);
  const [isLoadingTodoId, setIsLoadingTodoId] = useState<number | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const filteredTodos = useMemo(() => {
    return getFilteredTodos(todos, filter);
  }, [todos, filter]);

  const countActiveTodos = useMemo(() => {
    return todos.filter((todo) => !todo.completed).length;
  }, [todos]);

  const hasCompletedTodos = useMemo(() => {
    return todos.some((todo) => todo.completed);
  }, [todos]);

  useEffect(() => {
    todoService.getTodos(todoService.USER_ID)
      .then(setTodos)
      .catch(() => setErrorMessage(TodoError.load));
  }, []);

  if (!todoService.USER_ID) {
    return <UserWarning />;
  }

  const handleToggleCompleted = (todoId: number) => {
    setTodos((curentTodos) => (
      curentTodos.map(todo => (
        todo.id === todoId
          ? { ...todo, completed: !todo.completed }
          : todo
      ))));
  };

  const handleAllToggle = () => {
    const isEveryCompleted = todos.every(
      todo => todo.completed,
    );

    setTodos((prevTodos) => (
      prevTodos.map(todo => {
        return { ...todo, completed: !isEveryCompleted };
      })));
  };

  const handleAddTodo = (title: string) => {
    const newTodo: Todo = {
      id: 0,
      title: title.trim(),
      completed: false,
      userId: todoService.USER_ID,
    };

    setTempTodo(newTodo);

    todoService
      .addTodo(newTodo)
      .then((createdTodo) => {
        setTodos((currentTodos) => [...currentTodos, createdTodo]);
      })
      .catch(() => setErrorMessage(TodoError.add))
      .finally(() => {
        setErrorMessage(TodoError.none);
        setTempTodo(null);
      });
  };

  const handleDeleteTodo = (todoId: number) => {
    setIsLoadingTodoId(todoId);

    todoService.deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
      })
      .catch(() => setErrorMessage(TodoError.delete))
      .finally(() => {
        setErrorMessage(TodoError.none);
        setIsLoadingTodoId(null);
      });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          countActiveTodos={countActiveTodos}
          onError={setErrorMessage}
          handleAddTodo={handleAddTodo}
          tempTodo={tempTodo}
          handleAllToggle={handleAllToggle}
        />

        <TodoList
          todos={filteredTodos}
          handleToggleCompleted={handleToggleCompleted}
          handleDeleteTodo={handleDeleteTodo}
          isLoadingTodoId={isLoadingTodoId}
          tempTodo={tempTodo}
        />

        <TodoFooter
          countActiveTodos={countActiveTodos}
          hasCompletedTodos={hasCompletedTodos}
          filter={filter}
          onFilterChange={setFilter}
        />

        {errorMessage !== TodoError.none && (
          <TodoErrors
            errorMessage={errorMessage}
            onChangeError={setErrorMessage}
          />
        )}
      </div>
    </div>
  );
};
