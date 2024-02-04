/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { TodoUpdateContext, TodosContext } from '../../context/TodosContext';

export const Header: React.FC = () => {
  const [titleField, setTitleField] = useState('');
  const [isAddingTodo, setIsAddingTodo] = useState(false);

  const {
    todos,
    errorMessage,
    setErrorMessage,
    setTempTodo,
  } = useContext(TodosContext);
  const { addTodo } = useContext(TodoUpdateContext);
  const inputRef = useRef<HTMLInputElement>(null);

  const USER_ID = 91;

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [todos, errorMessage]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (titleField.trim()) {
      setTempTodo({
        id: 0,
        title: titleField.trim(),
        userId: USER_ID,
        completed: false,
      });

      const newTodo = {
        title: titleField.trim(),
        userId: USER_ID,
        completed: false,
      };

      setIsAddingTodo(true);

      try {
        await addTodo(newTodo);
        setTitleField('');
      } catch (error) {
        setErrorMessage('Unable to add a todo');
      } finally {
        setIsAddingTodo(false);
        setTempTodo(null);
      }
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
          disabled={isAddingTodo}
        />
      </form>
    </header>
  );
};
