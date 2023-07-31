import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { addTodo, deleteTodo, getTodos } from './api/todos';
import { Footer } from './components/Footer/Footer';
import { ErrorType } from './types/ErrorType';
import { SortType } from './types/SortType';
import { Header } from './components/Header';
import { ErrorMessage } from './components/ErrorMessage/ErrorMessage';
import { TodoList } from './components/TodoList';

const USER_ID = 11229;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [sort, setSort] = useState(SortType.ALL);
  const [error, setError] = useState(ErrorType.NONE);
  const [onDeleteIds, setOnDeleteIds] = useState<number[] | null>(null);

  useEffect(() => {
    setError(ErrorType.NONE);
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setError(ErrorType.LOAD);
      });
  }, []);

  const preparedTodos = useMemo(() => {
    let sortedTodos = [];

    switch (sort) {
      case SortType.ALL:
        sortedTodos = [...todos];
        break;

      case SortType.ACTIVE:
        sortedTodos = todos.filter(todo => !todo.completed);
        break;

      case SortType.COMPLETED:
        sortedTodos = todos.filter(todo => todo.completed);
        break;

      default:
        throw new Error('Wrong sort type');
    }

    return sortedTodos;
  }, [todos, sort]);

  const addNewTodo = useCallback((
    title: string,
  ) => {
    const addedTodo: Omit<Todo, 'id'> = {
      userId: USER_ID,
      title,
      completed: false,
    };

    setTempTodo({
      id: 0,
      ...addedTodo,
    });

    return addTodo(USER_ID, {
      ...addedTodo,
    })
      .then(todo => {
        setTodos(prevTodos => [...prevTodos, todo]);
      })
      .catch(() => {
        setError(ErrorType.ADD);
      });
  }, [todos]);

  const deleteCurrentTodo = useCallback((todoId: number) => {
    return deleteTodo(todoId)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        setError(ErrorType.DELETE);
      });
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          preparedTodos={preparedTodos}
          setError={setError}
          addNewTodo={addNewTodo}
          setTempTodo={setTempTodo}
        />

        <TodoList
          preparedTodos={preparedTodos}
          tempTodo={tempTodo}
          deleteCurrentTodo={deleteCurrentTodo}
          onDeleteIds={onDeleteIds}
          setOnDeleteIds={setOnDeleteIds}
        />

        {!!todos.length && (
          <Footer
            todos={todos}
            preparedTodos={preparedTodos}
            sort={sort}
            setSort={setSort}
            setOnDeleteIds={setOnDeleteIds}
            deleteTodo={deleteCurrentTodo}
          />
        )}
      </div>

      <ErrorMessage error={error} setError={setError} />
    </div>
  );
};
