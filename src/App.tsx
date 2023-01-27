/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from 'react';

import { AuthContext } from './components/Auth/AuthContext';
import { Footer } from './components/Footer/Footer';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { ErrorNotification } from
  './components/ErrorNotification/ErrorNotification';

import { createTodo, deleteTodoById, getTodos } from './api/todos';

import { Todo } from './types/Todo';
import { CompletedFilter } from './types/CompletedFilter';
// import { TodoItem } from './components/TodoItem/TodoItem';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [completedFilter, setCompletedFilter] = useState(CompletedFilter.All);
  // const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const closeErrorMessage = useCallback((message: string) => {
    setErrorMessages((prev) => {
      const messageIndex = prev.indexOf(message);
      const messagesCopy = [...prev];

      messagesCopy.splice(messageIndex, 1);

      return messagesCopy;
    });
  }, []);

  const showError = useCallback((message: string) => {
    setErrorMessages((prev) => [message, ...prev]);

    setTimeout(() => closeErrorMessage(message), 3000);
  }, [closeErrorMessage]);

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    if (user) {
      getTodos(user.id)
        .then(setTodos)
        .catch(() => showError('Todos loading failed'));
    }
  }, []);

  const addTodo = useCallback(async (newTitle: string) => {
    setIsAdding(true);

    if (user) {
      try {
        const newTodo = await createTodo({
          title: newTitle.trim(),
          userId: user?.id,
          completed: false,
        });

        setTodos(current => [
          ...current, newTodo,
        ]);
      } catch (error) {
        showError('Unable to add a todo');
      } finally {
        setIsAdding(false);
      }
    }
  }, []);

  const deleteTodo = useCallback(async (todoId: number) => {
    try {
      const responseResult = await deleteTodoById(todoId);

      setTodos(currentTodos => currentTodos.filter(
        todo => todo.id !== todoId,
      ));

      return responseResult;
    } catch (error) {
      showError('Unable to delete todo');

      return false;
    }
  }, []);

  const activeTodos = useMemo(() => (
    todos.filter(todo => !todo.completed)
  ), [todos, completedFilter]);

  const visibleTodos = useMemo(() => {
    switch (completedFilter) {
      case CompletedFilter.All:
        return todos;

      case CompletedFilter.Active:
        return todos.filter(todo => !todo.completed);

      case CompletedFilter.Completed:
        return todos.filter(todo => todo.completed);

      default:
        throw new Error('Invalid type');
    }
  }, [todos, completedFilter]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          newTodoField={newTodoField}
          onAddTodo={addTodo}
          isAdding={isAdding}
          showError={showError}
        />

        {todos.length !== 0 && (
          <>
            <TodoList todos={visibleTodos} onTodoDelete={deleteTodo} />

            <Footer
              activeTodos={activeTodos}
              completedFilter={completedFilter}
              setCompletedFilter={setCompletedFilter}
            />
          </>
        )}
      </div>

      {errorMessages.length > 0 && (
        <ErrorNotification
          messages={errorMessages}
          close={closeErrorMessage}
        />
      )}
    </div>
  );
};
