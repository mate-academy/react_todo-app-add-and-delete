import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { UserWarning } from './UserWarning';
import { addTodo, deleteTodo, getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { Footer } from './components/Footer';
// eslint-disable-next-line max-len
import { ErrorNotification } from './components/ErrorNotification';
import { TodoErrors } from './types/Error';
import { Filter } from './types/Filter';
import { TodoForm } from './components/TodoForm';
import { TodoList } from './components/TodoList';
import cn from 'classnames';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isFormSubmitting, setIsFormSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<TodoErrors | null>(null);
  const [filter, setFilter] = useState<Filter>(Filter.ALL);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);
  const formRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchTodos = async () => {
      setErrorMessage(null);

      try {
        const todosFromServer = await getTodos();

        setTodos(todosFromServer);
      } catch {
        setErrorMessage(TodoErrors.UNABLE_TO_LOAD);
      }
    };

    fetchTodos();
  }, []);

  const allCompleted = todos.length > 0 && todos.every(todo => todo.completed);

  const filteredTodos = useMemo(
    () =>
      todos.filter(todo => {
        switch (filter) {
          case Filter.ACTIVE:
            return !todo.completed;
          case Filter.COMPLETED:
            return todo.completed;
          case Filter.ALL:
          default:
            return true;
        }
      }),
    [todos, filter],
  );

  const handleAddTodo = useCallback(async (title: string) => {
    setIsFormSubmitting(true);

    const tmpTodo: Todo = {
      id: 0,
      title: title,
      completed: false,
      userId: USER_ID,
    };

    setTempTodo(tmpTodo);

    try {
      const createdTodo = await addTodo(title);

      setTodos(prevTodos => [...prevTodos, createdTodo]);
      setTempTodo(null);

      return true;
    } catch (error) {
      setErrorMessage(TodoErrors.UNABLE_TO_ADD);
      setTempTodo(null);

      return false;
    } finally {
      setIsFormSubmitting(false);
    }
  }, []);

  const handleDeleteTodo = useCallback(async (todoId: number) => {
    setLoadingIds(prev => [...prev, todoId]);

    try {
      await deleteTodo(todoId);

      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));

      setTimeout(() => {
        formRef.current?.focus();
      }, 0);
    } catch (error) {
      setErrorMessage(TodoErrors.UNABLE_TO_DELETE);
    } finally {
      setLoadingIds(prev => prev.filter(id => id !== todoId));
    }
  }, []);

  const handleDeleteCompleted = useCallback(() => {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.forEach(async completedTodo => {
      setLoadingIds(prev => [...prev, completedTodo.id]);

      try {
        await deleteTodo(completedTodo.id);
        setTodos(prev => prev.filter(todo => todo.id !== completedTodo.id));
      } catch {
        setErrorMessage(TodoErrors.UNABLE_TO_DELETE);
      } finally {
        setLoadingIds(prev => prev.filter(id => id !== completedTodo.id));

        setTimeout(() => {
          formRef.current?.focus();
        }, 0);
      }
    });
  }, [todos]);

  const handleClearErrorNotification = () => {
    setErrorMessage(null);
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className={cn('todoapp__toggle-all', { active: allCompleted })}
            data-cy="ToggleAllButton"
          />

          <TodoForm
            ref={formRef}
            onError={setErrorMessage}
            onAddTodo={handleAddTodo}
            isSubmitting={isFormSubmitting}
          />
        </header>

        {todos.length > 0 && (
          <TodoList
            todos={filteredTodos}
            onDeleteTodo={handleDeleteTodo}
            loadingIds={loadingIds}
          />
        )}

        {tempTodo && (
          <TodoList
            todos={[tempTodo]}
            loadingIds={loadingIds}
            isTodoTemp={true}
          />
        )}

        {todos.length > 0 && (
          <Footer
            todos={todos}
            filter={filter}
            onChangeFilter={setFilter}
            handleDeleteCompleted={handleDeleteCompleted}
          />
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        onClear={handleClearErrorNotification}
      />
    </div>
  );
};
