import { useEffect, useRef, useState } from 'react';
import * as servisesTodos from '../../api/todos';
import { Todo } from '../../types/Todo';

const userId = servisesTodos.USER_ID;

type Props = {
  setErrorMessage: (a: string) => void;
  todos: Todo[];
  setTodos: (a: Todo[]) => void;
  setTempTodo: (a: Todo[] | null) => void;
  tempTodo: Todo | null;
};

export const TodoInput: React.FC<Props> = ({
  setErrorMessage,
  todos,
  setTodos,
  setTempTodo,
  tempTodo,
}) => {
  const [title, setTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [todos, tempTodo]);

  const handleInputValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleAddTodo = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      setTempTodo({ id: 0, title: title.trim(), userId, completed: false });
      if (title.trim().length > 0) {
        servisesTodos
          .postTodos({ title: title.trim(), userId, completed: false })
          .then(newTodo => {
            setTodos([...todos, newTodo]);
            setTitle('');
            setTempTodo(null);
          })
          .catch(() => {
            setTempTodo(null);
            setErrorMessage('Unable to add a todo');
          });
      } else {
        setTempTodo(null);
        setErrorMessage('Title should not be empty');
      }
    }
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form onKeyDown={handleAddTodo}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          value={title}
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={handleInputValue}
          disabled={tempTodo}
        />
      </form>
    </header>
  );
};
