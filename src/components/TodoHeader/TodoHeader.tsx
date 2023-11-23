/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useState,
  useContext,
  useRef,
  useEffect,
} from 'react';
import { TodosContext } from '../TodosContext';
import { Todo } from '../../types/Todo';
import { ErrorMessage } from '../../types/ErrorMessages';
import { addTodo } from '../../api/todos';

type Props = {
  onTodoAdd: React.Dispatch<React.SetStateAction<Todo | null>>;
};

export const TodoHeader: React.FC<Props> = ({ onTodoAdd }) => {
  const {
    setTodos,
    setErrorMessage,
    setErrorWithTimeout,
  } = useContext(TodosContext);
  const [newTodo, setNewTodo] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const inputFocus = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputFocus.current) {
      inputFocus.current.focus();
    }
  }, [isLoading]);

  const handleFormSubmit = (event: React.FormEvent) => {
    event?.preventDefault();

    if (newTodo.trim() !== '') {
      setErrorMessage(null);
      setIsLoading(true);
      onTodoAdd({
        title: newTodo.trim(),
        completed: false,
        userId: 11813,
        id: 0,
      });

      addTodo({
        title: newTodo.trim(),
        completed: false,
        userId: 11813,
      })
        .then(createdTodo => {
          setTodos(currTodos => {
            return [...currTodos, createdTodo] as Todo[];
          });

          setNewTodo('');
        })
        .catch((err) => {
          setErrorWithTimeout(ErrorMessage.Adding, setErrorMessage);
          throw err;
        })
        .finally(() => {
          setIsLoading(false);
          onTodoAdd(null);
        });
    } else {
      setErrorWithTimeout(ErrorMessage.Title, setErrorMessage);
    }
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      <form onSubmit={handleFormSubmit}>
        <input
          ref={inputFocus}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodo}
          onChange={event => setNewTodo(event.target.value)}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
