/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { Todo } from '../types/Todo';
import * as todoService from '../api/todos';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import React from 'react';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  filteredTodos: () => Todo[];
  destroy: (id: number) => void;
  error: React.Dispatch<React.SetStateAction<string>>;
  tempTodo: Todo | null;
};

export const TodoList: React.FC<Props> = ({
  filteredTodos,
  destroy,
  error,
  todos,
  setTodos,
  tempTodo,
}) => {
  const isNotCompletedTodoVisible = false;
  const isEditingTodoVisible = false;
  const isLoadingTodoVisible = false;
  const filter = filteredTodos();
  const toggleTodoCompletion = (todoId: number) => {
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
        }, 3000);
      });
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {filter.map(todo => (
          <CSSTransition key={todo.id} timeout={300} classNames="item">
            <TodoItem
              todo={todo}
              toggleTodoCompletion={toggleTodoCompletion}
              onDelete={() => destroy(todo.id)}
              onUpdate={handleTodoUpdate}
            />
          </CSSTransition>
        ))}
        {tempTodo && (
          <CSSTransition key="0" timeout={300} classNames="temp-item">
            <TodoItem
              isLoading={true}
              todo={tempTodo}
              toggleTodoCompletion={() => {}}
              onDelete={() => {}}
              onUpdate={() => {}}
            />
          </CSSTransition>
        )}
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
