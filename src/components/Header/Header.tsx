import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import { Errors } from '../../types/Errors';
import { USER_ID, addTodo } from '../../api/todos';

type Props = {
  setTempTodo: (todo: Todo | null) => void;
  setErrorMessage: (error: string) => void;
  handleAddTodoToState: (todo: Todo) => void;
  todosToBeDeleted: number[];
};

const Header: React.FC<Props> = ({
  setTempTodo,
  setErrorMessage,
  handleAddTodoToState,
  todosToBeDeleted,
}) => {
  const [title, setTitle] = useState('');
  const [inputDisabled, setInputDisabled] = useState(false);

  const inputField = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const onAddTodo = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim()) {
      setErrorMessage(Errors.EmptyTitle);

      return;
    }

    try {
      const tempTodo = {
        id: 0,
        userId: USER_ID,
        title: title.trim(),
        completed: false,
      };

      const newTodo = {
        userId: USER_ID,
        title: title.trim(),
        completed: false,
      };

      setTempTodo(tempTodo);
      setInputDisabled(true);

      const result = await addTodo(newTodo);

      handleAddTodoToState(result);

      setTitle('');
    } catch (error) {
      setErrorMessage('Unable to add a todo');
    } finally {
      setTempTodo(null);
      setInputDisabled(false);
      setTimeout(() => {
        if (inputField.current) {
          inputField.current.focus();
        }
      }, 0);
    }
  };

  useEffect(() => {
    if (inputField.current) {
      inputField.current.focus();
    }
  }, [todosToBeDeleted]);

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      <form onSubmit={onAddTodo}>
        <input
          disabled={inputDisabled}
          ref={inputField}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={handleChange}
        />
      </form>
    </header>
  );
};

export default Header;
