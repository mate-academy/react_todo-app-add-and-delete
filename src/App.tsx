/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import { createTodo, deleteTodo, getTodos } from './api/todos';

import { AuthContext } from './components/Auth/AuthContext';
import { ErrorNotifications } from './components/ErrorNotifications';
import { Filters } from './components/Filters';
import { NewTodo } from './components/NewTodo/NewTodo';
import { TodoList } from './components/TodoList';

import { ErrorType } from './types/ErrorType';
import { FilterType } from './types/FilterType';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [visibleTodos, setVisibleTodos] = useState<Todo[]>(todos);
  const [filterBy, setFilterBy] = useState<FilterType>(FilterType.ALL);
  const [error, setError] = useState<ErrorType>(ErrorType.NONE);
  const [todoTitle, setTodoTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [deletedTodoIds, setDeletedTodoIds] = useState<number[]>([]);

  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const loadTodos = useCallback(async () => {
    if (user) {
      try {
        const todosFromServer = await getTodos(user.id);

        setTodos(todosFromServer);
      } catch {
        setError(ErrorType.LOAD);
      }
    }
  }, []);

  const handleAddNewTodo = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (user) {
      setIsAdding(true);

      try {
        if (!todoTitle.trim().length) {
          setError(ErrorType.TITLE);
          setIsAdding(false);

          return;
        }

        await createTodo(todoTitle, user.id);
        await loadTodos();

        setIsAdding(false);
        setTodoTitle('');
      } catch {
        setError(ErrorType.UPLOAD);
        setIsAdding(false);
      }
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
    setDeletedTodoIds([todoId]);

    try {
      await deleteTodo(todoId);
      await loadTodos();
    } catch {
      setError(ErrorType.DELETE);
    }
  };

  const handleDeleteCompletedTodos = async () => {
    try {
      const completedTodoIds = todos
        .filter(todo => todo.completed)
        .map(todo => todo.id);

      setDeletedTodoIds(completedTodoIds);

      await Promise.all(todos.map(async (todo) => {
        if (todo.completed) {
          await deleteTodo(todo.id);
        }

        return todo;
      }));

      await loadTodos();
    } catch {
      setError(ErrorType.DELETE);
    }
  };

  const handleFilterSelect = useCallback((filterType: FilterType) => {
    setFilterBy(filterType);
  }, []);

  const handleCloseError = useCallback(() => {
    setError(ErrorType.NONE);
  }, []);

  const handleChangeTodoTitle = useCallback((title: string) => {
    setTodoTitle(title);
  }, []);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    loadTodos();
  }, []);

  useEffect(() => {
    const filteredTodos = todos.filter(todo => {
      switch (filterBy) {
        case FilterType.ALL:
          return todo;

        case FilterType.ACTIVE:
          return !todo.completed;

        case FilterType.COMPLETED:
          return todo.completed;

        default:
          return true;
      }
    });

    setVisibleTodos(filteredTodos);
  }, [filterBy, todos]);

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

          <NewTodo
            newTodoField={newTodoField}
            todoTitle={todoTitle}
            onChangeTodoTitle={handleChangeTodoTitle}
            submitNewTodo={handleAddNewTodo}
            isAdding={isAdding}
          />
        </header>

        {todos.length > 0 && (
          <>
            <TodoList
              todos={visibleTodos}
              isAdding={isAdding}
              todoTitle={todoTitle}
              onDeleteTodo={handleDeleteTodo}
              deletedTodoIds={deletedTodoIds}
            />
            <Filters
              todos={todos}
              filterBy={filterBy}
              onFilter={handleFilterSelect}
              onDeleteAllTodos={handleDeleteCompletedTodos}
            />
          </>
        )}
      </div>

      <ErrorNotifications
        error={error}
        onCloseError={handleCloseError}
      />
    </div>
  );
};
