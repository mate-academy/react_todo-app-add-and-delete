import cn from 'classnames';

import { Todo } from '../types/todo';
import { FormEvent, useState } from 'react';
import { Loader } from './Loader';

type Props = {
  todo: Todo;
  setSelectedTodo: (todo: Todo | null) => void;
  loading: number[];
  selectedTodo: Todo | null;
  onDelete: (id: number) => void;
  onPatch: (todo: Todo, event?: React.FormEvent<HTMLFormElement>) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  setSelectedTodo,
  loading,
  selectedTodo,
  onDelete,
  onPatch,
}) => {
  const [isDoubleClicked, setIsDoubleClicked] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>(todo.title);
  const isTodoChanged =
    todo.title !== selectedTodo?.title ||
    selectedTodo?.completed !== todo.completed;

  const onFormSubmit = (event?: FormEvent<HTMLFormElement>) => {
    if (selectedTodo && isTodoChanged) {
      setIsDoubleClicked(false);
      if (event) {
        onPatch(selectedTodo, event);

        return;
      }

      onPatch(selectedTodo);
    } else {
      setIsDoubleClicked(false);
      setSelectedTodo(null);
    }
  };

  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
      <label
        aria-label="todo-status"
        className="todo__status-label"
        onClick={() => {
          setSelectedTodo({
            ...todo,
            completed: !todo.completed,
          });
        }}
      >
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => {
            onFormSubmit();
          }}
        />
      </label>

      {selectedTodo?.id === todo.id && isDoubleClicked ? (
        <form
          onSubmit={event => onFormSubmit(event)}
          onBlur={event => onFormSubmit(event)}
        >
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            autoFocus
            value={selectedTodo.title}
            onChange={event => {
              setNewTitle(event.target.value);
              setSelectedTodo({
                ...selectedTodo,
                title: event.target.value,
              });
            }}
          />
        </form>
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => {
            setSelectedTodo(todo);
            setIsDoubleClicked(true);
          }}
        >
          {newTitle}
        </span>
      )}
      {!isDoubleClicked && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => onDelete(todo.id)}
        >
          ×
        </button>
      )}
      <Loader loading={loading} id={todo.id} />
    </div>
  );
};
