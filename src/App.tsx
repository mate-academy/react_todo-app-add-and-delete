/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { deleteTodo, getTodos, postTodo } from './api/todos';
import { Todo, TodoData } from './types/Todo';
import { TodoList } from './component/TodoList';
import { Footer } from './component/Footer';
import { Error } from './component/Error';
import { FilterBy } from './types/typedefs';
import { getTodosByFilter } from './helpers';
import { Header } from './component/Header';

const USER_ID = 10363;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterTodos, setFilterTodos] = useState(FilterBy.ALL);
  const [isError, setIsError] = useState(false);
  const [titleError, setTitleError] = useState('');

  const handleFilterTodos = useCallback((userFilter: FilterBy) => {
    setFilterTodos(userFilter);
  }, []);

  const handleCloseError = useCallback(() => {
    setIsError(false);
    setTitleError('');
  }, []);

  const handleError = useCallback((titleToError: string) => {
    setIsError(true);
    setTitleError(titleToError);
  }, []);

  const getTodosFromServer = async () => {
    try {
      const todosFromServer = await getTodos(USER_ID);

      setTodos(todosFromServer);
    } catch {
      handleError('Unable to connect to server');
    }
  };

  const postTodoToServer = async (todoData: TodoData) => {
    const tempTodo = {
      ...todoData,
      id: 0,
    };

    setTodos(prevTodos => ([...prevTodos, tempTodo]));

    try {
      await postTodo(USER_ID, todoData);
    } catch {
      handleError('Unable to add new todo');
    }
  };

  const deleteTodoFromServer = async (todoId: number) => {
    try {
      await deleteTodo(todoId);
    } catch {
      handleError('Unable to delete todo');
    }
  };

  const handleAddTodo = useCallback(async (todoData: TodoData) => {
    await postTodoToServer(todoData);

    getTodosFromServer();
  }, []);

  const handleDeleteTodo = useCallback(async (todoId: number) => {
    await deleteTodoFromServer(todoId);

    getTodosFromServer();
  }, []);

  const handleDeleteCompletedTodo = useCallback(async () => {
    const completedTodos = todos.filter(({ completed }) => completed);

    completedTodos.map(({ id }) => deleteTodoFromServer(id));

    getTodosFromServer();
  }, [todos]);

  const prepareTodos = useMemo(() => {
    let visibleTodos = [...todos];

    if (filterTodos) {
      visibleTodos = getTodosByFilter(visibleTodos, filterTodos);
    }

    return visibleTodos;
  }, [filterTodos, todos]);

  useEffect(() => {
    getTodosFromServer();
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          userId={USER_ID}
          onSubmit={handleAddTodo}
          onError={handleError}
        />

        <TodoList
          todos={prepareTodos}
          onDelete={handleDeleteTodo}
        />

        <Footer
          filterTodos={filterTodos}
          todos={todos}
          onSelect={handleFilterTodos}
          onDeleteCompleted={handleDeleteCompletedTodo}
        />

      </div>

      <Error
        isError={isError}
        titleError={titleError}
        closeError={handleCloseError}
      />
    </div>
  );
};
