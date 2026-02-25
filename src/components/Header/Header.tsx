import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';
import { handleError } from '../../services/ErrorHandling';
import { ErrorType } from '../../types/Error';
import * as todosServices from '../../api/todos';

interface Props {
  todosList: Todo[];
  todosCounter: number;
  activeTodo: Todo[];
  completeAll: () => void;
  setTodosList: React.Dispatch<React.SetStateAction<Todo[]>>;
  setErrorType: React.Dispatch<React.SetStateAction<ErrorType | null>>;
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
  setActiveTodo: React.Dispatch<React.SetStateAction<Todo[]>>;
}

export const Header: React.FC<Props> = ({
  todosList,
  todosCounter,
  activeTodo,
  completeAll,
  setTodosList,
  setErrorType,
  setTempTodo,
  setActiveTodo,
}) => {
  const [title, setTitle] = useState('');
  const inputField = useRef<HTMLInputElement | null>(null);

  const onSuccess = () => {
    setTitle('');
    setActiveTodo([]);
  };

  const handleTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const addTodos = (event: React.FormEvent<HTMLFormElement>) => {
    handleError(setErrorType, null);
    event.preventDefault();

    if (title.trim() === '') {
      handleError(setErrorType, { type: 'empty', time: Date.now() });

      return;
    }

    const newTodo: Omit<Todo, 'id'> = {
      userId: todosServices.USER_ID,
      title: title.trim(),
      completed: false,
    };

    const temp = { id: 0, ...newTodo };

    const request = todosServices.addTodos(newTodo);

    setTempTodo(temp);
    setActiveTodo([temp]);

    request
      .then((createdTodo: Todo) => {
        setTodosList(prev => [...prev, createdTodo]);
        onSuccess();
      })
      .catch((error: Error) => {
        handleError(setErrorType, { type: 'add', time: Date.now() });
        setActiveTodo([]);
        throw error;
      })
      .finally(() => {
        setTempTodo(null);
      });
  };

  useEffect(() => {
    if (inputField.current) {
      inputField.current.focus();
    }
  }, [todosList, activeTodo]);

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      {todosList.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: todosCounter === 0,
          })}
          data-cy="ToggleAllButton"
          onClick={completeAll}
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={addTodos}>
        <input
          ref={inputField}
          disabled={activeTodo.length > 0}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={handleTitle}
        />
      </form>
    </header>
  );
};
