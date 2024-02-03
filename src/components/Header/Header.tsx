/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { TodoUpdateContext, TodosContext } from '../../context/TodosContext';
// import { Todo } from '../../types/Todo';
// import { ErrorNotification } from '../ErrorNotification';

export const Header: React.FC = () => {
  const [titleField, setTitleField] = useState('');
  // const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const { setErrorMessage } = useContext(TodosContext);
  const { addTodo } = useContext(TodoUpdateContext);
  const inputRef = useRef<HTMLInputElement>(null);

  const USER_ID = 91;

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (titleField.trim()) {
      const newTodo = {
        id: 0,
        title: titleField.trim(),
        userId: USER_ID,
        completed: false,
      };

      addTodo(newTodo);
      setTitleField('');
    } else {
      setErrorMessage('Title should not be empty');
    }
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitleField(event.target.value);
  };

  return (
    <header className="todoapp__header">
      {/* this buttons are active only if there are some active todos */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputRef}
          value={titleField}
          onChange={handleChange}
        // disabled={tempTodo !== null}
        />
      </form>

      {/* Display the 'Title should not be empty' notification */}
      {/* {tempTodo === null && !tempTodo?.id && (
        <ErrorNotification />
      )} */}
    </header>
  );
};
