/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  useMemo,
} from 'react';
import { addTodo, deleteTodo, getTodos } from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { Todo } from './types/Todo';
import { ErrorType } from './types/ErrorType';
import { FilterBy } from './types/FilterBy';
import { getVisibletodos } from './utils/getVisibleTodos';
import { NewTodoField } from './components/NewTodoField';
import { TodosCountInfo } from './components/TodosCountInfo/TodosCountInfo';
import { ClearCompletedTodos } from './components/ClearCompletedTodos';
import { TodosFilter } from './components/TodosFilter';
import { TodosList } from './components/TodosList';
import { ErrorNotification } from './components/ErrorNotification';
import { TempTodo } from './components/TempTodo';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState<FilterBy>(FilterBy.ALL);
  const [error, setError] = useState<ErrorType>(ErrorType.NONE);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingIds, setDeletingIds] = useState<number[]>([]);

  const loadTodos = useCallback(async () => {
    if (user) {
      try {
        const TodosFromApi = await getTodos(user?.id);

        setTodos(TodosFromApi);
      } catch {
        throw new Error('Todos not found');
      }
    }
  }, [user]);

  useEffect(() => {
    loadTodos();
  }, [isAdding, isDeleting]);

  useEffect(() => {
    setTimeout(() => setError(ErrorType.NONE), 3000);
  }, [error]);

  useEffect(() => {
    setError(ErrorType.NONE);
  }, [filterBy]);

  const handleError = (errorType: ErrorType) => {
    setError(errorType);
  };

  const handleAddTodo = useCallback(async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!newTodoTitle.trim()) {
      setError(ErrorType.EMPTYTITLE);
    }

    if (user && newTodoTitle.trim()) {
      setIsAdding(true);

      const newTodo = {
        userId: user.id,
        title: newTodoTitle.trim(),
        completed: false,
      };

      try {
        await addTodo(newTodo);
      } catch {
        setError(ErrorType.ADD);
      }
    }

    setNewTodoTitle('');
    setIsAdding(false);
  }, [newTodoTitle, user]);

  const onDeleteTodo = useCallback(async (todoId: number) => {
    setIsDeleting(true);

    if (user) {
      try {
        await deleteTodo(todoId);
      } catch {
        setError(ErrorType.DELETE);
      }
    }

    setIsDeleting(false);
  }, [user]);

  const handleDeleteAllCompleted = useCallback(() => {
    const completedTodosId = todos
      .filter(({ completed }) => completed)
      .map(({ id }) => id);

    setDeletingIds(completedTodosId);

    todos.forEach(todo => {
      if (todo.completed) {
        onDeleteTodo(todo.id);
      }
    });
  }, [todos]);

  const handleNewTodoTitle = useCallback((
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setNewTodoTitle(event.target.value);
  }, []);

  const handleFilterChange = useCallback((filter: FilterBy) => {
    setFilterBy(filter);
  }, []);

  const closeErrorMassege = useCallback(() => {
    setError(ErrorType.NONE);
  }, []);

  const hasTodos = useMemo(() => todos.length > 0, [todos]);
  const hasCompleted = useMemo(() => (
    todos.some(({ completed }) => completed)), [todos]);
  const visibleTodos = useMemo(() => (
    getVisibletodos(todos, filterBy)), [todos, filterBy]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <NewTodoField
          onError={handleError}
          onAddTodo={handleAddTodo}
          isAdding={isAdding}
          hasTodos={hasTodos}
          newTodoField={newTodoField}
          newTodoTitle={newTodoTitle}
          onTitleChange={handleNewTodoTitle}
        />

        {hasTodos && (
          <>
            <section className="todoapp__main" data-cy="TodoList">
              <TodosList
                todos={visibleTodos}
                onError={handleError}
                onDelete={onDeleteTodo}
                deletingIds={deletingIds}
              />

              {isAdding && (
                <TempTodo title={newTodoTitle} />
              )}
            </section>

            <footer className="todoapp__footer" data-cy="Footer">
              <TodosCountInfo todos={todos} />
              <TodosFilter
                filterBy={filterBy}
                onFilterChange={handleFilterChange}
              />
              <ClearCompletedTodos
                hasCompleted={hasCompleted}
                onDeleteAllCompleted={handleDeleteAllCompleted}
              />
            </footer>
          </>
        )}
      </div>

      <ErrorNotification error={error} onClose={closeErrorMassege} />
    </div>
  );
};
