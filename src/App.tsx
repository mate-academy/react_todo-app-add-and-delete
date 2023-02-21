/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { TodoForm } from './components/TodoForm';
import { UserWarning } from './components/UserWarning';
import { TodoList } from './components/TodoList';
import { TodoFilter } from './components/TodoFilter/TodoFilter';
import { ErrorNotifications } from './components/ErrorNotifications';
import { Todo } from './types/Todo';
import { getTodos, addTodo, removeTodo } from './api/todos';
import { Filter } from './types/Filter';
import { filterTodos } from './utils/filterTodos';
import { Error } from './types/Error';

const USER_ID = 6378;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState <Error>(Error.NONE);
  const [filterType, setFilterType] = useState<Filter>(Filter.ALL);
  const [todoTitle, setTodoTitle] = useState('');
  const [isAddWaiting, setIsAddWaiting] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isDeleteWaiting, setIsDeleteWaiting] = useState(false);
  const [onRemoveTodoIds, setOnRemoveTodoIds] = useState<number[]>([]);

  const changeRemoveTodoIds = useCallback((value: number[]) => {
    setOnRemoveTodoIds(value);
  }, []);

  const removeError = () => {
    window.setTimeout(() => setError(Error.NONE), 3000);
  };

  const loadTodosFromServer = async () => {
    try {
      const todosFromServer = await getTodos(USER_ID);

      setTodos(todosFromServer);
    } catch {
      setError(Error.ONLOAD);
    }
  };

  useEffect(() => {
    loadTodosFromServer();
  }, []);

  const addNewTodo = async () => {
    try {
      setIsAddWaiting(true);

      const newTodo = {
        userId: USER_ID,
        title: todoTitle.trim(),
        completed: false,
      };

      await addTodo(USER_ID, newTodo);

      const demoTodo = {
        ...newTodo,
        id: 0,
      };

      setTempTodo(demoTodo);

      await loadTodosFromServer();
    } catch {
      setError(Error.ONADD);
    } finally {
      setIsAddWaiting(false);
      setTempTodo(null);
    }
  };

  const deleteTodo = useCallback(async (todoId: number) => {
    try {
      setIsDeleteWaiting(true);

      await removeTodo(USER_ID, todoId);
      await loadTodosFromServer();
    } catch {
      setError(Error.ONDELETE);
    } finally {
      setIsDeleteWaiting(false);
    }
  }, []);

  const visibleTodos = filterTodos(todos, filterType);

  const completedTodos = useMemo(() => todos
    .filter(todo => todo.completed), [todos]);

  const activeTodos = todos.length - completedTodos.length;

  const onFilterTypeChange = useCallback((value: Filter) => {
    setFilterType(value);
  }, []);

  const onTodoTitleChange = (value: string) => {
    setTodoTitle(value);
  };

  const handleErrors = (currentError: Error) => {
    setError(currentError);
  };

  const completedTodoIds = completedTodos.map(todo => todo.id);

  const deleteCompletedTodos = () => {
    setOnRemoveTodoIds(completedTodoIds);

    completedTodoIds.map(id => deleteTodo(id));
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoForm
          todoTitle={todoTitle}
          onTodoTitleChange={onTodoTitleChange}
          handleErrors={handleErrors}
          addNewTodo={addNewTodo}
          isLoading={isAddWaiting}
        />

        {todos.length > 0 && (
          <>
            <TodoList
              todos={visibleTodos}
              tempTodo={tempTodo}
              deleteTodo={deleteTodo}
              isDeleteWaiting={isDeleteWaiting}
              onRemoveTodoIds={onRemoveTodoIds}
              changeRemoveTodoIds={changeRemoveTodoIds}
            />

            <TodoFilter
              filterType={filterType}
              onFilterTypeChange={onFilterTypeChange}
              completedTodos={completedTodos.length}
              activeTodos={activeTodos}
              deleteCompletedTodos={deleteCompletedTodos}
            />
          </>
        )}

      </div>

      <ErrorNotifications
        error={error}
        handleErrors={handleErrors}
        removeError={removeError}
      />
    </div>
  );
};
