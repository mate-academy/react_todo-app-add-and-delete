import React, { useContext, useState } from 'react';
import { TodosContext } from './TodosContext';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { FilterStatus } from '../types/FilterStatus';
import { deleteTodo } from '../api/todos';
import { Errors } from '../types/Errors';
import { hideError } from '../functions/hideError';

const filterTodos = (t: Todo[], filterBy: FilterStatus) => {
  switch (filterBy) {
    case FilterStatus.Active:
      return t.filter(todo => !todo.completed);
    case FilterStatus.Completed:
      return t.filter(todo => todo.completed);
    default:
      return t;
  }
};

export const Main: React.FC = () => {
  const {
    todos,
    setTodos,
    filter,
    setMessageError,
    setLoadingTodo,
    loadingTodo,
  } = useContext(TodosContext);

  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [newTodoTitle, setNewTodoTitle] = useState('');

  const handleDoubleClick = (todoId: number, todoTitle: string) => {
    setEditingTodoId(todoId);
    setNewTodoTitle(todoTitle);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoTitle(event.target.value);
  };

  const handleRemoveTodo = (todoId: number): Promise<void> => {
    setLoadingTodo([todoId]);

    const updatedTodos = todos.filter(todo => todo.id !== todoId);

    return deleteTodo(todoId)
      .then(() => setTodos(updatedTodos))
      .catch(error => {
        setMessageError(Errors.CantDelete);
        hideError(setMessageError);
        setTodos(todos);
        throw error;
      })
      .finally(() => {
        setLoadingTodo([]);
      });
  };

  const handleSaveChanges = (todoId: number) => {
    if (!newTodoTitle.trim()) {
      handleRemoveTodo(todoId);
      setNewTodoTitle('');

      return;
    }

    const updatedTodos = todos.map(todo =>
      todo.id === todoId ? { ...todo, title: newTodoTitle } : todo,
    );

    setTodos(updatedTodos);
    setEditingTodoId(null);
  };

  const handleCancelEditing = () => {
    setEditingTodoId(null);
    setNewTodoTitle('');
  };

  const handleKeyUp = (
    event: React.KeyboardEvent<HTMLInputElement>,
    todoId: number,
  ) => {
    if (event.key === 'Enter') {
      handleSaveChanges(todoId);
    } else if (event.key === 'Escape') {
      handleCancelEditing();
    }
  };

  const handleComplitedTodo = (todoId: number) => {
    const updatedTodos = todos.map(todo => {
      if (todo.id === todoId) {
        return { ...todo, completed: !todo.completed };
      }

      return todo;
    });

    setTodos(updatedTodos);
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filterTodos(todos, filter).map(todo => {
        const { id, title, completed } = todo;

        return (
          <div
            key={todo.id}
            data-cy="Todo"
            className={classNames('todo has-background-white-ter1 loader1', {
              completed: completed,
            })}
          >
            {/* I don't know how to fix this control, we was disdusting this issue
            with mentor in chat but the issue doesn't gone.
            If you know how to do that please let me know. */}
            {/* eslint-disable-next-line */}
            <label htmlFor={`${id}`} className="todo__status-label">
              <input
                id={`${id}`}
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                checked={todo.completed}
                onChange={() => handleComplitedTodo(id)}
              />
            </label>

            {editingTodoId === todo.id ? (
              <form onSubmit={event => event.preventDefault()}>
                <input
                  data-cy="TodoTitleField"
                  type="text"
                  className="todo__title-field"
                  placeholder="Empty todo will be deleted"
                  value={newTodoTitle}
                  onChange={handleInputChange}
                  onKeyUp={event => handleKeyUp(event, id)}
                  autoFocus
                  onBlur={() => handleSaveChanges(id)}
                />
              </form>
            ) : (
              <>
                <span
                  data-cy="TodoTitle"
                  className="todo__title"
                  onDoubleClick={() => handleDoubleClick(id, title)}
                >
                  {todo.title}
                </span>

                <button
                  type="button"
                  className="todo__remove"
                  data-cy="TodoDelete"
                  onClick={() => handleRemoveTodo(id)}
                >
                  ×
                </button>
              </>
            )}

            <div
              data-cy="TodoLoader"
              className={classNames('modal overlay is-active1', {
                'is-active': loadingTodo?.includes(id),
              })}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        );
      })}
    </section>
  );
};
