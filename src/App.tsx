/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useEffect,
  useState,
  useMemo,
  ChangeEvent,
  FormEvent,
} from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import { Todo, StatusToFilter } from './types/Todo';
import { addTodo, getTodos, deleteTodo } from './api/todos';
import { TodoList } from './components/TodoList/TodoList';
import { TodoFilter } from './components/TodoFilter/TodoFilter';
import { getFilteredTodos } from './helper/GetFilteredTodos';
import { Loader } from './components/Loader/Loader';

const USER_ID = 7009;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorDescription, setErrorDescription] = useState('');
  const [isListLoading, setIsListLoading] = useState(true);
  const [statusToFilter, setStatusToFilter] = useState(StatusToFilter.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [inputStatus, setInputStatus] = useState(false);
  const [userText, setUserText] = useState('');
  const [loadingIds, setLoadingIds] = useState<number[]>([]);
  const [amountOfActiveTodos, amoutOfCompletedTodos] = useMemo(
    () => [
      todos.filter(({ completed }) => !completed).length,
      todos.filter(({ completed }) => completed).length,
    ],
    [todos],
  );

  const getTodosFromServer = async () => {
    try {
      const todosFromServer = await getTodos(USER_ID);

      setTodos(todosFromServer);
    } catch {
      setErrorDescription('Unable to load todos');
    } finally {
      setIsListLoading(false);
    }
  };

  const addNewTodo = async (title: string) => {
    setInputStatus(true);

    const newTodo = {
      title,
      userId: USER_ID,
      completed: false,
    };

    if (title.trim() === '') {
      setErrorDescription('Title cant be empty');
      setInputStatus(false);
      setUserText('');

      return;
    }

    setTempTodo({ ...newTodo, id: 0 });

    try {
      const newTempTodo = await addTodo(newTodo);

      setTodos(prev => ([...prev, newTempTodo]));
    } catch {
      setErrorDescription('Unable to add a todo');
    } finally {
      setInputStatus(false);
      setTempTodo(null);
      setUserText('');
    }
  };

  const deleteTodoById = async (id: number) => {
    try {
      setLoadingIds(state => [...state, id]);
      await deleteTodo(id);
      setTodos(todos.filter(todo => todo.id !== id));
    } catch {
      setErrorDescription('Unable to delete a todo');
      setTimeout(() => {
        setErrorDescription('');
      }, 3000);
    } finally {
      setLoadingIds([]);
    }
  };

  const clearCompletedTodos = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.forEach(todo => {
      deleteTodo(todo.id)
        .then(() => {
          setTodos(todos.filter(todoItem => !todoItem.completed));
        })
        .catch(() => {
          setErrorDescription('Unable to delete todos');
        });
    });
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    addNewTodo(userText);
    setUserText('');
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUserText(event.target.value);
  };

  useEffect(() => {
    setErrorDescription('');
    getTodosFromServer();
    setTimeout(() => setErrorDescription(''), 3000);
  }, []);

  const visibleTodos = getFilteredTodos(statusToFilter, todos);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className="todoapp__toggle-all active"
          />

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={userText}
              onChange={handleChange}
              disabled={inputStatus}
            />
          </form>
        </header>

        <section className="todoapp__main">
          {isListLoading ? (
            <Loader />
          ) : (
            <TodoList
              todos={visibleTodos}
              tempTodo={tempTodo}
              onDelete={deleteTodoById}
              loadingIds={loadingIds}
            />
          )}
        </section>

        {todos && (
          <TodoFilter
            statusToFilter={statusToFilter}
            setStatusToFilter={setStatusToFilter}
            amountOfActiveTodos={amountOfActiveTodos}
            onClearCompleted={clearCompletedTodos}
            amoutOfCompletedTodos={amoutOfCompletedTodos}
          />
        )}
      </div>

      <div
        className={classNames(
          'notification',
          'is-danger',
          'has-text-weight-normal',
          'is-light',
          {
            hidden: !errorDescription,
          },
        )}
      >
        <button
          type="button"
          className="delete"
          onClick={() => setErrorDescription('')}
        />
        {errorDescription}
      </div>
    </div>
  );
};
