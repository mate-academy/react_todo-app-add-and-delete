import React, { useEffect, useState } from 'react';
import { UserWarning } from './components/UserWarning';
import {
  getTodosFromServer,
  addTodoOnServer,
  deleteTodoOnServer,
} from './api/todos';

import { TodoHeader } from './components/TodoHeader';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import { ErrorNotification } from './components/ErrorNotification';

import { TodoCompletionType } from './types/TodoCompletionType';
import { ErrorType } from './types/ErrorType';
import { TodoRich } from './types/TodoRich';

import { filterTodos, getActiveTodosCount } from './common/helpers';
import { Todo } from './types/Todo';

const USER_ID = 6955;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<TodoRich[]>([]);
  const [error, setError] = useState<ErrorType>(ErrorType.None);
  const [selectedFilterOption, setSelectedFilterOption]
    = useState(TodoCompletionType.All);

  const [tempTodo, setTempTodo] = useState<TodoRich | null>(null);

  const setLoadingTodo = (todoId: number, isLoading: boolean): void => (
    setTodos(prevTodos => (
      prevTodos.map(todo => {
        if (todo.id !== todoId) {
          return todo;
        }

        return {
          ...todo,
          isLoading,
        };
      })
    ))
  );

  const addTodo = (newTodo: Todo): void => {
    setTodos((prevTodos) => (
      [
        ...prevTodos,
        {
          ...newTodo,
          isLoading: false,
        },
      ]
    ));
  };

  const deleteTodo = (todoId: number): void => {
    setTodos(prevTodos => (
      prevTodos.filter(todo => todo.id !== todoId)
    ));
  };

  const handleTodoAdd = async (todoTitle: string): Promise<void> => {
    if (todoTitle === '') {
      setError(ErrorType.EmptyTitle);

      return;
    }

    const newTodo: TodoRich = {
      id: 0,
      title: todoTitle,
      completed: false,
      userId: USER_ID,
      isLoading: true,
    };

    setTempTodo(newTodo);

    try {
      const newTodoFromServer = await addTodoOnServer(USER_ID, newTodo);

      addTodo(newTodoFromServer);
    } catch {
      setError(ErrorType.AddTodo);
    } finally {
      setTempTodo(null);
    }
  };

  const handleTodoDelete = async (todoId: number): Promise<void> => {
    setLoadingTodo(todoId, true);

    try {
      await deleteTodoOnServer(USER_ID, todoId);
      deleteTodo(todoId);
    } catch {
      setError(ErrorType.DeleteTodo);
      setLoadingTodo(todoId, false);
    }
  };

  const handleCompletedTodosDelete = async (): Promise<void> => {
    const completedTodos = todos.filter(todo => todo.completed);

    await Promise.all(
      completedTodos.map(todo => handleTodoDelete(todo.id)),
    );
  };

  useEffect(() => {
    getTodosFromServer(USER_ID)
      .then(todosFromServer => setTodos(
        todosFromServer.map(todo => (
          {
            ...todo,
            isLoading: false,
          }
        )),
      ))
      .catch(() => setError(ErrorType.LoadTodos));
  }, []);

  const filteredTodos = filterTodos(todos, selectedFilterOption);

  const activeTodosCount = getActiveTodosCount(todos);
  const hasCompletedTodos = activeTodosCount !== todos.length;

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader onTodoAdd={handleTodoAdd} />

        {todos.length > 0 && (
          <>
            <TodoList
              todos={filteredTodos}
              tempTodo={tempTodo}
              onTodoDelete={handleTodoDelete}
            />

            <TodoFooter
              selectedFilterOption={selectedFilterOption}
              onFilterSelect={setSelectedFilterOption}
              activeTodosCount={activeTodosCount}
              hasCompletedTodos={hasCompletedTodos}
              onCompletedTodosDelete={handleCompletedTodosDelete}
            />
          </>
        )}
      </div>

      <ErrorNotification
        error={error}
        onClose={() => setError(ErrorType.None)}
      />
    </div>
  );
};
