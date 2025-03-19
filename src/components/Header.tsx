import React, { FormEventHandler, useEffect, useRef, useState } from 'react';
import { addTodo, USER_ID } from '../api/todos';
import { Todo } from '../types/Todo';

type Props = {
  setErrorMessage: (arg: string) => void;
  setAllTodos: (arg: Todo[]) => void;
  allTodos: Todo[];
  setLoadingTodo: (arg: boolean) => void;
  setLoadingTodoId: (arg: number) => void;
};

export const Header: React.FC<Props> = ({
  setErrorMessage,
  setAllTodos,
  allTodos,
  setLoadingTodo,
  setLoadingTodoId,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [disabled, setDisabled] = useState(false);
  const inputFocus = useRef<HTMLInputElement>(null);

  const handleSubmit: FormEventHandler<HTMLFormElement> = event => {
    event.preventDefault();
    if (inputValue.trim().length === 0) {
      setErrorMessage('Title should not be empty');

      return;
    } else {
      const newTodo: Omit<Todo, 'id' | 'completed'> = {
        userId: USER_ID,
        title: inputValue.trim(),
      };
      const tempTodo: Todo = {
        id: Date.now(),
        userId: USER_ID,
        title: inputValue.trim(),
        completed: false,
      };

      setDisabled(true);
      setLoadingTodo(true);
      setLoadingTodoId(tempTodo.id);
      setAllTodos([...allTodos, tempTodo]);

      addTodo(newTodo)
        .then((newTodoFromServer: Todo) => {
          const todos = allTodos.slice(0, allTodos.length);

          setAllTodos([...todos, newTodoFromServer]);
          setLoadingTodo(false);
          setLoadingTodoId(-1);
          setDisabled(false);
          setInputValue('');
        })
        .catch(() => {
          setErrorMessage('Unable to add a todo');
          setAllTodos(allTodos.slice(0, allTodos.length));
          setDisabled(false);
        });
    }
  };

  useEffect(() => {
    if (inputFocus.current) {
      inputFocus.current.focus();
    }
  }, [allTodos]);

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      <form onSubmit={handleSubmit}>
        <input
          ref={inputFocus}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          disabled={disabled}
        />
      </form>
    </header>
  );
};
