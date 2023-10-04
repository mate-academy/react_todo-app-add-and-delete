import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  getTodos, addTodo, deleteTodo, updateTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { TodoHeaderProps } from './types/TodoHeader';
import { FilterType } from './types/TodoFooter';
import { TodoHeader } from './components/TodoHeader';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import { ErrorNotification } from './components/ErrorNotification';

const USER_ID = 11548;

export const filterTodos = (todos: Todo[], filter: FilterType) => {
  return todos.filter((todo) => {
    switch (filter) {
      case FilterType.All:
        return true;
      case FilterType.Active:
        return !todo.completed;
      case FilterType.Completed:
        return todo.completed;
      default:
        return true;
    }
  });
};

type SetErrorMessageType = React.Dispatch<
React.SetStateAction<string | undefined>
>;
type MessageType = string | undefined;

const handleErrorMessage = (
  setErrorMessage: SetErrorMessageType,
  message: MessageType,
) => {
  setErrorMessage(message);
  setTimeout(() => {
    setErrorMessage(undefined);
  }, 3000);
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined,
  );
  const [isLoading, setIsLoading] = useState<Record<number, boolean>>({
    0: true,
  });

  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(true);
  const [currentFilter, setCurrentFilter] = useState<FilterType>(
    FilterType.All,
  );
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isInputFocused) {
      inputRef.current?.focus();
      setIsInputFocused(false);
    }
  }, [isInputFocused]);

  useEffect(() => {
    const fetchTodos = async () => {
      setIsInputDisabled(true);
      try {
        const fetchedTodos = await getTodos(USER_ID);

        setTodos(fetchedTodos);
        setIsInputDisabled(false);
      } catch (error) {
        if (error instanceof Error) {
          handleErrorMessage(
            setErrorMessage,
            error.message || 'Unable to load todos',
          );
        } else {
          handleErrorMessage(setErrorMessage, 'Unable to load todos');
        }
      } finally {
        setIsInputFocused(true);
      }
    };

    fetchTodos();
  }, []);

  const handleNewTodoSubmit: TodoHeaderProps['handleNewTodoSubmit'] = async (
    newTitle,
    setNewTodoTitle,
  ) => {
    setIsInputDisabled(true);
    const trimmedTitle = newTitle.trim();

    if (!trimmedTitle) {
      handleErrorMessage(setErrorMessage, 'Title should not be empty');
      setIsInputDisabled(false);

      return;
    }

    const newTodo: Todo = {
      userId: USER_ID,
      id: 0,
      title: newTitle.trim(),
      completed: false,
    };

    setTempTodo(newTodo);
    try {
      const addedTodo: Todo = await addTodo(newTodo);

      setTodos((currentTodos: Todo[]) => [...currentTodos, addedTodo]);
      setNewTodoTitle('');
    } catch (error) {
      handleErrorMessage(setErrorMessage, 'Unable to add a todo');
    } finally {
      setIsInputDisabled(false);
      setIsInputFocused(true);
      setTempTodo(null);
    }
  };

  const handleTodoToggle = async (todoId: number, completed: boolean) => {
    setIsLoading({ ...isLoading, [todoId]: true });

    const originalTodos = [...todos];

    setTodos((prevTodos) => prevTodos.map((todo) => (todo.id === todoId
      ? { ...todo, completed }
      : todo)));

    try {
      await updateTodo(todoId, { completed });
    } catch (error) {
      handleErrorMessage(setErrorMessage, 'Unable to update a todo');
      setTodos(originalTodos);
    } finally {
      setIsLoading({ ...isLoading, [todoId]: false });
    }
  };

  const toggleAllTodos = async () => {
    const allCompleted = todos.every((todo) => todo.completed);
    const newStatus = !allCompleted;

    const updatePromises = todos.map((todo) => {
      if (todo.completed !== newStatus) {
        return handleTodoToggle(todo.id, newStatus);
      }

      return Promise.resolve();
    });

    try {
      await Promise.all(updatePromises);
    } catch (error) {
      handleErrorMessage(setErrorMessage, 'Unable to update all todos');
    }
  };

  const handleTodoUpdate = async (todoId: number, newTitle: string) => {
    setIsLoading({ ...isLoading, [todoId]: true });
    const originalTodos = [...todos];

    setTodos((prevTodos) => prevTodos.map((todo) => (todo.id === todoId
      ? { ...todo, title: newTitle }
      : todo)));
    try {
      await updateTodo(todoId, { title: newTitle });
    } catch (error) {
      setTodos(originalTodos);
      handleErrorMessage(setErrorMessage, 'Unable to update a todo');
    } finally {
      setIsLoading({ ...isLoading, [todoId]: false });
    }
  };

  const handleTodoDelete = async (todoId: number) => {
    setIsLoading((prevLoading) => ({ ...prevLoading, [todoId]: true }));

    try {
      await deleteTodo(todoId);
      setTodos((currentTodos) => currentTodos
        .filter((todo) => todo.id !== todoId));
    } catch (error) {
      handleErrorMessage(setErrorMessage, 'Unable to delete a todo');
    } finally {
      setIsLoading((prevLoading) => ({ ...prevLoading, [todoId]: false }));
      setIsInputFocused(true);
    }
  };

  const handleClearCompleted = async () => {
    const completedTodos = todos.filter((todo) => todo.completed);

    completedTodos.forEach(async (todo) => {
      try {
        await deleteTodo(todo.id);
        setTodos((currentTodos) => currentTodos
          .filter((currentTodo) => currentTodo.id !== todo.id));
      } catch (error) {
        handleErrorMessage(setErrorMessage, 'Unable to delete a todo');
      } finally {
        setIsInputFocused(true);
      }
    });
  };

  const filteredTodos = filterTodos(todos, currentFilter);
  const uncompletedCount = filterTodos(todos, FilterType.Active).length;
  const allTodosAreActive = todos.every((todo: Todo) => !todo.completed);

  const shouldShowFooter
  = todos.length > 0
  && (currentFilter === FilterType.All
    || currentFilter === FilterType.Active
    || (currentFilter === FilterType.Completed)
    || allTodosAreActive);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <TodoHeader
          todos={todos}
          filteredTodos={filteredTodos}
          toggleAllTodos={toggleAllTodos}
          handleNewTodoSubmit={handleNewTodoSubmit}
          inputRef={inputRef}
          isInputDisabled={isInputDisabled}
        />
        {filteredTodos.length > 0 && (
          <TodoList
            filteredTodos={filteredTodos}
            handleTodoDelete={handleTodoDelete}
            handleTodoToggle={handleTodoToggle}
            handleTodoUpdate={handleTodoUpdate}
            isLoading={isLoading}
            tempTodo={tempTodo}
          />
        )}
        {shouldShowFooter && (
          <TodoFooter
            currentFilter={currentFilter}
            setCurrentFilter={setCurrentFilter}
            todos={todos}
            handleClearCompleted={handleClearCompleted}
            uncompletedCount={uncompletedCount}
            allTodosAreActive={allTodosAreActive}
          />
        )}
      </div>
      <ErrorNotification
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
