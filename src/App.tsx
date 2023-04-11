/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useState, useEffect, useMemo, useCallback, ChangeEvent, FormEvent,
} from 'react';
import classNames from 'classnames';

import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { getTodos, addTodo, deleteTodo } from './api/todos';
import { Loader } from './component/Loader/Loader';
import { TodoList } from './component/TodoList/TodoList';
import { Footer } from './component/Footer/Footer';
import { LoadType } from './types/LoadType';

const USER_ID = 6908;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [typeOfLoad, setTypeOfLoad] = useState<LoadType>(LoadType.All);
  const [isLoading, setIsLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [disableInput, setDisableInput] = useState(false);
  const [text, setText] = useState('');

  const getTodosFromServer = async (userId: number) => {
    try {
      setIsLoading(true);
      const getTodo = await getTodos(userId);

      setTodos(getTodo);
    } catch {
      setErrorMessage('Unable to load todos');
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const addNewTodo = useCallback(async (title: string) => {
    if (!title.trim()) {
      return 'Unable to add a todo';
    }

    setDisableInput(true);

    const newTodo = {
      id: 0,
      title,
      userId: USER_ID,
      completed: false,
    };

    try {
      setErrorMessage('');
      setTempTodo(newTodo);
      const newTempTodo = await addTodo(newTodo);

      setTodos(prev => ([
        ...prev,
        newTempTodo,
      ]));
    } catch {
      setErrorMessage('Unable to add a todo');
    } finally {
      setDisableInput(false);
      setTempTodo(null);
    }

    return setDisableInput(false);
  }, []);

  const deleteTodoById = useCallback(async (id: number) => {
    try {
      await deleteTodo(id);
    } catch {
      setErrorMessage('Unable to delete a todo');
    }

    setTodos(prev => prev.filter(todo => todo.id !== id));
  }, []);

  useEffect(() => {
    getTodosFromServer(USER_ID);
  }, []);

  const activeTodos = useMemo(() => {
    return todos.filter(({ completed }) => !completed).length;
  }, [todos]);

  const close = () => {
    setErrorMessage('');
  };

  const deleteCompleted = useCallback(async () => {
    const onlyCompleted = todos.filter(todo => todo.completed);

    onlyCompleted.forEach(todo => {
      if (todo.completed) {
        deleteTodo(todo.id);
      }
    });
  }, [todos]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    addNewTodo(text);
    setText('');
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button type="button" className="todoapp__toggle-all active" />

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={text}
              onChange={handleChange}
              disabled={disableInput}
            />
          </form>
        </header>

        {isLoading && (

          <Loader />
        )}

        {todos.length > 0 && (
          <>
            <TodoList
              todos={todos}
              typeOfLoad={typeOfLoad}
              tempTodo={tempTodo}
              onDelete={deleteTodoById}
            />

            <Footer
              typeOfLoad={typeOfLoad}
              setTypeOfLoad={setTypeOfLoad}
              activeTodos={activeTodos}
              completedTodos={todos.length - activeTodos}
              onDeleteCompleted={deleteCompleted}
            />
          </>
        )}

      </div>

      <div className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !errorMessage },
      )}
      >
        <button
          type="button"
          className="delete"
          onClick={close}
        />

        {`Unable to ${errorMessage} a todo`}
      </div>
    </div>
  );
};
