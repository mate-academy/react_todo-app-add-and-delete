import React, { FormEvent, useMemo, useState, useEffect } from 'react';
import cn from 'classnames';
import { Todo } from './types/Todo';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { getTodos } from './api/todos';
import { FooterPart } from './components/Footer';
import { ErrorMessage } from './components/errorsMessage';
import { Status } from './components/status';
import { createTodos, USER_ID } from './api/todos';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);

  const [todoTemplate, setTodoTempalte] = useState<Todo | null>(null);
  const [error, setError] = useState<ErrorMessage | ''>('');
  const [status, setStatus] = useState<Status>(Status.All);
  const [valueTitle, setValue] = useState<string>('');
  const [disableInput, setDisableInput] = useState(false);

  const uploadingTodos = useMemo(() => {
    setError(ErrorMessage.noError);

    getTodos()
      .then(setTodos)
      .catch(() => {
        setError(ErrorMessage.loadError);
        setTimeout(() => {
          setError(ErrorMessage.noError);
        }, 3000);
      })
      .finally();
  }, []);

  function deleteError() {
    setError(ErrorMessage.noError);
  }

  const addPost = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const getTrim = valueTitle.trim();

    if (!getTrim) {
      setValue('');
      setError(ErrorMessage.titleError);
      setTimeout(() => setError(ErrorMessage.noError), 3000);

      return false;
    }

    setDisableInput(true);
    setTodoTempalte({
      id: 0,
      completed: false,
      title: getTrim,
      userId: USER_ID,
    });
    todos.filter((todo: Todo) => !todo.completed);
    setTodos(currentTodos => [
      ...currentTodos,
      { id: 0, completed: false, title: getTrim, userId: USER_ID },
    ]);

    return createTodos({ completed: false, title: getTrim, userId: USER_ID })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setValue('');
      })
      .catch(() => {
        setError(ErrorMessage.addError);
        setTimeout(() => {
          setError(ErrorMessage.noError);
        }, 3000);
      })
      .finally(() => {
        setTodos(currentTodos => currentTodos.filter(todo => todo.id !== 0));
        setTodoTempalte(null);
        setDisableInput(false);
      });
  };

  const filterTodosByStatus = () => {
    switch (status) {
      case Status.Active:
        return todos.filter((todo: Todo) => !todo.completed);
      case Status.Completed:
        return todos.filter((todo: Todo) => todo.completed);
      default:
        return todos;
    }
  };

  const filteredTodos = filterTodosByStatus();

  useEffect(() => uploadingTodos);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          setIsInputLoading={todos.length}
          posts={todos}
          setTodoTemplate={setTodoTempalte}
          addPost={addPost}
          valueTitle={valueTitle}
          setValue={setValue}
          disableInput={disableInput}
        />
        <TodoList
          posts={filteredTodos}
          setTodos={setTodos}
          setErrorMessage={setError}
          todoTemplate={todoTemplate}
        />
        {todos.length > 0 && (
          <FooterPart
            posts={todos}
            filterStatus={setStatus}
            status={status}
            setTodos={setTodos}
            todoTemplate={todoTemplate}
            setErrorMessage={setError}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          {
            hidden: !error,
          },
        )}
      >
        <button
          data-cy="HideErrorButton"
          onClick={deleteError}
          type="button"
          className="delete"
        />
        {error}
      </div>
    </div>
  );
};
