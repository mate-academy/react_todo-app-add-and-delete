/* eslint-disable no-console */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  FormEvent,
  useContext,
  useEffect,
  useRef,
} from 'react';
import { postTodo } from '../../../api/todos';
import { AuthContext } from '../../Auth/AuthContext';

export const TodoHeader: React.FC = () => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const addTodo = async () => {
    if (user && newTodoField.current) {
      await postTodo(user.id, newTodoField.current.value);
      console.log('posted');
      newTodoField.current.value = '';
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    console.log(newTodoField.current?.value);

    addTodo();
  };

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  return (
    <header className="todoapp__header">
      <button
        data-cy="ToggleAllButton"
        type="button"
        className="todoapp__toggle-all active"
      />

      <form
        onSubmit={handleSubmit}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
        />
      </form>
    </header>
  );
};
