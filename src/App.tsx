/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';

import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { createTodo, getTodos, deleteTodo } from './api/todos';
import { Footer } from './components/Footer/Footer';
import { Header } from './components/Header/Header';
import { Main } from './components/Main/Main';
import { ErrorMessages } from './components/ErrorMessages/ErrorMessages';
import { ErrorTypes } from './types/ErrorTypes';
import { StatusTypes } from './types/StatusTypes';

const USER_ID = 10548;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState(StatusTypes.all);
  const [disableInput, setDisableInput] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>();
  const [typeError, setTypeError] = useState(ErrorTypes.default);
  const [indexUpdatedTodo, setIndexUpdatedTodo] = useState(0);

  const getVisibleTodos = (statusTodo: StatusTypes, todosArr: Todo[]) => {
    switch (statusTodo) {
      case StatusTypes.active:
        return [...todosArr].filter(todo => !todo.completed);
      case StatusTypes.completed:
        return [...todosArr].filter(todo => todo.completed);
      default:
        return [...todosArr];
    }
  };

  const visibleTodos = getVisibleTodos(status, todos);

  async function loadedTodos() {
    try {
      const result = await getTodos(USER_ID);

      setTodos(result);
      setTypeError(ErrorTypes.default);
    } catch (error) {
      setTypeError(ErrorTypes.ErrorGet);
    }
  }

  (function handleTempTodo() {
    if (tempTodo) {
      visibleTodos.splice(indexUpdatedTodo, 1, tempTodo);
    }
  }());

  const handleChangeInput = (event : React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const handleAddTodo = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIndexUpdatedTodo(todos.length);
    setDisableInput(true);
    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: input,
      completed: false,
    });

    setInput('');
    try {
      await createTodo(USER_ID, {
        title: input,
        userId: USER_ID,
        completed: false,
      });

      await loadedTodos();
      setTempTodo(null);
      setDisableInput(false);
      setIndexUpdatedTodo(0);
      setTypeError(ErrorTypes.default);
    } catch (error) {
      setTypeError(ErrorTypes.ErrorPost);
      setTempTodo(null);
      setDisableInput(false);
    }
  };

  const handleRemoveTodo = async (todo: Todo, indexTodo: number) => {
    setIndexUpdatedTodo(indexTodo);
    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: todo.title,
      completed: todo.completed,
    });

    try {
      await deleteTodo(todo.id);
      setTempTodo(null);
      setTodos(prev => prev.filter(({ id }) => id !== todo.id));
      setTypeError(ErrorTypes.default);
    } catch (error) {
      setTypeError(ErrorTypes.ErrorDelete);
      setTempTodo(null);
    }
  };

  const itemsLeftCount = todos.filter(todo => !todo.completed).length;

  useEffect(() => {
    loadedTodos();
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          countActiveTodo={itemsLeftCount}
          inputValue={input}
          onHandleInput={handleChangeInput}
          onHandleAddTodo={handleAddTodo}
          disabeled={disableInput}
        />

        <Main
          visibleTodos={visibleTodos}
          onRemoveTodo={handleRemoveTodo}
          tempTodo={tempTodo}
          indexUpdatedTodo={indexUpdatedTodo}
        />

        {!!todos.length && (
          <Footer
            selectedStatus={status}
            setStatus={setStatus}
            itemsLeftCount={itemsLeftCount}
          />
        )}

      </div>

      {typeError !== ErrorTypes.default
        && (
          <ErrorMessages
            typeError={typeError}
            setTypeError={setTypeError}
          />
        )}
    </div>
  );
};
