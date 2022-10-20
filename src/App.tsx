/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  FormEvent,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  createTodo,
  getTodos,
  deleteTodo,
} from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { ErrorNotification } from './components/ErrorNotification';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { ErrorMessage } from './types/ErrorMessage';
import { SortType } from './types/SortType';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const userId = user?.id || 0;
  const [todos, setTodos] = useState<Todo[]>([]);
  const [sortType, setSortType] = useState<SortType>('all');
  const [isAdding, setIsAdding] = useState(false);
  const [processings, setProcessings] = useState<number[]>([]);
  const [error, setError] = useState<ErrorMessage>(ErrorMessage.none);
  const [tempTodo, setTempTodo] = useState<Todo>({
    id: 0,
    userId,
    title: '',
    completed: false,
  });
  const setTempTodoTitle = useCallback((title: string) => {
    return setTempTodo(current => ({ ...current, title }));
  }, []);
  const todosCount = todos.length;

  if (!error) {
    setTimeout(() => {
      setError(ErrorMessage.none);
    }, 3000);
  }

  useEffect(() => {
    getTodos(userId)
      .then(setTodos)
      .catch(() => (
        setError(ErrorMessage.load)
      ));
  }, [userId]);

  const todosLeft = useMemo(() => {
    return todos.reduce((acc, todo) => {
      if (!todo.completed) {
        return acc + 1;
      }

      return acc;
    }, 0);
  }, [todos]);

  const filtredTodos = useMemo(() => {
    return todos.filter(todo => {
      if ((sortType === 'active' && todo.completed)
       || (sortType === 'completed' && !todo.completed)) {
        return false;
      }

      return todo;
    });
  }, [todos, sortType]);

  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();

    if (!tempTodo.title.trim()) {
      setError(ErrorMessage.emptyTitle);
      setTempTodoTitle('');

      return;
    }

    setIsAdding(true);

    try {
      const newTodo = await createTodo(tempTodo.title, userId);

      setTodos(current => [...current, newTodo]);
    } catch {
      setError(ErrorMessage.add);
    } finally {
      setIsAdding(false);
      setTempTodoTitle('');
    }
  }, [tempTodo, userId]);

  const handleDelete = useCallback(async (todoId: number) => {
    setProcessings(current => [...current, todoId]);

    try {
      await deleteTodo(todoId);
      setTodos(current => current.filter(todo => todo.id !== todoId));
    } catch {
      setError(ErrorMessage.delete);
    } finally {
      setProcessings(current => current.filter(id => id !== todoId));
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
          hasTodos={todosCount > 0}
          hasActiveTodos={todosLeft > 0}
          isAdding={isAdding}
          onSubmit={handleSubmit}
          setTitle={setTempTodoTitle}
        />

        {(todosCount > 0) && (
          <>
            <TodoList
              todos={filtredTodos}
              tempTodo={tempTodo}
              isAdding={isAdding}
              processings={processings}
              onDelete={handleDelete}
            />
            <Footer
              todosCount={todosCount}
              todosLeft={todosLeft}
              filterType={sortType}
              setFilterType={setSortType}
              clearCompleted={clearCompleted}
            />
          </>
        )}
      </div>

      <ErrorNotification error={error} unSetError={setError} />
    </div>
  );
};
