/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { useState } from 'react';
import { Todo } from '../types/Todo';
import cn from 'classnames';
import { USER_ID } from '../api/todos';

const classNameLoader = 'modal-background has-background-white-ter';

type Props = {
  todo: Todo;
  selectedTodo?: Todo | null;
  setSelectedTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
  deleteChosenTodo: (currentTodoToDelete: Todo | null) => void;
  focusedTodoRef: React.RefObject<HTMLInputElement>;
  shouldDeleteCompleted: boolean;
  updateChosenTodo: (todoSetToUpdate: Todo | null) => void;
  shouldToggleAllCompleted: boolean;
  currentTodos: Todo[];
};

export const TodoItem: React.FC<Props> = ({
  todo,
  selectedTodo,
  setSelectedTodo,
  deleteChosenTodo,
  focusedTodoRef,
  shouldDeleteCompleted,
  updateChosenTodo,
  shouldToggleAllCompleted,
  currentTodos,
}) => {
  const [inputValue, setInputValue] = useState(todo.title);
  const [loader, setLoader] = useState(false);
  const currentToggle = currentTodos.some(toDo => !toDo.completed);

  const handleDelete = async (todoToDel: Todo) => {
    setLoader(true);

    await new Promise(resolve => setTimeout(resolve, 100));

    await deleteChosenTodo(todoToDel);

    setLoader(false);
  };

  const handleUpdate = async (todoToUp: Todo) => {
    setLoader(true);

    await new Promise(resolve => setTimeout(resolve, 100));

    await updateChosenTodo(todoToUp);

    setLoader(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleBlurOrSubmit = () => {
    if (inputValue !== todo.title) {
      if (inputValue) {
        handleDelete(todo);
      } else {
        handleUpdate({
          id: todo.id,
          title: inputValue.trim(),
          userId: USER_ID,
          completed: todo.completed,
        });
      }
    }

    if (inputValue === todo.title) {
      setSelectedTodo(null);
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setInputValue(todo.title);
      setSelectedTodo(null);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: todo.completed,
      })}
      key={todo.id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() =>
            handleUpdate({
              id: todo.id,
              title: inputValue.trim(),
              userId: USER_ID,
              completed: !todo.completed,
            })
          }
        />
      </label>
      {todo !== selectedTodo ? (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setSelectedTodo(todo)}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleDelete(todo)}
          >
            ×
          </button>
        </>
      ) : (
        <form
          onSubmit={e => {
            e.preventDefault();
            handleBlurOrSubmit();
          }}
        >
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleBlurOrSubmit}
            onKeyUp={handleKeyUp}
            ref={focusedTodoRef}
          />
        </form>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active':
            loader ||
            (shouldDeleteCompleted && todo.completed) ||
            (shouldToggleAllCompleted && todo.completed !== currentToggle),
        })}
      >
        <div className={classNameLoader}></div>
        <div className="loader" />
      </div>
    </div>
  );
};
