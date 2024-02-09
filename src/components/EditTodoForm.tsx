import classNames from 'classnames';
import {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import { deleteTodo, updateTodos } from '../api/todos';
import { TodoContext } from '../contexts/TodoContext';
import { ErrorMessage } from '../types/ErrorMessage';
import { Todo } from '../types/Todo';

interface Props {
  todoOnUpdate: Todo,
  onEditMode: React.Dispatch<React.SetStateAction<boolean>>,
}

export const EditTodoForm: React.FC<Props> = ({
  todoOnUpdate,
  onEditMode,
}) => {
  const [newTitle, setNewTitle] = useState(todoOnUpdate.title);
  const [isLoading, setIsLoading] = useState(false);
  const { setTodos, setErrorMessage, updateTodoList } = useContext(TodoContext);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleEdit = () => {
    setIsLoading(true);

    const titleToUpdate = newTitle.trim();

    if (todoOnUpdate.title === newTitle) {
      onEditMode(false);

      return;
    }

    if (titleToUpdate.length === 0) {
      deleteTodo(todoOnUpdate.id)
        .then(() => setTodos(prevTodos => prevTodos
          .filter(todoToFilter => todoToFilter.id !== todoOnUpdate.id)))
        .catch(() => {
          setErrorMessage(ErrorMessage.FailedDeleteTodo);
        })
        .finally(() => {
          setIsLoading(false);
        });

      return;
    }

    updateTodos({ ...todoOnUpdate, title: titleToUpdate })
      .then(() => {
        updateTodoList({ ...todoOnUpdate, title: titleToUpdate });
        onEditMode(false);
      })
      .catch(() => setErrorMessage(ErrorMessage.FailedUpdateTodo))
      .finally(() => setIsLoading(false));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleEdit();
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      onEditMode(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          data-cy="TodoTitleField"
          type="text"
          className="todo__title-field"
          placeholder="Empty todo will be deleted"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onBlur={handleEdit}
          onKeyUp={handleKeyUp}
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
        />
      </form>

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', { 'is-active': isLoading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </>
  );
};
