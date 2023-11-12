import React, { useContext } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';
import { deleteTodos, updateTodos } from '../api/todos';
import { TodosContext } from './TodosContext';

type Props = {
  todo: Todo
};

export const TodosItem: React.FC<Props> = ({ todo }) => {
  const { id, title } = todo;

  const {
    todoEditTitle,
    todoEditId,
    todoIsLoading,
    inputRef,
    setTodos,
    setTodoEditTitle,
    setErrorMessage,
    setTodoEditId,
    setTodoIsLoading,
  } = useContext(TodosContext);

  const isEditing = todoEditId === id;

  const handleDoubleClick = (todoId: number, todoTitle: string) => {
    setTodoEditId(todoId);
    setTodoEditTitle(todoTitle);
  };

  const resetChange = () => {
    setTodoEditId(0);
    setTodoEditTitle('');
  };

  const saveChange = () => {
    const preUpdateTitle = todo.title;
    const todoUpdated = { ...todo, title: todoEditTitle.trim() };

    setTodoIsLoading(todo.id);

    setTodos(prev => prev.map(todoItem => {
      if (todoItem.id === id) {
        return todoUpdated;
      }

      return todoItem;
    }));

    updateTodos(todoUpdated)
      .catch(() => {
        setErrorMessage('Unable to update a todo');
        setTodos(prev => prev.map(todoItem => {
          if (todoItem.id === id) {
            return { ...todo, title: preUpdateTitle };
          }

          return todoItem;
        }));
      })
      .finally(() => {
        resetChange();
        setTodoIsLoading(null);
      });

    resetChange();
  };

  const handleDelete = (todoId: number) => {
    setTodoIsLoading(todoId);
    deleteTodos(todoId)
      .then(() => {
        setTodos((prev) => prev
          .filter(todoItem => todoItem.id !== todoId));
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      })
      .finally(() => {
        resetChange();
        setTodoIsLoading(null);
      });
  };

  const handleChange = (event: React.KeyboardEvent<HTMLInputElement>) => {
    event.preventDefault();

    switch (event.key) {
      case 'Escape':
        resetChange();

        break;
      case 'Enter':
        if (!setTodoEditTitle) {
          handleDelete(todoEditId);

          return;
        }

        saveChange();

        break;
      default:
        break;
    }
  };

  const handleChangeComplete = (todoItem: Todo) => {
    // eslint-disable-next-line no-param-reassign
    todoItem.completed = !todoItem.completed;
    setTodoIsLoading(todoItem.id);

    updateTodos(todoItem)
      .then(data => setTodos((prev) => {
        return [
          ...prev
            .map(getTodo => (getTodo.id === todo.id ? data : getTodo)),
        ];
      }))
      .catch(() => {
        setErrorMessage('Unable to update a todo');
      })
      .finally(() => {
        setTodoIsLoading(null);
      });
  };

  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={cn(
        'todo',
        { completed: todo.completed },
        { editing: isEditing },
      )}
    >
      <label
        className="todo__status-label"
      >
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => handleChangeComplete(todo)}
        />
      </label>

      {isEditing ? (
        <form onSubmit={(e) => e.preventDefault()}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={todoEditTitle}
            onChange={(event) => setTodoEditTitle(event.target.value)}
            onKeyUp={handleChange}
            onBlur={saveChange}
            ref={inputRef}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => handleDoubleClick(id, title)}
          >
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleDelete(id)}
          >
            ×
          </button>

          <div
            data-cy="TodoLoader"
            className={cn(
              'modal overlay',
              { 'is-active': todoIsLoading === id },
            )}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </>
      )}
    </div>
  );
};
