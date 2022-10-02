import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';
import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  isDeleting: number[];
  onStatusChange: (todoId: number) => void;
  onDeleteTodo: (todoId: number) => void;
};

export const TodoList: React.FC<Props> = (props) => {
  const {
    todos,
    isDeleting,
    onStatusChange,
    onDeleteTodo,
  } = props;
  const selectedTodoField = useRef<HTMLInputElement>(null);
  const [selectedTodo, setSelectedTodo] = useState<number | null>(null);

  const handleResetSelectedTodo = () => {
    setSelectedTodo(null);
  };

  const handleDeleteTodo = (todoId: number) => {
    onDeleteTodo(todoId);
  };

  useEffect(() => {
    if (selectedTodoField.current) {
      selectedTodoField.current.focus();
    }
  }, [selectedTodo]);

  return (
    <TransitionGroup>
      {todos.map(todo => {
        const {
          id,
          title,
          completed,
        } = todo;

        return (
          <CSSTransition
            key={id}
            timeout={300}
            classNames={classNames(
              { item: id !== 0 },
              { 'temp-item': id === 0 },
            )}
          >
            <div
              data-cy="Todo"
              className={classNames('todo', { completed })}
            >
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                  checked={completed}
                  onChange={() => onStatusChange(id)}
                />
              </label>

              {id === selectedTodo ? (
                <form>
                  <input
                    data-cy="TodoTitleField"
                    type="text"
                    className="todo__title-field"
                    placeholder="Empty todo will be deleted"
                    value={title}
                    onBlur={handleResetSelectedTodo}
                    ref={selectedTodoField}
                  />
                </form>
              ) : (
                <>
                  <span
                    data-cy="TodoTitle"
                    className="todo__title"
                    onDoubleClick={() => setSelectedTodo(id)}
                  >
                    {title}
                  </span>

                  <button
                    type="button"
                    className="todo__remove"
                    data-cy="TodoDeleteButton"
                    onClick={() => handleDeleteTodo(id)}
                  >
                    ×
                  </button>
                </>
              )}

              <div
                data-cy="TodoLoader"
                className={classNames(
                  'modal',
                  'overlay',
                  { 'is-active': isDeleting.includes(id) || id === 0 },
                )}
              >
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          </CSSTransition>
        );
      })}
    </TransitionGroup>
  );
};
