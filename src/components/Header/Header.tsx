import {
  FormEvent,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { addTodo } from '../../api/todos';
import { ErrorType } from '../../types/ErrorType';
import { Todo } from '../../types/Todo';
import { User } from '../../types/User';
import { AuthContext } from '../Auth/AuthContext';

type Props = {
  onAdd: (status: boolean, todoId: number) => void;
  onError: (error: ErrorType) => void;
  onAddTempTodo: (tempTodo: Todo | null) => void
  isTodosChanging: boolean;
};

/* eslint-disable jsx-a11y/control-has-associated-label */
export const Header: React.FC<Props> = ({
  onAdd,
  onError,
  onAddTempTodo,
  isTodosChanging,
}) => {
  const newTodoField = useRef<HTMLInputElement>(null);
  const [newTodoTitle, setNewTodoTitle] = useState('');

  const user = useContext(AuthContext);

  const newTodo: Todo = {
    id: 0,
    userId: (user as User).id,
    title: newTodoTitle,
    completed: false,
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newTodoTitle.length) {
      onError(ErrorType.EMPTYTITLE);
    } else {
      onAdd(true, newTodo.id);
      setNewTodoTitle('');
      onAddTempTodo(newTodo);
      addTodo(newTodo)
        .catch(() => {
          onError(ErrorType.ADD);
        })
        .finally(() => {
          onAdd(false, -1);
          onAddTempTodo(null);
        });
    }
  };

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [onAddTempTodo]);

  return (
    <header className="todoapp__header">
      <button
        data-cy="ToggleAllButton"
        type="button"
        className="todoapp__toggle-all active"
      />

      <form onSubmit={onSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          value={newTodoTitle}
          onChange={(event) => {
            setNewTodoTitle(event.target.value);
          }}
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={isTodosChanging}
        />
      </form>
    </header>
  );
};
