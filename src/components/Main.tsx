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
    loading,
    setMessageError,
    setLoading,
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

  const handleRemoveTodo = (todoId: number) => {
    setLoading(true);
    setLoadingTodo(todoId);

    // // eslint-disable-next-line
    // console.log(todoId);
    // // eslint-disable-next-line
    // console.log(loading);
    // // eslint-disable-next-line
    // console.log(loadingTodo);

    const updatedTodos = todos.filter(todo => todo.id !== todoId);

    deleteTodo(todoId)
      .catch(error => {
        setMessageError(Errors.CantDelete);
        hideError(setMessageError);
        throw error;
      })
      .finally(() => {
        setTodos(updatedTodos);
        setLoading(false);
        setLoadingTodo(null);
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
      {filterTodos(todos, filter).map(todo => (
        <div
          key={todo.id}
          data-cy="Todo"
          className={classNames('todo has-background-white-ter1 loader1', {
            completed: todo.completed,
          })}
        >
          {/* eslint-disable-next-line */}
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={todo.completed}
              onClick={() => handleComplitedTodo(todo.id)}
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
                onKeyUp={event => handleKeyUp(event, todo.id)}
                autoFocus
                onBlur={() => handleSaveChanges(todo.id)}
              />
            </form>
          ) : (
            <>
              <span
                data-cy="TodoTitle"
                className="todo__title"
                onDoubleClick={() => handleDoubleClick(todo.id, todo.title)}
              >
                {todo.title}
              </span>

              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
                // onClick={() => handleRemoveTodo(todo.id)}
                onChange={() => handleRemoveTodo(todo.id)}
              >
                ×
              </button>
            </>
          )}

          {/* overlay will cover the todo while it is being deleted or updated */}
          {/* <div data-cy="TodoLoader" className="modal overlay is-active1"> */}
          <div
            data-cy="TodoLoader"
            className={classNames('modal overlay is-active1', {
              'is-active': loading && todo.id === loadingTodo,
              // 'is-active': loading,
              // 'is-active': todo.id === loadingTodo,
            })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}
    </section>
  );
};
