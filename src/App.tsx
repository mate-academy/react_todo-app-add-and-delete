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
  const [isLoadingTodoIds, setIsLoadingTodoIds] = useState<number[]>([]);
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
    setErrorMessage(TodoError.none);

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
    setErrorMessage(TodoError.none);

    const newTodo: Todo = {
      id: 0,
      title: title.trim(),
      completed: false,
      userId: todoService.USER_ID,
    };

    setTempTodo(newTodo);

    return todoService
      .addTodo(newTodo)
      .then((createdTodo) => {
        setTodos((currentTodos) => [...currentTodos, createdTodo]);
      })
      .catch((error) => {
        setErrorMessage(TodoError.add);
        throw error;
      })
      .finally(() => {
        setTempTodo(null);
      });
  };

  const handleDeleteTodo = (todoId: number) => {
    setErrorMessage(TodoError.none);

    setIsLoadingTodoIds(prev => [...prev, todoId]);

    todoService.deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
      })
      .catch(() => setErrorMessage(TodoError.delete))
      .finally(() => {
        setIsLoadingTodoIds([]);
      });
  };

  const handleDeleteCompletedTodo = async () => {
    const completedIds = todos.filter(todo => todo.completed)
      .map(todo => todo.id);

    try {
      await Promise.all(
        completedIds.map(id => handleDeleteTodo(id)),
      );
    } catch (error) {
      setErrorMessage(TodoError.delete);
    }
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
          isLoadingTodoIds={isLoadingTodoIds}
          tempTodo={tempTodo}
        />

        <TodoFooter
          countActiveTodos={countActiveTodos}
          hasCompletedTodos={hasCompletedTodos}
          filter={filter}
          onFilterChange={setFilter}
          onClearCompleted={handleDeleteCompletedTodo}
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
