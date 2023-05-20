import {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from 'react';
import { ErrorMessage } from './types/types/ErrorMessage';
import { UserWarning } from './UserWarning';
import {
  getTodos,
  postTodos,
  deleteTodo,
  patchTodo,
} from './api/todos';
import { Footer } from './components/Footer/Footer';
import { Todo } from './types/types/Todo';
import { ToDoList } from './components/ToDoList/ToDoList';
import { TodoStatus } from './types/types/TodoStatus';
import { ErrorNotification } from './components/ErrorMessage/ErrorNotification';

const USER_ID = 7035;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todoStatus, setTodoStatus] = useState(TodoStatus.ALL);
  const [errorMessage, setErrorMessage] = useState(ErrorMessage.NONE);
  const [tempoTodo, setTempTodo] = useState<Todo | null>(null);
  const [disabledInput, setDisabledInput] = useState(false);
  const [todoTitle, setTodoTitle] = useState('');
  const [processingTodosIds, setProcessingTodosIds] = useState<number[]>([]);

  const hasActiveTodo = todos.some((todo) => !todo.completed);
  const inputsRef = useRef<HTMLInputElement>(null);

  const visibleTodos = useMemo(() => {
    return (todos.filter((todo) => {
      switch (todoStatus) {
        case TodoStatus.ACTIVE:
          return !todo.completed;
        case TodoStatus.COMPLETED:
          return todo.completed;
        default:
          return true;
      }
    })
    );
  }, [todoStatus, todos]);

  useEffect(() => {
    const fetchData = async () => {
      const todosFromServer = await getTodos(USER_ID);

      try {
        setTodos(todosFromServer);
      } catch {
        setErrorMessage(ErrorMessage.LOAD);

        setTimeout(() => {
          setErrorMessage(ErrorMessage.NONE);
        }, 2000);
      }
    };

    fetchData();
  }, []);

  const handleChangeStatus = useCallback(
    async (todoID: number, data: Partial<Todo>) => {
      try {
        setProcessingTodosIds((prevIDs) => [...prevIDs, todoID]);

        const updatedTodo = await patchTodo(todoID, data);

        setTodos((prevTodos) => prevTodos.map((prevTodo) => {
          if (prevTodo.id === todoID) {
            return {
              ...prevTodo,
              ...updatedTodo,
            };
          }

          return prevTodo;
        }));
      } catch {
        setErrorMessage(ErrorMessage.UPDATE);
      } finally {
        setProcessingTodosIds([]);
      }
    }, [todos],
  );

  const handleChangeStatusAll = useCallback(async () => {
    const allTodosPromises = todos.map((todo) => {
      if ((hasActiveTodo && !todo.completed)
        || (!hasActiveTodo && todo.completed)) {
        setProcessingTodosIds((prev) => [...prev, todo.id]);
      }

      if (todos.every(task => task.completed)) {
        return patchTodo(todo.id, { completed: false });
      }

      return patchTodo(todo.id, { completed: true });
    });

    try {
      const updatedTodos = await Promise.all(allTodosPromises);

      setTodos(updatedTodos);
    } catch {
      setErrorMessage(ErrorMessage.UPDATE);
    } finally {
      setProcessingTodosIds([]);
    }
  }, [todos]);

  const createTodo = (title : string) => {
    if (!title.trim().length) {
      setErrorMessage(ErrorMessage.TITLE);
    } else {
      const NewTodo = {
        title,
        userId: USER_ID,
        completed: false,
      };

      setTempTodo({ ...NewTodo, id: 0 });
      setDisabledInput(true);
      setProcessingTodosIds((prevIds) => [...prevIds, 0]);

      postTodos(USER_ID, NewTodo)
        .then(result => {
          setTodos(prevTodos => {
            return [...prevTodos, result];
          });
        })
        .catch(() => {
          setErrorMessage(ErrorMessage.ADD);
        })
        .finally(() => {
          setTempTodo(null);
          setTodoTitle('');
          setDisabledInput(false);
          setProcessingTodosIds([]);
        });
    }
  };

  const handleDeleteTodo = useCallback(async (todoId: number) => {
    setProcessingTodosIds((prev) => [...prev, todoId]);

    try {
      await deleteTodo(USER_ID, todoId);
      setTodos(await getTodos(USER_ID));
    } catch {
      setErrorMessage(ErrorMessage.DELETE);
    } finally {
      setProcessingTodosIds([]);
    }
  }, []);

  const clearCompleted = () => {
    const completed = todos.filter(todo => todo.completed);

    completed
      .forEach((todo) => setProcessingTodosIds((prev) => [...prev, todo.id]));

    completed.forEach(todo => {
      deleteTodo(USER_ID, todo.id)
        .then(() => {
          setTodos(todos.filter(task => !task.completed));
        })
        .catch(() => {
          setErrorMessage(ErrorMessage.DELETE);
        })
        .finally(() => {
          setProcessingTodosIds([]);
        });
    });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos && (
            <button
              type="button"
              className="todoapp__toggle-all active"
              aria-label="button"
              onClick={handleChangeStatusAll}
            />
          )}
          <form onSubmit={(e) => {
            e.preventDefault();
            createTodo(todoTitle);
          }}
          >
            <input
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={todoTitle}
              onChange={(event) => setTodoTitle(event.target.value)}
              disabled={disabledInput}
              ref={inputsRef}
            />
          </form>
        </header>
        <section className="todoapp__main">
          <ToDoList
            todos={visibleTodos}
            deleteTodo={handleDeleteTodo}
            tempoTodo={tempoTodo}
            processingTodosIds={processingTodosIds}
            updateTodo={handleChangeStatus}
          />
        </section>
        {todos && (
          <Footer
            todos={todos}
            setTodoStatus={setTodoStatus}
            todoStatus={todoStatus}
            handleDeleteTodo={clearCompleted}
          />
        )}
      </div>
      <ErrorNotification
        errorMessage={errorMessage}
        closeError={() => setErrorMessage(ErrorMessage.NONE)}
      />
    </div>
  );
};
