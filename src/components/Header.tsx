/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';
import { TodosContext } from './TodoContext';
import { ErrorMessage } from '../types/ErrorMessage';
import { addTodos } from '../api/todos';

export const Header = () => {
  const [newTodoField, setNewTodoField] = useState('');
  const [isSubmiting, setIsSubmiting] = useState(false);

  const {
    todos,
    setTodos,
    addErrorMessage,
    USER_ID,
    setTodoLoader,
    setTempTodo,
  } = useContext(TodosContext);

  const titleField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (titleField.current) {
      titleField.current.focus();
    }
  }, [todos.length, isSubmiting]);

  const handleAddTodo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!newTodoField.trim()) {
      addErrorMessage(ErrorMessage.TitleEmpty);

      return;
    }

    setIsSubmiting(true);
    setTodoLoader(0);
    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: newTodoField.trim(),
      completed: false,
    });

    addTodos({
      userId: USER_ID,
      title: newTodoField.trim(),
      completed: false,
    })
      .then((newTodo) => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setNewTodoField('');
      })
      .catch(() => addErrorMessage(ErrorMessage.UnableToAdd))
      .finally(() => {
        setTempTodo(null);
        setIsSubmiting(false);
        setTodoLoader(null);
      });
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames(
          'todoapp__toggle-all',
          { active: true },
        )}
        data-cy="ToggleAllButton"
      />
      <form onSubmit={handleAddTodo}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={isSubmiting}
          value={newTodoField}
          onChange={(e) => setNewTodoField(e.target.value)}
          ref={titleField}
        />
      </form>
    </header>
  );
};
