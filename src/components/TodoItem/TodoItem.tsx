import {
  ChangeEvent, FormEvent, MouseEvent, useState,
} from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { client } from '../../utils/fetchClient';
import { useAppContext } from '../Context/AppContext';
import { getTodos } from '../../api/todos';
import { ErrorTypes } from '../../types/ErrorTypes';

type Props = {
  todoInfo: Todo,
};
export const TodoItem = ({ todoInfo }: Props) => {
  const {
    userId,
    setTodos,
    setErrorType,
    processing,
    setProcessing,
    editTodoId,
    setEditTodoId,
  } = useAppContext();
  const {
    id,
    title,
    completed,
  } = todoInfo;

  const [editTitle, setEditTitle] = useState<string>(title);

  const handleCheckboxToggle = (todo: Todo, event: ChangeEvent) => {
    event.preventDefault();

    setProcessing([...processing, todo.id]);

    client.patch(`/todos/${todo.id}`, { completed: !todo.completed })
      .then(() => {
        getTodos(userId)
          .then(setTodos)
          .catch(() => {
            setErrorType(ErrorTypes.load);
          })
          .finally(() => {
            setProcessing(processing.filter(todoId => todoId !== todo.id));
          });
      })
      .catch(() => {
        setErrorType(ErrorTypes.update);
        setProcessing(processing.filter(todoId => todoId !== todo.id));
      });
  };

  const handleDeleteTodo = (todoId: number, event: MouseEvent) => {
    event.preventDefault();

    setProcessing([...processing, todoId]);

    client.delete(`/todos/${todoId}`)
      .then(() => {
        getTodos(userId)
          .then(setTodos)
          .catch(() => {
            setErrorType(ErrorTypes.load);
          })
          .finally(() => {
            setProcessing(processing.filter(num => num !== todoId));
          });
      })
      .catch(() => {
        setErrorType(ErrorTypes.delete);
        setProcessing(processing.filter(num => num !== todoId));
      });
  };

  const handleEdit = (event: MouseEvent) => {
    event.preventDefault();
    setEditTodoId(id);
  };

  const handleEscape = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setEditTitle(title);
    }
  };

  const handleSubmitEdit = (event: FormEvent) => {
    if (event.type !== 'blur') {
      event.preventDefault();
    }

    setProcessing([...processing, editTodoId]);

    if (editTitle.length < 1) {
      client.delete(`/todos/${editTodoId}`)
        .then(() => {
          getTodos(userId)
            .then(setTodos)
            .catch(() => {
              setErrorType(ErrorTypes.load);
            })
            .finally(() => {
              setProcessing([...processing]);
              setEditTodoId(-1);
            });
        })
        .catch(() => {
          setErrorType(ErrorTypes.delete);
          setProcessing([...processing]);
        });
    }

    if (editTitle !== title && editTitle.length > 0) {
      client.patch(`/todos/${id}`, { title: editTitle })
        .then(() => {
          getTodos(userId)
            .then(setTodos)
            .catch(() => {
              setErrorType(ErrorTypes.load);
            })
            .finally(() => {
              setProcessing([...processing]);
              setEditTodoId(-1);
            });
        })
        .catch(() => {
          setErrorType(ErrorTypes.update);
          setProcessing([...processing]);
        });
    }

    setProcessing([...processing]);
    setEditTodoId(-1);
  };

  return (
    <div
      key={id}
      className={cn('todo', {
        completed,
      })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
          disabled={processing.length > 0}
          onChange={(event) => {
            handleCheckboxToggle(todoInfo, event);
          }}
        />
      </label>

      {editTodoId !== id ? (
        <>
          <span
            className="todo__title"
            onDoubleClick={handleEdit}
          >
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            onClick={(event) => handleDeleteTodo(id, event)}
          >
            x
          </button>
        </>
      ) : (
        <form onSubmit={handleSubmitEdit}>
          <input
            onKeyUp={(event) => handleEscape(event)}
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editTitle}
            onChange={event => setEditTitle(event.target.value)}
            onBlur={handleSubmitEdit}
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus={editTodoId === id && editTitle === title}
          />
        </form>
      )}

      <div
        className={
          cn('modal overlay', {
            'is-active': processing.includes(id) || id === 0,
          })
        }
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
