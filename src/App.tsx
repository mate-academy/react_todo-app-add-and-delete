import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from './types/Todo';
import * as helpers from './api/todos';
import { Status } from './types/status';
import { Emessage } from './types/Emessage';
import { Header } from './Header';
import { TodoList } from './TodoList';
import { Footer } from './Footer';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [queryStatus, setQueryStatus] = useState(Status.all);
  const [isLoading, setIsLoading] = useState(false);
  const [errMessage, setErrMessage] = useState(Emessage.null);
  const inputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [inputText, setInputText] = useState('');
  const [deletedIds, setDeletedIds] = useState<number[]>([]);
  const [inputDisabled, setInputDisabled] = useState(false);

  const closingErrMessage = () => {
    setErrMessage(Emessage.null);
  };

  const handleErrMessage = (message: Emessage) => {
    setErrMessage(message);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      closingErrMessage();
    }, 3000);
  };

  const presentInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  useEffect(() => {
    presentInput();
    setIsLoading(true);

    helpers
      .getTodos()
      .then(setTodos)
      .catch(() => handleErrMessage(Emessage.load))
      .finally(() => setIsLoading(false));

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCheck = (id: number) => {
    setTodos(existingTodos =>
      existingTodos?.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  const onInputChange = (value: string) => {
    setInputText(value);
  };

  const todosByStatus = (query = queryStatus) => {
    return todos?.filter(todo => {
      switch (query) {
        case Status.completed:
          return todo.completed;

        case Status.active:
          return !todo.completed;

        case Status.all:
          return todo;
      }
    });
  };

  const addTodo = () => {
    const newTodo: Omit<Todo, 'id'> = {
      userId: 837,
      title: inputText.trim(),
      completed: false,
    };

    setInputDisabled(true);
    setTempTodo({ id: 0, ...newTodo });

    helpers
      .addTodo(newTodo)
      .then(todoFromServer => {
        setTodos(currentTodos => [...currentTodos, todoFromServer]);
        setTempTodo(null);
        onInputChange('');
      })
      .catch(() => handleErrMessage(Emessage.add))
      .finally(() => {
        setTempTodo(null);
        setInputDisabled(false);
        setTimeout(() => {
          presentInput();
        }, 0);
      });
  };

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!inputText.trim()) {
      handleErrMessage(Emessage.title);

      return;
    }

    addTodo();
  };

  const deleteTodo = (id: number) => {
    setDeletedIds(presentState => [...presentState, id]);

    helpers
      .deleteTodo(id)
      .then(() => {
        setTodos(presentTodos => presentTodos.filter(todo => todo.id !== id));
      })
      .catch(() => {
        handleErrMessage(Emessage.delete);
      })
      .finally(() => {
        setDeletedIds([]);

        setTimeout(() => {
          presentInput();
        }, 0);
      });
  };

  const hasCompletedTodos = () => {
    return todos.some(todo => todo.completed);
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          inputRef={inputRef}
          submitHandler={submitHandler}
          inputText={inputText}
          onInputChange={onInputChange}
          inputDisabled={inputDisabled}
        />

        {!isLoading && (
          <TodoList
            todosByStatus={todosByStatus}
            handleCheck={handleCheck}
            queryStatus={queryStatus}
            deleteTodo={deleteTodo}
            deletedIds={deletedIds}
            tempTodo={tempTodo}
          />
        )}

        {!!todos.length && (
          <Footer
            todosByStatus={todosByStatus}
            queryStatus={queryStatus}
            setQueryStatus={setQueryStatus}
            hasCompletedTodos={hasCompletedTodos}
            deleteTodo={deleteTodo}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          {
            hidden: errMessage === Emessage.null,
          },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={closingErrMessage}
        />
        {/* show only one message at a time */}
        {errMessage}
      </div>
    </div>
  );
};
