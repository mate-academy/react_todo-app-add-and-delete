import React, {
  useEffect,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { Loader } from '../Loader/Loader';

type Props = {
  todo: Todo,
  deleteTodo: (todoId: number) => Promise<void>,
  updateTodoStatus: (todo: Todo, status: boolean) => Promise<void>,
  updateTodoTitle: (todo: Todo, title: string) => Promise<void>,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  deleteTodo,
  updateTodoStatus,
  updateTodoTitle,
}) => {
  const [inputText, setInputText] = useState(todo.title);
  const [isChangeTitle, setIsChangeTitle] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);

  const toDefaultTitle = () => {
    setInputText(todo.title);
    setIsChangeTitle(false);
  };

  useEffect(() => {
    if (titleRef.current && isChangeTitle) {
      titleRef.current.focus();
    }
  }, [titleRef.current, isChangeTitle]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      setIsChangeTitle(false);

      if (inputText !== todo.title) {
        setIsLoading(true);
        updateTodoTitle(todo, inputText)
          .finally(() => setIsLoading(false));
      }

      if (inputText.length === 0) {
        setIsLoading(true);
        deleteTodo(todo.id)
          .finally(() => setIsLoading(false));
      }
    }

    if (event.key === 'Escape') {
      toDefaultTitle();
    }
  };

  const handleChangeStatus = () => {
    setIsLoading(true);
    updateTodoStatus(todo, !todo.completed).finally(() => setIsLoading(false));
  };

  const onDeleteTodo = () => {
    setIsLoading(true);
    deleteTodo(todo.id).finally(() => setIsLoading(false));
  };

  const handelChangeTitleField = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setInputText(event.target.value);
  };

  const handelChangeTitle = () => setIsChangeTitle(true);

  return (
    <li
      data-cy="Todo"
      className={classNames(
        'todo',
        { completed: todo.completed },
      )}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleChangeStatus}
        />
      </label>

      {isChangeTitle
        ? (
          <form>
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              defaultValue={`${inputText}`}
              onChange={handelChangeTitleField}
              onKeyDown={handleKeyDown}
              onBlur={toDefaultTitle}
              ref={titleRef}
            />
          </form>
        )
        : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={handelChangeTitle}
            >
              {inputText}
            </span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              onClick={onDeleteTodo}
            >
              ×
            </button>

            {isLoading
              && (
                <div data-cy="TodoLoader" className="modal overlay is-active">
                  <div className="modal-background has-background-white-ter" />
                  <div className="loader" />
                </div>
              )}
          </>
        )}

      <Loader />
    </li>
  );
};
