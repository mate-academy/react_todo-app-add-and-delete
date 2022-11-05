/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext,
  useEffect,
  useRef,
  useState,
  FormEvent,
  useCallback,
  useMemo,
} from 'react';

import {
  postTodo,
  getTodos,
  deleteTodo,
} from './api/todos';

import { AuthContext } from './components/Auth/AuthContext';
import { TodoList } from './components/TodoList';
import { ErrorNotification } from './components/ErrorNotification';

import { FilterType } from './types/FilterType';
import { Todo } from './types/Todo';
import { Footer } from './components/Footer';
import { ErrorMessage } from './types/ErrorMessage';
import { Header } from './components/Header';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const userId = user?.id || 0;
  const newTodoField = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [visibleTodos, setVisibleTodos] = useState<Todo[]>(todos);
  const [filterType, setFilterType] = useState(FilterType.ALL);
  const [isError, setIsError] = useState<ErrorMessage>(ErrorMessage.none);
  const [isAdding, setIsAdding] = useState(false);
  const [processing, setProcessing] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo>({
    id: 0,
    userId,
    title: '',
    completed: false,
  });

  const setTempTodoTitle = useCallback((title: string) => {
    return setTempTodo(prevTitle => (
      {
      ...prevTitle, title,
    }));
  }, []);

  const getTodoFromServer = async () => {
    try {
      const id = user ? user.id : 0;
      const response = await getTodos(id);

      setTodos(response);
      setVisibleTodos(response);
    } catch (error) {
      setIsError(ErrorMessage.load);

      setTimeout(() => {
        setIsError(ErrorMessage.none);
      }, 3000);
    }
  };

  useEffect(() => {
    getTodoFromServer();

    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    getTodoFromServer();
  }, []);

  useEffect(() => {
    const newVisibleTodos = todos.filter(todo => {
      switch (filterType) {
        case FilterType.ACTIVE:
          return !todo.completed;
        case FilterType.COMPLETED:
          return todo.completed;
        default:
          return todo;
      }
    });

    setVisibleTodos(newVisibleTodos);
  }, [filterType, todos]);

  const todosLeft = useMemo(() => {
    return todos.reduce((num, todo) => {
      if (!todo.completed) {
        return num + 1;
      }

      return num;
    }, 0);
  }, [todos]);

  const handleSubmit = useCallback(async (event: FormEvent) => {
    event.preventDefault();

    if (!tempTodo.title.trim()) {
      setIsError(ErrorMessage.emptyTitle);
      setTempTodoTitle('');

      return;
    }

    setIsAdding(true);

    try {
      const newTodo = await postTodo(tempTodo.title, userId);

      setTodos(prevTodos => [...prevTodos, newTodo]);
    } catch (error) {
      setIsError(ErrorMessage.add);
    } finally {
      setIsAdding(false);
      setTempTodoTitle('');
    }
  }, [tempTodo, userId]);

  const handleDelete = useCallback(async (todoId: number) => {
    setProcessing(prevTodos => [...prevTodos, todoId]);

    try {
      await deleteTodo(todoId);
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
    } catch (error) {
      setIsError(ErrorMessage.delete);
    } finally {
      setProcessing(current => current.filter(id => id !== todoId));
    }
  }, []);

  const clearCompleted = useCallback(() => todos.forEach(todo => {
    if (todo.completed) {
      handleDelete(todo.id);
    }
  }), [todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          title={tempTodo.title}
          hasTodos={todos.length > 0}
          hasActiveTodos={todosLeft > 0}
          isAdding={isAdding}
          onSubmit={handleSubmit}
          setTitle={setTempTodoTitle}
        />

        {todos.length > 0 && (
          <>
            <TodoList
              todos={visibleTodos}
              tempTodo={tempTodo}
              isAdding={isAdding}
              processing={processing}
              onDelete={handleDelete}
            />
            <Footer
              todosCount={todos.length}
              todosLeft={todosLeft}
              filterType={filterType}
              setFilterType={setFilterType}
              clearCompleted={clearCompleted}
            />
          </>
        )}
      </div>
      
      {isError && (
        <ErrorNotification
          error={isError}
          onClose={() => setIsError(ErrorMessage.none)}
        />
      )}

    </div>
  );
};