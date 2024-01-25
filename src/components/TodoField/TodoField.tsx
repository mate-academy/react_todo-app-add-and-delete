import {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import cn from 'classnames';

import { Todo } from '../../types/Todo';
import { updateTodo } from '../../api/todos';
import { DispatchContext } from '../../State/State';
import { handleDeleteTodo } from '../../services/todoItemServices';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todo: Todo;
};

export const TodoField: React.FC<Props> = ({ todo }) => {
  const { title, id } = todo;
  const [currentTitle, setCurrentTitle] = useState(title);
  const [isLoading, setIsLoading] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const edit = useRef<HTMLInputElement>(null);
  const dispatch = useContext(DispatchContext);

  useEffect(() => {
    if (edit.current) {
      edit.current.focus();
    }
  }, [isEditing]);

  function editTodo(event: React.FormEvent) {
    event.preventDefault();
    dispatch({ type: 'setIsSubmitting', payload: true });

    const promise: Promise<void> = new Promise((resolve) => {
      if (currentTitle.length) {
        updateTodo({ title: currentTitle, id })
          .then(updatedTodo => {
            setIsEditing(false);
            dispatch({ type: 'updateTodo', payload: updatedTodo });
          })

          .catch(() => dispatch(
            { type: 'setError', payload: 'Unable to update a todo' },
          ));

        resolve();

        return;
      }

      handleDeleteTodo(setIsLoading, dispatch, id);
      resolve();
    });

    promise.finally(() => {
      dispatch({ type: 'setIsSubmitting', payload: false });
      setIsEditing(false);
    });
  }

  return (
    <>
      {!isEditing
        ? (
          <TodoItem
            todo={todo}
            setIsEditing={setIsEditing}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            currentTitle={currentTitle}
            setCurrentTitle={setCurrentTitle}
          />
        )
        : (
          <>
            {/* This todo is being edited */}
            <div data-cy="Todo" className="todo">
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                />
              </label>

              {/* This form is shown instead of the title and remove button */}
              <form onSubmit={editTodo}>
                <input
                  ref={edit}
                  data-cy="TodoTitleField"
                  type="text"
                  className="todo__title-field"
                  placeholder="Empty todo will be deleted"
                  value={currentTitle}
                  onChange={event => setCurrentTitle(event.target.value)}
                  onBlur={editTodo}
                />
              </form>

              <div
                data-cy="TodoLoader"
                className={cn('modal overlay', {
                })}
              >
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          </>
        )}
    </>
  );
};
