/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { deleteTodo, getTodos, postTodo } from './api/todos';
import { Todo } from './types/Todo';
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
  const [titleError, setTitleError] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isloadingId, setIsloadingId] = useState(0);

  const handleFilterTodos = useCallback((userFilter: FilterBy) => {
    setFilterTodos(userFilter);
  }, []);

  const handleCloseError = useCallback(() => {
    setTitleError('');
  }, []);

  const handleError = useCallback((titleToError: string) => {
    setTitleError(titleToError);

    setTimeout(() => setTitleError(''), 3000);
  }, []);

  const getTodosFromServer = async () => {
    try {
      const todosFromServer = await getTodos(USER_ID);

      setTodos(todosFromServer);
    } catch {
      handleError('Unable to connect to server');
    }
  };

  const postTodoToServer = async (todoTitle: string) => {
    const newTodo = {
      id: 0,
      userId: USER_ID,
      title: todoTitle,
      completed: false,
    };

    setTempTodo(newTodo);

    try {
      await postTodo(USER_ID, newTodo);
    } catch {
      handleError('Unable to add new todo');
    }

    setTempTodo(null);
  };

  const deleteTodoFromServer = async (todoId: number) => {
    setIsloadingId(todoId);

    try {
      await deleteTodo(todoId);
    } catch {
      handleError('Unable to delete todo');
    }

    setIsloadingId(0);
  };

  const handleAddTodo = useCallback(async (todoTitle: string) => {
    await postTodoToServer(todoTitle);

    getTodosFromServer();
  }, []);

  const handleDeleteTodo = useCallback(async (todoId: number) => {
    await deleteTodoFromServer(todoId);

    getTodosFromServer();
  }, []);

  const handleDeleteCompletedTodo = useCallback(async () => {
    try {
      await Promise.all(
        todos
          .filter(({ completed }) => completed)
          .map(({ id }) => deleteTodoFromServer(id)),
      );
    } catch {
      handleError('Unable to delete todos');
    }

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
          onSubmit={handleAddTodo}
          onError={handleError}
        />

        <TodoList
          todos={prepareTodos}
          tempTodo={tempTodo}
          isloadingId={isloadingId}
          onDelete={handleDeleteTodo}
        />
        {!!todos.length && (
          <Footer
            filterTodos={filterTodos}
            todos={todos}
            onSelect={handleFilterTodos}
            onDeleteCompleted={handleDeleteCompletedTodo}
          />
        )}
      </div>

      <Error
        error={titleError}
        onClose={handleCloseError}
      />
    </div>
  );
};
