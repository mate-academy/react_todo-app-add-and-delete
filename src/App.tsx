/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { AuthContext } from './components/Auth/AuthContext';

import { getTodos, deleteTodo } from './api/todos';
import { Todo } from './types/Todo';
import { TodosList } from './components/TodosList';
import { FilterBy } from './types/FilterBy';
import { FilterBar } from './components/FilterBar';
import { TodoAdd } from './components/TodoAdd';
import { Errors } from './components/Errors';
import { ErrorsType } from './types/ErrorsType';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const [newTodoTitle, setNewTodoTitle] = useState('');

  const [todosList, setTodoList] = useState<Todo[]>([]);

  // Errors
  const [errors, setErrors] = useState<ErrorsType[]>([]);

  // states
  const [isLoadingTodos, setIsLoadingTodos] = useState<number[]>([]);

  // Filter By
  const [filterBy, setFilterBy] = useState<FilterBy>(FilterBy.All);

  const leftTodos = useMemo(() => (
    todosList.filter(todo => todo.completed === false).length
  ), [todosList]);

  const completedTodos = useMemo(() => (todosList.length - leftTodos),
    [todosList]);

  const filteredTodos = todosList.filter(todo => {
    switch (filterBy) {
      case FilterBy.Active:
        return todo.completed === false;
      case FilterBy.Completed:
        return todo.completed === true;
      case FilterBy.All:
      default:
        return true;
    }
  });

  const getTodosList = useCallback(async () => {
    if (user) {
      setTodoList(await getTodos(user.id));
    } else {
      throw new Error('No user');
    }
  }, []);

  const clearError = useCallback(() => {
    setErrors([]);
  }, []);

  const deleteAllCompleted = useCallback(async () => {
    setIsLoadingTodos(currentLoadTodos => {
      const deletedTodos = todosList
        .filter(todo => todo.completed)
        .map(todo => todo.id);

      return [
        ...currentLoadTodos,
        ...deletedTodos,
      ];
    });
    try {
      await Promise.all(todosList.map(todo => {
        if (todo.completed) {
          return deleteTodo(todo.id);
        }

        return null;
      }));

      setTodoList(currentList => currentList
        .filter(todo => !todo.completed));
    } catch {
      setErrors(currErrors => [
        ...currErrors,
        ErrorsType.Delete,
      ]);
      setTimeout(() => {
        setErrors(currErrors => currErrors
          .filter(error => error !== ErrorsType.Delete));
      }, 3000);
    }

    setIsLoadingTodos([]);
  }, []);

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    getTodosList();
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            data-cy="ToggleAllButton"
            type="button"
            className="todoapp__toggle-all active"
          />

          <TodoAdd
            newTodoField={newTodoField}
            isLoadingTodos={isLoadingTodos}
            setErrors={setErrors}
            setIsLoadingTodos={setIsLoadingTodos}
            getTodosList={getTodosList}
            errors={errors}
            newTodoTitle={newTodoTitle}
            setNewTodoTitle={setNewTodoTitle}
          />
        </header>

        {todosList.length > 0
          && (
            <TodosList
              todos={filteredTodos}
              getTodosList={getTodosList}
              setErrors={setErrors}
              isLoadingTodos={isLoadingTodos}
              setIsLoadingTodos={setIsLoadingTodos}
              newTodoTitle={newTodoTitle}
            />
          )}

        {todosList.length > 0
          && (
            <FilterBar
              leftTodos={leftTodos}
              filterBy={filterBy}
              setFilterBy={setFilterBy}
              completedTodos={completedTodos}
              deleteAllCompleted={deleteAllCompleted}
            />
          )}
      </div>

      {errors.length > 0 && (
        <Errors
          clearError={clearError}
          errors={errors}
        />
      )}
    </div>
  );
};
