/* eslint-disable jsx-a11y/control-has-associated-label */
import {
  FC,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  USER_ID as id,
  getTodos,
  postTodo,
  deleteTodo,
} from './api/todos';
import Footer from './Components/Footer/Footer';
import Header from './Components/Header/Header';
import TodoList from './Components/TodoList/TodoList';
import Notification from './Components/Notification/Notification';
import Loader from './Components/Loader/Loader';
import { Todo } from './types/Todo';
import { Error, ErrorMessage } from './types/Error';
import { FilterType } from './types/FilterType';
import { filterTodoList, getMountCompletedTodos } from './utils/filterTodoList';

export const App: FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [amountCompletedTodos, setAmountCompletedTodos] = useState(0);
  const [error, setError] = useState<Error>({
    status: false,
    message: ErrorMessage.NONE,
  });
  const [isLoader, setIsLoader] = useState(true);
  const [filterTodosBy, setFilterTodos] = useState(FilterType.All);

  const [isDisabledAddingForm, setIsDisabledAddingForm] = useState(false);
  const [isAddingTodo, setIsAddingTodo] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [deleteTodosId, setDeleteTodosId] = useState<number[] | null>(null);

  const visibleTodoList = useMemo(() => (
    filterTodoList(todos, filterTodosBy)
  ), [todos, filterTodosBy]);

  const fetchTodos = async () => {
    try {
      const todosFromServer = await getTodos(id);

      setTodos(todosFromServer);
      setAmountCompletedTodos(getMountCompletedTodos(todosFromServer));

      if (!todosFromServer.length) {
        setError({
          status: true,
          message: ErrorMessage.LOAD,
        });
      }
    } catch {
      setError({
        status: true,
        message: ErrorMessage.LOAD,
      });
    } finally {
      setIsLoader(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const addNewTodo = async (todo: string) => {
    setIsDisabledAddingForm(true);
    setError({
      status: false,
      message: ErrorMessage.NONE,
    });
    setIsAddingTodo(true);

    setTempTodo({
      id: Date.now(),
      userId: id,
      title: todo,
      completed: false,
    });

    try {
      const post = await postTodo(id, {
        title: todo,
        userId: id,
        completed: false,
      });

      if (post) {
        setTodos([...todos, post]);
      }
    } catch {
      setError({
        status: true,
        message: ErrorMessage.ADD,
      });
    } finally {
      setIsDisabledAddingForm(false);
      setIsAddingTodo(false);
      setTempTodo(null);
    }
  };

  const deleteTodoPromise = (idTodo: number) => (
    new Promise((response, reject) => {
      deleteTodo(id, idTodo)
        .then(() => {
          response(idTodo);
        })
        .catch(() => {
          reject();
        });
    })
  );

  const deleteArrayTodos = (deleteTodos: number[]) => {
    setError({
      status: false,
      message: ErrorMessage.NONE,
    });
    const arrayPromises: Promise<unknown>[] = [];

    setDeleteTodosId(deleteTodos);
    deleteTodos.forEach(idDell => {
      arrayPromises.push(deleteTodoPromise(idDell));
    });

    Promise.all(arrayPromises)
      .then(idWilDeletedTodos => {
        setTodos(todos.filter(todo => !idWilDeletedTodos.includes(todo.id)));
      })
      .catch(() => setError({
        status: true,
        message: ErrorMessage.DELETE,
      }))
      .finally(() => setDeleteTodosId(null));
  };

  const deleteTodoFromList = async (idTodo: number) => {
    deleteArrayTodos([idTodo]);
  };

  const deleteAllCompletedTodos = () => {
    const deleteTodos = todos
      .filter(({ completed }) => completed)
      .map(todo => todo.id);

    deleteArrayTodos(deleteTodos);
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          onEmptyForm={setError}
          isDisabled={isDisabledAddingForm}
          onAdd={addNewTodo}
          statusPost={isAddingTodo}
        />

        {isLoader ? (
          <Loader />
        ) : (
          <TodoList
            todos={visibleTodoList}
            addTodo={tempTodo}
            isAdd={isAddingTodo}
            deleteTodosId={deleteTodosId}
            onDelete={deleteTodoFromList}
          />
        )}

        {!todos.length || (
          <Footer
            amountCompletedTodos={amountCompletedTodos}
            todosLength={todos.length}
            filterType={filterTodosBy}
            setFilterType={setFilterTodos}
            onClear={deleteAllCompletedTodos}
          />
        )}
      </div>

      {error.status && (
        <Notification
          errorMessage={error.message}
          closeError={setError}
        />
      )}
    </div>
  );
};
