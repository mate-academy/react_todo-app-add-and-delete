import { useRef } from 'react';
import { useEffect } from 'react';
import { useContext } from 'react';
import { useState } from 'react';
import { addTodo, USER_ID } from '../../api/todos';
import { Todo } from '../../types/Todo';
import { TodoContext } from '../../store/TodoContext';
import { ErrorContext } from '../../store/ErrorContext';

type Props = {
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
};

export const Header: React.FC<Props> = ({ setTempTodo }) => {
  const { showError } = useContext(ErrorContext);
  const { todos, setTodos } = useContext(TodoContext);
  const [newTodo, setNewTodo] = useState<string>('');
  const [disabled, setDisabled] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const sendTodo = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedTodo = newTodo.trim();

    if (!trimmedTodo) {
      showError('Title should not be empty');

      return;
    }

    const data = {
      title: trimmedTodo,
      userId: USER_ID,
      completed: false,
    };

    setTempTodo({ ...data, id: 0 });

    try {
      setDisabled(true);
      inputRef.current?.blur();
      const response = await addTodo(data);

      if (!response) {
        throw new Error('Error 400');
      }

      setNewTodo('');
      setTodos(prev => [...prev, response]);
    } catch (err) {
      showError('Unable to add a todo');
    } finally {
      setTempTodo(null);
      setDisabled(false);
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [todos]);

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={sendTodo}>
        <input
          disabled={disabled}
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodo}
          onChange={event => setNewTodo(event.target.value)}
        />
      </form>
    </header>
  );
};
