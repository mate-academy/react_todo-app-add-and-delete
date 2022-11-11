/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import { postTodo, deleteTodo, getTodos } from './api/todos';

import { AuthContext } from './components/Auth/AuthContext';
import { ErrorMessages } from './components/ErrorMessages';
import { TodosFilter } from './components/TodosFilter/TodosFilter';
import { NewTodo } from './components/NewTodo/NewTodo';
import { TodosList } from './components/TodosList/TodosList';

import { FilterStatus } from './types/FilterStatus';
import { Todo } from './types/Todo';
import { Error } from './types/Error';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [visibleTodos, setVisibleTodos] = useState<Todo[]>(todos);
  const [filterBy, setFilterBy] = useState<FilterStatus>(FilterStatus.ALL);
  const [hasError, setHasError] = useState<Error>(Error.NONE);
  const [todoTitle, setTodoTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [deletedTodoIds, setDeletedTodoIds] = useState<number[]>([]);

  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const loadUserTodos = useCallback(async () => {
    if (user) {
      try {
        const todosFromServer = await getTodos(user.id);

        setTodos(todosFromServer);
      } catch {
        setHasError(Error.LOAD);
      }
    }
  }, []);

  const handleAddNewTodo = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (user) {
      setIsAdding(true);

      try {
        if (!todoTitle.trim().length) {
          setHasError(Error.TITLE);
          setIsAdding(false);

          return;
        }

        await postTodo(todoTitle, user.id);
        await loadUserTodos();

        setIsAdding(false);
        setTodoTitle('');
      } catch {
        setHasError(Error.UPLOAD);
        setIsAdding(false);
      }
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
    setDeletedTodoIds([todoId]);

    try {
      await deleteTodo(todoId);
      await loadUserTodos();
    } catch {
      setHasError(Error.DELETE);
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

      await loadUserTodos();
    } catch {
      setHasError(Error.DELETE);
    }
  };

  const handleFilterSelect = useCallback((filterType: FilterStatus) => {
    setFilterBy(filterType);
  }, []);

  const handleCloseError = useCallback(() => {
    setHasError(Error.NONE);
  }, []);

  const handleChangeTodoTitle = useCallback((title: string) => {
    setTodoTitle(title);
  }, []);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    loadUserTodos();
  }, []);

  useEffect(() => {
    const filteredTodos = todos.filter(todo => {
      switch (filterBy) {
        case FilterStatus.ALL:
          return todo;

        case FilterStatus.ACTIVE:
          return !todo.completed;

        case FilterStatus.COMPLETED:
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
            <TodosList
              todos={visibleTodos}
              isAdding={isAdding}
              todoTitle={todoTitle}
              onDeleteTodo={handleDeleteTodo}
              deletedTodoIds={deletedTodoIds}
            />
            <TodosFilter
              todos={todos}
              filterBy={filterBy}
              onFilter={handleFilterSelect}
              onDeleteAllTodos={handleDeleteCompletedTodos}
            />
          </>
        )}
      </div>

      <ErrorMessages
        error={hasError}
        onCloseError={handleCloseError}
      />
    </div>
  );
};
