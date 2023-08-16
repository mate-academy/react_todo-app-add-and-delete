import { useCallback, useContext, useState } from 'react';
import classNames from 'classnames';

import { Todo } from '../../types/Todo';
import { ModalOverlayComponent } from '../ModalOverlayComponent';
import { AppContext } from '../../context';
import { deleteTodo, editTodo } from '../../api/todos';
import { USER_ID } from '../../utils/const';
import {
  removeUpdatedTodoIdAction,
  setUpdatedTodoIdAction,
} from '../../services/actions/updatedTodoIdActions';
import {
  deleteTodoAction,
  editTodoAction,
  toggleTodoCompletedAction,
} from '../../services/actions/todoActions';
import { setErrorMessageAction } from '../../services/actions/errorActions';

type Props = {
  todo: Todo;
};

export const TodoItemComponent:React.FC<Props> = ({ todo }) => {
  const { state, dispatch } = useContext(AppContext);
  const [isEditing, setIsEditing] = useState(false);
  const [newTodoTitle, setNewTodoTitle] = useState(todo.title);
  const { updatedTodoIds } = state;

  const handleToggleChange = useCallback(() => {
    dispatch(setUpdatedTodoIdAction(todo.id));

    editTodo({
      ...todo,
      completed: !todo.completed,
    })
      .then(() => {
        dispatch(toggleTodoCompletedAction(todo.id));
        dispatch(removeUpdatedTodoIdAction(todo.id));
      })
      .catch(() => {
        dispatch(removeUpdatedTodoIdAction(todo.id));
        dispatch(setErrorMessageAction('Can\'t update a todo'));
      });
  }, []);

  const handleDeleteTodo = useCallback(
    () => {
      dispatch(setUpdatedTodoIdAction(todo.id));

      deleteTodo(todo.id)
        .then(() => {
          dispatch(deleteTodoAction(todo.id));
        })
        .catch(() => {
          dispatch(setErrorMessageAction('Can\'t delete a todo'));
        })
        .finally(() => {
          dispatch(removeUpdatedTodoIdAction(todo.id));
        });
    }, [],
  );

  const todoToEdit: Todo = {
    id: todo.id,
    userId: USER_ID,
    title: newTodoTitle,
    completed: todo.completed,
  };

  const editingTodoCompleted = async () => {
    dispatch(setUpdatedTodoIdAction(todo.id));

    if (!newTodoTitle.trim()) {
      await deleteTodo(todo.id)
        .then(() => {
          dispatch(deleteTodoAction(todo.id));
          setIsEditing(false);
        })
        .catch(() => {
          dispatch(removeUpdatedTodoIdAction(todo.id));
          dispatch(setErrorMessageAction('Can\'t update a todo'));
        })
        .finally(() => {
          dispatch(removeUpdatedTodoIdAction(todo.id));
        });

      return;
    }

    editTodo(todoToEdit)
      .then(() => {
        dispatch(editTodoAction(todoToEdit));

        setIsEditing(false);
      })
      .catch(() => {
        dispatch(setErrorMessageAction('Can\'t update a todo'));
      })
      .finally(() => {
        dispatch(removeUpdatedTodoIdAction(todoToEdit.id));
      });
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setNewTodoTitle(todo.title);
  };

  const handleOnKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      editingTodoCompleted();
    }

    if (e.key === 'Escape') {
      cancelEditing();
    }
  };

  return (
    <div
      className={classNames(
        'todo',
        { completed: todo.completed },
      )}
      key={todo.id}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          onChange={handleToggleChange}
        />
      </label>
      {!isEditing
        ? (
          <>
            <span
              className="todo__title"
              onDoubleClick={() => {
                setIsEditing(true);
                setTimeout(() => {
                  document.getElementById(`${todo.id}_edit`)?.focus();
                }, 0);
              }}
            >
              {todo.title}
            </span>
            <button
              type="button"
              className="todo__remove"
              onClick={handleDeleteTodo}
            >
              ×
            </button>
          </>
        ) : (
          <form onSubmit={e => e.preventDefault()}>
            <input
              type="text"
              id={`${todo.id}_edit`}
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={newTodoTitle}
              onChange={(e) => setNewTodoTitle(e.target.value.trim())}
              onBlur={editingTodoCompleted}
              onKeyUp={handleOnKeyUp}
            />
          </form>
        )}

      <ModalOverlayComponent isActive={
        updatedTodoIds.includes(todo.id as never)
      }
      />
    </div>
  );
};
