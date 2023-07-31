import { useContext, useState } from 'react';
import classNames from 'classnames';
import { ErrorOption, TodoContext } from '../context/TodoContext';

/* eslint-disable jsx-a11y/control-has-associated-label */
export const TodoHeader: React.FC = () => {
  const {
    loading,
    setLoading,
    todoInCreation,
    visibleTodos,
    activeTodosAmount,
    setError,
    addTodo,
  } = useContext(TodoContext);

  const [title, setTitle] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    if (!title.trim()) {
      setError(ErrorOption.TitleErr);
    }

    if (title) {
      const newTodo = addTodo(title);

      if (!newTodo) {
        setError(ErrorOption.AddError);

        return;
      }
    }

    setTitle('');
  };

  return (
    <header className="todoapp__header">
      {visibleTodos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: activeTodosAmount === 0,
          })}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={Boolean(todoInCreation) || loading}
        />
      </form>
    </header>
  );
};
