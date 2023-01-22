import classNames from 'classnames';
import React, { useState } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Todo } from '../types/Todo';
import { EditTodoInput } from './EditTodoInput';

type Props = {
  todos: Todo[];
  title: string;
  isAdding: boolean;
  handleDelete: (id: number) => void;
  handleStatusChange: (id: number, data: boolean) => void;
  selectedTodoIds: number[];
  handleEditing: (id: number, data: string, oldData: string) => void;
  handleDoubleClick: (id: number) => void;
  isEditing: boolean;
  handleCancel: () => void;
};

export const TodosList: React.FC<Props> = (
  {
    todos,
    title,
    isAdding,
    handleDelete,
    handleStatusChange,
    selectedTodoIds,
    handleEditing,
    handleDoubleClick,
    isEditing,
    handleCancel,
  },
) => {
  const [editedTitle, setEditedTitle] = useState<string>('');

  const handleOnChange = (id: number, completed: boolean) => {
    return completed
      ? handleStatusChange(id, false)
      : handleStatusChange(id, true);
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <div
              data-cy="Todo"
              className={classNames('todo', { completed: todo.completed })}
            >
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  checked={todo.completed}
                  className="todo__status"
                  onChange={() => handleOnChange(todo.id, todo.completed)}
                />
              </label>

              {isEditing && selectedTodoIds.some(id => id === todo.id)
                ? (
                  <EditTodoInput
                    todo={todo}
                    editedTitle={editedTitle}
                    setEditedTitle={setEditedTitle}
                    handleEditing={handleEditing}
                    handleCancel={handleCancel}
                  />
                ) : (
                  <>
                    <span
                      data-cy="TodoTitle"
                      className="todo__title"
                      onDoubleClick={() => {
                        setEditedTitle(todo.title);
                        handleDoubleClick(todo.id);
                      }}
                    >
                      {todo.title}
                    </span>

                    <button
                      type="button"
                      className="todo__remove"
                      data-cy="TodoDeleteButton"
                      onClick={() => handleDelete(todo.id)}
                    >
                      ×
                    </button>

                    <div
                      data-cy="TodoLoader"
                      className={classNames(
                        'modal overlay',
                        {
                          'is-active':
                            selectedTodoIds.some(id => id === todo.id),
                        },
                      )}
                    >
                      <div
                        className="modal-background has-background-white-ter"
                      />
                      <div className="loader" />
                    </div>
                  </>
                )}
            </div>
          </CSSTransition>
        ))}

        {isAdding && (
          <CSSTransition
            timeout={300}
            classNames="temp-item"
          >
            <div data-cy="Todo" className="todo">
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                />
              </label>

              <span data-cy="TodoTitle" className="todo__title">{title}</span>
              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDeleteButton"
              >
                ×
              </button>

              <div data-cy="TodoLoader" className="modal overlay is-active">
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
