/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { addTodo, deleteTodo, getTodos, USER_ID } from './api/todos';
import { TodoForm } from './components/TodoForm/TodoForm';
import { TodoList } from './components/TodoList/TodoList';
import { TodoFilter } from './components/TodoFilter/TodoFilter';
import { Error } from './components/Error/Error';
import { Todo } from './types/Todo';
import { FilterOption } from './types/Filter';
import { ErrorType } from './types/Error';
import { Loader } from './components/Loader/Loader';
import { filterTodos } from './utils/filter';
import { TempTodoItem } from './components/TempTodoItem/TempTodoItem';

export const App: React.FC = () => {
  // #region states

  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<ErrorType>(
    ErrorType.noError,
  );
  const [filterField, setFilterField] = useState(FilterOption.all);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletedTodos, setDeletedTodos] = useState<number[]>([]);
  const inputField = useRef<HTMLInputElement>(null);

  // #endregion

  const loadData = async () => {
    setLoading(true);
    try {
      const fetchedTodos = await getTodos();

      setTodos(fetchedTodos);
    } catch (error) {
      setErrorMessage(ErrorType.loading);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (errorMessage) {
      timeoutId = setTimeout(() => {
        setErrorMessage(ErrorType.noError);
      }, 3000);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [errorMessage]);

  const clearErrorMessage = useCallback(() => {
    setErrorMessage(ErrorType.noError);
  }, []);

  const filteredTodos = useMemo(() => {
    return filterTodos(todos, filterField);
  }, [todos, filterField]);

  const handleFilterBy = useCallback((filter: FilterOption) => {
    setFilterField(filter);
  }, []);

  const handleAddTodo = async (title: string) => {
    if (!title.trim()) {
      setErrorMessage(ErrorType.emptyTitle);

      return false;
    }

    const newTodo: Omit<Todo, 'id'> = {
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    };

    const newTempTodo: Todo = {
      ...newTodo,
      id: 0,
    };

    setTempTodo(newTempTodo);

    try {
      const addedTodo = await addTodo(newTodo);

      setTodos(prev => [...prev, addedTodo]);

      return true;
    } catch (error) {
      setErrorMessage(ErrorType.adding);

      return false;
    } finally {
      setTempTodo(null);
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
    setDeletedTodos(currentTodos => [...currentTodos, todoId]);

    try {
      await deleteTodo(todoId);
      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
      inputField.current?.focus();
    } catch {
      setErrorMessage(ErrorType.deleting);
    } finally {
      setDeletedTodos(currentTodos => currentTodos.filter(id => id !== todoId));
    }
  };

  const handleClearCompletedTodos = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.forEach(todo => handleDeleteTodo(todo.id));
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      {loading ? (
        <Loader />
      ) : (
        <div className="todoapp__content">
          <TodoForm
            todos={todos}
            onAddTodo={handleAddTodo}
            isLoading={tempTodo !== null}
            inputField={inputField}
          />
          <section className="todoapp__main" data-cy="TodoList">
            <TodoList
              todos={filteredTodos}
              onDelete={handleDeleteTodo}
              deletedTodos={deletedTodos}
            />
            {tempTodo && <TempTodoItem todo={tempTodo} isLoading />}
          </section>
          {todos.length > 0 && (
            <TodoFilter
              todos={todos}
              filterField={filterField}
              onFilter={handleFilterBy}
              onClearCompleted={handleClearCompletedTodos}
            />
          )}
        </div>
      )}
      <Error
        errorMessage={errorMessage}
        clearErrorMessage={clearErrorMessage}
      />
    </div>
  );
};
