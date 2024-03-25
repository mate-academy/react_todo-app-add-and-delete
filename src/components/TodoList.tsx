/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { useState } from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';
import * as todoService from '../api/todos';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import React from 'react';

type Props = {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  filteredTodos: () => Todo[];
  destroy: (id: number) => void;
  error: React.Dispatch<React.SetStateAction<string>>;
};

export const TodoList: React.FC<Props> = ({
  filteredTodos,
  destroy,
  error,
  todos,
  setTodos,
}) => {
  const isNotCompletedTodoVisible = false;
  const isEditingTodoVisible = false;
  const isLoadingTodoVisible = false;
  const [loaderId, setLoaderId] = useState<number | null>(null);
  const filter = filteredTodos();
  const toggleTodoCompletion = (todoId: number) => {
    setLoaderId(todoId);
    const updatedTodos = todos.map(todo => {
      if (todoId === todo.id) {
        return {
          ...todo,
          completed: !todo.completed,
        };
      }

      return todo;
    });

    setTodos(updatedTodos);
    setTimeout(() => {
      setLoaderId(null);
    }, 300);
  };

  const handleTodoUpdate = (updatedTodo: Todo) => {
    todoService
      .updateTodo(updatedTodo)
      .then(response => {
        setTodos(currentTodos => {
          const updatedIndex = currentTodos.findIndex(
            todo => todo.id === response.id,
          );
          const updatedTodos = [...currentTodos];

          updatedTodos[updatedIndex] = response;

          return updatedTodos;
        });
      })
      .catch(() => {
        error('Unable to update a todo');
        setTimeout(() => {
          error('');
        }, 4000);
      });
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {filter.map(todo => (
          <CSSTransition key={todo.id} timeout={300} classNames="item">
            <div
              key={todo.id}
              data-cy="Todo"
              className={`todo ${todo.completed ? 'completed' : ''}`}
              onSubmit={() => handleTodoUpdate(todo)}
            >
              {todo.completed}
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                  placeholder="Empty todo will be deleted"
                  onChange={() => toggleTodoCompletion(todo.id)}
                  checked={todo.completed}
                />
              </label>

              <span data-cy="TodoTitle" className="todo__title">
                {todo.title}
              </span>

              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
                onClick={() => {
                  destroy(todo.id);
                }}
              >
                ×
              </button>
              <div
                data-cy="TodoLoader"
                className={classNames('modal overlay', {
                  'is-active': loaderId === todo.id,
                })}
              >
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          </CSSTransition>
        ))}

        {/* This todo is an active todo */}

        {isNotCompletedTodoVisible && (
          <div data-cy="Todo" className="todo">
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
              />
            </label>

            <span data-cy="TodoTitle" className="todo__title">
              Not Completed Todo
            </span>
            <button type="button" className="todo__remove" data-cy="TodoDelete">
              ×
            </button>

            <div data-cy="TodoLoader" className="modal overlay">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        )}

        {/* This todo is being edited */}
        {isEditingTodoVisible && (
          <div data-cy="Todo" className="todo">
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
              />
            </label>

            {/* This form is shown instead of the title and remove button */}
            <form>
              <input
                data-cy="TodoTitleField"
                type="text"
                className="todo__title-field"
                placeholder="Empty todo will be deleted"
                value="Todo is being edited now"
              />
            </form>

            <div data-cy="TodoLoader" className="modal overlay">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        )}

        {/* This todo is in loadind state */}
        {isLoadingTodoVisible && (
          <div data-cy="Todo" className="todo">
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
              />
            </label>

            <span data-cy="TodoTitle" className="todo__title">
              Todo is being saved now
            </span>

            <button type="button" className="todo__remove" data-cy="TodoDelete">
              ×
            </button>

            {/* 'is-active' class puts this modal on top of the todo */}
            <div data-cy="TodoLoader" className="modal overlay is-active">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        )}
      </TransitionGroup>
    </section>
  );
};
