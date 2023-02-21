/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import { addTodo, deleteTodo, getTodos } from './api/todos';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Notification } from './components/Notification';
import { TodoList } from './components/TodoList';
import { ErrorMessage } from './types/ErrorMessage';
import { FilterBy } from './types/Filter';
import { Todo } from './types/Todo';
import { getFiltredTodos } from './utils/getFiltredTodos';

const USER_ID = 6392;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState<FilterBy>(FilterBy.ALL);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage]
    = useState<ErrorMessage>(ErrorMessage.NONE);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [todoTitle, setTodoTitle] = useState('');
  const [isBeingLoading, setIsBeingLoading] = useState(false);
  const [idCheck, setidCheck] = useState(-1);

  const showError = (message: ErrorMessage) => {
    setHasError(true);
    setErrorMessage(message);
  };

  const loadTodos = async () => {
    try {
      const loadedTodos = await getTodos(USER_ID);

      setTodos(loadedTodos);
    } catch {
      setHasError(true);
      setErrorMessage(ErrorMessage.ONLOAD);
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const visibleTodos = useMemo(() => (
    getFiltredTodos(todos, filterBy)
  ), [todos, filterBy]);

  const activeTodosAmount = todos.filter(todo => !todo.completed).length;
  const isFooterVisible = !!todos.length;
  const isClearButtonVisible = !!(todos.length - activeTodosAmount);

  const clearNotification = useCallback(() => {
    setHasError(false);
  }, []);

  const handleAddTodo = useCallback(async (title: string) => {
    clearNotification();

    if (!title.trim()) {
      showError(ErrorMessage.ONTITLE);
      setTodoTitle('');

      return;
    }

    const todoToAdd = {
      id: 0,
      userId: USER_ID,
      completed: false,
      title,
    };

    setTempTodo(todoToAdd);
    setIsBeingLoading(true);

    try {
      const todoAdder = await addTodo(USER_ID, todoToAdd);

      setTodos(curTodos => [...curTodos, todoAdder]);
      setTodoTitle('');
    } catch {
      showError(ErrorMessage.ONADD);
    } finally {
      setTempTodo(null);
      setIsBeingLoading(false);
    }
  }, []);

  const handleDeleteTodo = useCallback(async (todoId: number) => {
    clearNotification();
    try {
      setidCheck(todoId);
      setIsBeingLoading(true);
      await deleteTodo(todoId);
      await loadTodos();
    } catch {
      showError(ErrorMessage.ONDELETE);
    } finally {
      setidCheck(-1);
      setIsBeingLoading(false);
    }
  }, []);

  const handleDeleteCompletedTodos = useCallback(() => {
    todos.forEach(todo => {
      if (todo.completed) {
        handleDeleteTodo(todo.id);
      }
    });
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          onAddTodo={handleAddTodo}
          todoTitle={todoTitle}
          setTodoTitle={setTodoTitle}
          isBeingLoading={isBeingLoading}
          showExpendIcon={todos.length > 0}
        />

        <TodoList
          todos={visibleTodos}
          tempTodo={tempTodo}
          isBeingLoading={isBeingLoading}
          idCheck={idCheck}
          onRemove={handleDeleteTodo}
        />

        {isFooterVisible && (
          <Footer
            filterBy={filterBy}
            setFilterBy={setFilterBy}
            activeTodosAmount={activeTodosAmount}
            isClearButtonVisible={isClearButtonVisible}
            onClearCompleted={handleDeleteCompletedTodos}
          />
        )}
      </div>

      {hasError && (
        <Notification
          hasError={hasError}
          errorMessage={errorMessage}
          onClear={clearNotification}
        />
      )}
    </div>
  );
};
