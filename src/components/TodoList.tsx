import classNames from 'classnames';
import { useEffect, useMemo, useState } from 'react';
import { useTodoContext } from '../context';
import { Todo } from '../types/Todo';
import { deleteTodo } from '../api/todos';

type Props = {
  tempTodo: Todo | null
};

export const TodoList = ({ tempTodo }: Props) => {
  const {
    activeFilter,
    handleTodosFilter,
    visibleTodos,
    setVisibleTodos,
    allTodos,
    errorHandler,
    setAllTodos,
    inputRef,
  } = useTodoContext();

  const [isLoading, setIsLoading] = useState<number | boolean>(false);

  const handleTodoDelete = (id: number) => {
    setIsLoading(id);

    const deletingTodo = async () => {
      try {
        if (allTodos) {
          await deleteTodo(id);
          const updatedTodo = allTodos.filter(todo => todo.id !== id);

          setAllTodos(updatedTodo);
        }
      } catch (error) {
        errorHandler('Unable to delete todo');
      } finally {
        setIsLoading(false);
      }
    };

    deletingTodo();
  };

  const handleClearCompleted = async () => {
    if (allTodos) {
      const completedTodos = allTodos.filter(todo => todo.completed);

      try {
        await Promise.all(completedTodos.map(todo => deleteTodo(todo.id)));
        setAllTodos(allTodos.filter(todo => !todo.completed));
      } catch (error) {
        errorHandler('Unable to delete todo');
      }
    }
  };

  const activeTodos = useMemo(() => {
    let counter = 0;

    allTodos?.forEach(todo => {
      if (!todo.completed) {
        counter += 1;
      }
    });

    return counter;
  }, [allTodos]);

  useEffect(() => {
    setVisibleTodos(allTodos);
  }, [allTodos, setVisibleTodos]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [allTodos, inputRef]);

  return (
    <>
      {visibleTodos?.map(todo => (
        <div
          key={todo.id}
          data-cy="Todo"
          className={classNames('todo', { 'todo completed': todo.completed })}
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={todo.completed}
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {todo.title}
          </span>

          {/* Remove button appears only on hover */}
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleTodoDelete(todo.id)}
          >
            ×
          </button>
          <div
            data-cy="TodoLoader"
            className={classNames('modal overlay', {
              'is-active': todo.id === isLoading,
            })}
          >
            <div
              className="modal-background has-background-white-ter"
            />
            <div className="loader" />
          </div>
        </div>
      ))}
      {tempTodo
              && (
                <div data-cy="Todo" className="todo">
                  <label className="todo__status-label">
                    <input
                      data-cy="TodoStatus"
                      type="checkbox"
                      className="todo__status"
                    />
                  </label>

                  <span data-cy="TodoTitle" className="todo__title">
                    {tempTodo.title}
                  </span>
                  <button
                    type="button"
                    className="todo__remove"
                    data-cy="TodoDelete"
                  >
                    ×
                  </button>

                  <div data-cy="TodoLoader" className="modal overlay is-active">
                    <div
                      className="modal-background has-background-white-ter"
                    />
                    <div className="loader" />
                  </div>
                </div>
              )}
      {visibleTodos
              && (
                <footer className="todoapp__footer" data-cy="Footer">
                  <span className="todo-count" data-cy="TodosCounter">
                    {`${activeTodos} items left`}
                  </span>

                  {/* Active filter should have a 'selected' class */}
                  <nav className="filter" data-cy="Filter">
                    <a
                      href="#/"
                      className={classNames('filter__link', {
                        selected: activeFilter === 'All',
                      })}
                      data-cy="FilterLinkAll"
                      onClick={() => handleTodosFilter('All')}
                    >
                      All
                    </a>

                    <a
                      href="#/active"
                      className={classNames('filter__link', {
                        selected: activeFilter === 'Active',
                      })}
                      data-cy="FilterLinkActive"
                      onClick={() => handleTodosFilter('Active')}
                    >
                      Active
                    </a>

                    <a
                      href="#/completed"
                      className={classNames('filter__link', {
                        selected: activeFilter === 'Completed',
                      })}
                      data-cy="FilterLinkCompleted"
                      onClick={() => handleTodosFilter('Completed')}
                    >
                      Completed
                    </a>
                  </nav>

                  {/* don't show this button if there are no completed todos */}
                  {visibleTodos.some(todo => todo.completed)
                  && (
                    <button
                      type="button"
                      className="todoapp__clear-completed"
                      data-cy="ClearCompletedButton"
                      onClick={handleClearCompleted}
                    >
                      Clear completed
                    </button>
                  )}
                </footer>
              )}
    </>
  );
};
