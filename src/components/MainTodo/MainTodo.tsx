/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { FC, useContext, useState } from 'react';
import classNames from 'classnames';

import { LoaderTodo } from '../Loader/LoaderTodo';
import { TodoDispatch } from '../../Context/TodoContext';
import { FilterContext } from '../../Context/FilterContext';
import { ButtonMain } from './ButtonMain';
import { FormMain } from './FormMain';
import { Todo } from '../../types/Todo';

type TProps = {
  loading: boolean;
  tempTodo: Todo | null;
  showError: (err: string) => void;
  setLoading: (bool: boolean) => void;
};

export const MainTodo: FC<TProps> = ({
  loading,
  showError,
  setLoading,
  tempTodo,
}) => {
  const [editableTodoId, setEditableTodoId] = useState<string | null>(null);
  const [deleteLoadingId, setDeleteLoadingId] = useState<string | null>(null);
  const { filteredTodos } = useContext(FilterContext);
  const dispatch = useContext(TodoDispatch);

  const handleDoubleClick = (id: string) => {
    setEditableTodoId(id);
  };

  const handleDeleteClick = (id: string) => {
    setDeleteLoadingId(id);
  };

  const checkTodo = async (id: string) => {
    setLoading(true);

    try {
      await dispatch({ type: 'CHECK_TODO', payload: id });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => {
        const { title, completed, id } = todo;
        const isEditable = editableTodoId === id;

        return (
          <>
            <div
              data-cy="Todo"
              className={classNames('todo', {
                completed: completed,
              })}
              title="Change"
              key={id}
            >
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                  checked={completed}
                  onChange={() => checkTodo(id)}
                />
              </label>

              {isEditable ? (
                <>
                  <FormMain
                    id={id}
                    title={title}
                    setEditableTodoId={() => setEditableTodoId(null)}
                    showError={showError}
                    setLoading={setLoading}
                  />
                </>
              ) : (
                <>
                  <span
                    data-cy="TodoTitle"
                    className="todo__title"
                    onDoubleClick={() => handleDoubleClick(id)}
                  >
                    {title}
                  </span>
                  <ButtonMain
                    id={id}
                    showError={showError}
                    setLoading={setLoading}
                    loading={loading}
                    onDeleteClick={() => handleDeleteClick(id)}
                  />
                </>
              )}
              <LoaderTodo loading={deleteLoadingId === id} />
            </div>
          </>
        );
      })}
      {tempTodo !== null && (
        <div className="todo">
          <LoaderTodo loading={true} />
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
            />
          </label>
          <span className="todo__title">{tempTodo.title}</span>
        </div>
      )}
    </section>
  );
};
