/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
} from 'react';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Errors } from './components/Errors/Errors';
import { Footer } from './components/Footer/Footer';
import { Filter } from './types/Filter';
import { Todo } from './types/Todo';
import { getTodos, addTodo, removeTodo } from './api/todos';
import { UserWarning } from './UserWarning';
import { filterTodos } from './utils/prepareTodos';
import { Error } from './types/Error';

const USER_ID = 6405;

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

  const todosCounter = todos.length - completedTodos.length;

  const setFilterTypeWrapper = useCallback((value: Filter) => {
    setFilterType(value);
  }, []);

  const setTodoTitleWrapper = (value: string) => {
    setTodoTitle(value);
  };

  const setErrorWrapper = (currentError: Error) => {
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
        <Header
          todoTitle={todoTitle}
          setTodoTitleWrapper={setTodoTitleWrapper}
          setErrorWrapper={setErrorWrapper}
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

            <Footer
              filterType={filterType}
              setFilterTypeWrapper={setFilterTypeWrapper}
              completedTodos={completedTodos.length}
              todosCounter={todosCounter}
              deleteCompletedTodos={deleteCompletedTodos}
            />
          </>
        )}

      </div>

      <Errors
        error={error}
        setErrorWrapper={setErrorWrapper}
        removeError={removeError}
      />
    </div>
  );
};
