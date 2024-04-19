/* eslint-disable jsx-a11y/label-has-associated-control */
import { useContext } from 'react';
import { Todo } from '../types/Todo';
import { TodoContext } from './TodoContext';
import classNames from 'classnames';
import { useState } from 'react';
import { deleteTodo, updateTodo } from '../api/todos';
import { listForDeleting } from './Footer';

type Props = {
  todo: Todo;
};

export const TodoListItem: React.FC<Props> = ({ todo }) => {
  const { todosList, setTodosList, setErrorMessage } = useContext(TodoContext);

  const { id, title, completed } = todo;

  const [isEditing, setIsEditing] = useState(false);

  const [newTitle, setNewTitle] = useState(title);

  const [trimmedTitle, setTrimmedTitle] = useState(newTitle.trim());

  const [isLoading, setIsLoading] = useState(false);

  const removeTodo = () => {
    setIsLoading(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    deleteTodo(id)
      .then(() => {
        setTodosList(todosList.filter(item => item.id !== id));
      })
      .catch(() => setErrorMessage('Unable to delete a todo'))
      .finally(() => setIsLoading(false));
  };

  const setTodoStatus = () => {
    const targetTodo = todosList.find(item => item.id === todo.id);

    if (targetTodo) {
      targetTodo.completed = !todo.completed;

      updateTodo({ ...todo })
        .then(() => {
          setTodosList(
            todosList.map(task =>
              task.id === id
                ? { ...todo, completed: targetTodo.completed }
                : task,
            ),
          );
        })
        .catch(() => {
          setErrorMessage('Unable to update a todo');
        });
    }
  };

  const changeStatus = () => {
    setTodoStatus();
  };

  const handleEditing = () => {
    setIsEditing(true);
  };

  const editingNewTitle = (event: React.FormEvent<HTMLInputElement>) => {
    setNewTitle(event.currentTarget.value);
    setTrimmedTitle(event.currentTarget.value.trim());
  };

  const applyNewTitle = () => {
    if (newTitle.trim()) {
      const targetTodo = todosList.find(item => item.id === id);

      if (targetTodo) {
        targetTodo.title = trimmedTitle;
      }

      setNewTitle(trimmedTitle);
      setIsEditing(false);

      updateTodo({ ...todo })
        .then(() => {
          setTodosList(
            todosList.map(item =>
              item.id === id ? { ...todo, title: newTitle } : item,
            ),
          );
        })
        .catch(() => {
          setErrorMessage('Unable to update a todo');
        });
    } else {
      removeTodo();
    }
  };

  const handleSubmitOfChangedTodo = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Enter') {
      event.preventDefault();

      applyNewTitle();
    }
  };

  const handleSubmitOfChangedTodoOnBlur = () => {
    applyNewTitle();
  };

  const handleEscape = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
      setNewTitle(title);
      setTrimmedTitle(title);
      setTodosList([...todosList]);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: completed })}
      key={id}
      onDoubleClick={handleEditing}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onChange={changeStatus}
          checked={todo.completed}
        />
      </label>

      {isEditing ? (
        <form>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={editingNewTitle}
            onKeyDown={handleSubmitOfChangedTodo}
            onKeyUp={handleEscape}
            onBlur={handleSubmitOfChangedTodoOnBlur}
            autoFocus
          />
        </form>
      ) : (
        <>
          <span data-cy="TodoTitle" className="todo__title">
            {title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={removeTodo}
          >
            ×
          </button>

          <div
            data-cy="TodoLoader"
            className={classNames('modal', 'overlay', {
              'is-active': isLoading || listForDeleting.includes(todo),
            })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </>
      )}
    </div>
  );
};
