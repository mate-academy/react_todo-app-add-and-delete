import classNames from 'classnames';
import React from 'react';
import { Todo } from '../types/Todo';
import { TabsFooter } from '../enums/TabsFooter';
import { deleteTodos } from '../api/todos';

type Props = {
  todos: Todo[],
  activeTab: string,
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  loading: boolean,
  setLoading: (v: boolean) => void,
  setErrorMessage: (v: string) => void,
  setHiddenError: (v: boolean) => void,
  setItemId: React.Dispatch<React.SetStateAction<number[]>>,
  itemId: number[],
  tempTodo: null | Todo,
};

export const ShowTodos: React.FC<Props> = ({
  todos,
  activeTab,
  setTodos,
  loading,
  setLoading,
  setErrorMessage,
  setHiddenError,
  setItemId,
  itemId,
  tempTodo,
}) => {
  const getVisibleTodos = (t: Todo[], at: string) => {
    switch (at) {
      case TabsFooter.Active:
        return t.filter((el) => !el.completed);
      case TabsFooter.Completed:
        return t.filter((el) => el.completed);
      default:
        return t;
    }
  };

  const handleCatch = () => {
    setHiddenError(false);
    setTimeout(() => setHiddenError(true), 3000);
    setErrorMessage('Unable to delete a todo');
  };

  const handleFinally = () => {
    setItemId([0]);
    setLoading(false);
  };

  const visibleTodos = getVisibleTodos(todos, activeTab);
  const handleDelete = (postId: number) => {
    setItemId((prev) => [...prev, postId]);
    setLoading(true);

    deleteTodos(postId).then(() => {
      setTodos(prev => (
        prev.filter(todo => todo.id !== postId)
      ));
    })
      .catch(() => handleCatch())
      .finally(() => handleFinally());
  };

  return (
    <section className="todoapp__main">
      {visibleTodos.map((todo) => (
        <div
          className={classNames('todo', { completed: todo.completed })}
          key={todo.id}
        >
          <label className="todo__status-label">
            <input
              type="checkbox"
              className="todo__status"
              checked={todo.completed}
            />
          </label>

          <span className="todo__title">{todo.title}</span>

          <button
            type="button"
            className="todo__remove"
            onClick={() => handleDelete(todo.id)}
          >
            ×
          </button>

          {loading && itemId.some((el) => el === todo.id) && (
            <div className="modal overlay is-active">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          )}

          {/* overlay will cover the todo while it is being updated */}
          {/* <div className="modal overlay">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div> */}
        </div>
      ))}

      {tempTodo && (
        <div
          className="todo"
        >
          <label className="todo__status-label">
            <input
              type="checkbox"
              className="todo__status"
            />
          </label>

          <span className="todo__title">{tempTodo.title}</span>

          <button
            type="button"
            className="todo__remove"
          >
            ×
          </button>

          <div className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}

      {/* This todo is being edited */}
      {/* <div className="todo">
        <label className="todo__status-label">
          <input type="checkbox" className="todo__status" />
        </label>

        <form>
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value="Todo is being edited now"
          />
        </form>

        <div className="modal overlay">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div> */}
    </section>
  );
};
