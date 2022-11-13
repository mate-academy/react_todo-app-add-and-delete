import classNames from 'classnames';
import {
  RefObject, useContext, useEffect, useState,
} from 'react';
import { addTodo } from '../../api/todos';
import { ErrorTodo } from '../../types/ErrorTodo';
import { Todo } from '../../types/Todo';
import { AppContext } from '../AppContext';

type Props = {
  newTodoField: RefObject<HTMLInputElement>,
  numberOfCompletedTodo?: number,
  onSetTempTodo: (title: string) => Promise<void>,
  newTodo: Todo | null;
  setNewTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
};

export const Header: React.FC<Props> = ({
  newTodoField,
  numberOfCompletedTodo,
  onSetTempTodo,
  newTodo,
  setNewTodo,
}) => {
  const [isForbiddenFocus, setIsForbiddenFocus] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const {
    showErrorMessage,
    closeErrorMessage,
    todosFromServer,
    setTodosFromServer,
  } = useContext(AppContext);

  const handleTitle = (value: string) => {
    setNewTitle(value);
    closeErrorMessage();
  };

  const createNewTodo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!newTitle.trim()) {
      showErrorMessage(ErrorTodo.EmptyTitle);

      return;
    }

    onSetTempTodo(newTitle);
    setNewTitle('');
  };

  async function addingTodo() {
    if (newTodo) {
      setIsForbiddenFocus(true);
      const addedTodo = await addTodo(newTodo);

      try {
        if ('Error' in addedTodo) {
          throw new Error();
        }

        if (todosFromServer) {
          setTodosFromServer([...todosFromServer, addedTodo]);
        }

        if (!todosFromServer) {
          setTodosFromServer([addedTodo]);
        }
      } catch {
        showErrorMessage(ErrorTodo.Add);
      } finally {
        setIsForbiddenFocus(false);
        setNewTodo(null);
      }
    }
  }

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    addingTodo();
  }, [newTodo]);

  return (
    <header className="todoapp__header">
      <button
        aria-label="ToggleAllButton"
        data-cy="ToggleAllButton"
        type="button"
        className={classNames(
          'todoapp__toggle-all',
          {
            active: !numberOfCompletedTodo,
          },
        )}
      />

      <form onSubmit={createNewTodo}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTitle}
          onChange={(event) => handleTitle(event.currentTarget.value)}
          disabled={isForbiddenFocus}
        />
      </form>
    </header>
  );
};
