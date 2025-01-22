/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoList } from './components/TodoList';
import { Todo } from './types/Todo';
import { TodoHeader } from './components/TodoHeader';
import { TodoFooter } from './components/TodoFooter';
import { FilterStatus } from './types/FilterStatus';
import * as todoService from './api/todos';
import { handleError } from './utils/utils';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  // const [filteredTodos, setFilteredTodos] = useState<Todo[]>(todos);
  const [searchQuery, setSearchQuery] = useState('');
  const [isErrorVisible, setIsErrorVisible] = useState(false);
  const [selectFilterStatus, setSelectFilterStatus] = useState<FilterStatus>(
    FilterStatus.All,
  );
  const [error, setError] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [deletingTodos, setDeletingTodos] = useState<Record<number, boolean>>(
    {},
  );
  const [pendingOperation, setPendingOperation] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    todoService
      .getTodos()
      .then(setTodos)
      .catch(() => {
        setIsErrorVisible(true);
        setError('Unable to load todos');
      });
  }, []);

  const filteredTodos = useMemo(
    () =>
      todos.filter(todo => {
        switch (selectFilterStatus) {
          case FilterStatus.Active:
            return !todo.completed;
          case FilterStatus.Completed:
            return todo.completed;
          default:
            return true;
        }
      }),
    [todos, selectFilterStatus],
  );

  useEffect(() => {
    if (isErrorVisible) {
      const timer = setTimeout(() => {
        setIsErrorVisible(false);
      }, 3000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [isErrorVisible, error]);

  useEffect(() => {
    if (pendingOperation === 0) {
      inputRef.current?.focus();
    }
  }, [pendingOperation]);

  const addTodo = async (todo: Omit<Todo, 'id' | 'userId'>) => {
    setTempTodo({
      id: 0,
      ...todo,
      userId: todoService.USER_ID,
    });
    setIsAdding(true);
    setPendingOperation(prev => prev + 1);

    try {
      const newTodo = await todoService.createTodo(todo);

      setTodos(currentTodos => [...currentTodos, newTodo]);
    } catch {
      throw new Error('Unable to add a todo');
    } finally {
      setTempTodo(null);
      setIsAdding(false);
      setPendingOperation(prev => prev - 1);
    }
  };

  const deleteTodo = async (todoId: number) => {
    setDeletingTodos(prevState => ({ ...prevState, [todoId]: true }));
    setPendingOperation(prev => prev + 1);

    try {
      await todoService.deleteTodo(todoId);

      setTodos(currentTodos => currentTodos.filter(todo => todoId !== todo.id));
    } catch {
      handleError('Unable to delete a todo', setError, setIsErrorVisible);
    } finally {
      setDeletingTodos(prevState => {
        const newState = { ...prevState };

        delete newState[todoId];

        return newState;
      });
      setPendingOperation(prev => prev - 1);
    }
  };

  const deleteCompletedTodos = async (completedIds: number[]) => {
    setDeletingTodos(prevState =>
      completedIds.reduce((acc, id) => ({ ...acc, [id]: true }), prevState),
    );
    setPendingOperation(prev => prev + 1);

    try {
      await Promise.all(completedIds.map(id => deleteTodo(id)));
    } catch {
      handleError(
        'Unable to delete completed todos',
        setError,
        setIsErrorVisible,
      );
    } finally {
      setDeletingTodos(prevState => {
        const newState = { ...prevState };

        completedIds.forEach(todoId => delete newState[todoId]);

        return newState;
      });
      setPendingOperation(prev => prev - 1);
    }
  };

  if (!todoService.USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setError={setError}
          setIsErrorVisible={setIsErrorVisible}
          addTodo={addTodo}
          inputRef={inputRef}
          isLoading={pendingOperation !== 0}
        />

        <TodoList
          todos={filteredTodos}
          deleteTodo={deleteTodo}
          tempTodo={tempTodo}
          isAdding={isAdding}
          deletingTodos={deletingTodos}
        />

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <TodoFooter
            todos={todos}
            selectedStatus={selectFilterStatus}
            setSelectedStatus={setSelectFilterStatus}
            onClearCompleted={deleteCompletedTodos}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <ErrorNotification
        isErrorVisible={isErrorVisible}
        onClose={setIsErrorVisible}
        errorMessage={error}
      />
    </div>
  );
};
