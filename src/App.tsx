import React, {
  useCallback,
  useEffect,
  useState,
  useMemo,
} from 'react';
import { addTodo, deleteTodo, getTodos } from './api/todos';
import { FilterValues, USER_ID } from './constants';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { UserWarning } from './components/UserWarning';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  const [title, setTitle] = useState('');
  const [errorType, setErrorType] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isTodoAdding, setIsTodoAdding] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [selectedFilter, setSelectedFilter] = useState(FilterValues.ALL);
  const [removingTodoIds, setRemovingTodoIds] = useState<number[]>([]);

  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (selectedFilter) {
        case FilterValues.COMPLETED:
          return todo.completed;

        case FilterValues.ACTIVE:
          return !todo.completed;

        case FilterValues.ALL:
          return true;

        default: return todo;
      }
    });
  }, [selectedFilter, todos]);

  const hasActive = todos.some(todoItem => !todoItem.completed);

  const getTodosFromServer = async () => {
    try {
      const response = await getTodos(USER_ID);

      setTodos(response);
    } catch (error) {
      setErrorType('upload');
    }
  };

  const addTodoToServer = useCallback(async () => {
    const newTodoToFetch = {
      title,
      completed: false,
      userId: USER_ID,
    };

    const newTodoToShow = {
      ...newTodoToFetch,
      id: 0,
    };

    setIsTodoAdding(true);
    setTempTodo(newTodoToShow);

    try {
      const addedTodo = await addTodo(newTodoToFetch);

      setTodos(prevTodos => [...prevTodos, addedTodo]);
    } catch (error) {
      setErrorType('add');
    } finally {
      setIsTodoAdding(false);
      setTempTodo(null);
    }
  }, [title]);

  const deleteTodoFromServer = useCallback(async (todoId: number) => {
    setRemovingTodoIds(prevTodoIds => [...prevTodoIds, todoId]);

    try {
      await deleteTodo(todoId);

      const updatedTodos = todos.filter(todo => todo.id !== todoId);

      setTodos(updatedTodos);
    } catch (error) {
      setErrorType('delete');
    } finally {
      setRemovingTodoIds(prevTodoIds => prevTodoIds
        .filter((id) => id === todoId));
    }
  }, [todos]);

  useEffect(() => {
    getTodosFromServer();
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const clearCompletedTodos = async () => {
    const completedTodosIds = [...todos]
      .filter(todo => todo.completed)
      .map((todo) => todo.id);

    setRemovingTodoIds(completedTodosIds);

    Promise.all(completedTodosIds.map((id) => deleteTodo(id)))
      .then(() => {
        const activeTodos = todos
          .filter(todo => !todo.completed);

        setTodos(activeTodos);
      })
      .catch(() => {
        setErrorType('delete');
      })
      .finally(() => setRemovingTodoIds(prevTodoIds => prevTodoIds
        .filter((id) => !completedTodosIds.includes(id))));
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          title={title}
          setTitle={setTitle}
          onAdd={addTodoToServer}
          hasActive={hasActive}
          setErrorType={setErrorType}
          isTodoAdding={isTodoAdding}
        />
        {(!!todos.length || tempTodo) && (
          <>
            <TodoList
              tempTodo={tempTodo}
              todos={filteredTodos}
              removingTodoIds={removingTodoIds}
              deleteTodoFromServer={deleteTodoFromServer}
            />

            <Footer
              todos={todos}
              selectedFilter={selectedFilter}
              onChange={setSelectedFilter}
              clearCompletedTodos={clearCompletedTodos}
            />
          </>
        )}
      </div>

      {errorType ? (
        <ErrorNotification
          errorType={errorType}
        />
      ) : null}
    </div>
  );
};
