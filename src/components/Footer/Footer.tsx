import React from 'react';
import { Todo } from '../../types/Todo';
import { FilterMethods } from '../../types/FilterMethods';
import cn from 'classnames';
import { deleteTodo } from '../../api/todos';

type Props = {
  todos: Todo[];
  activeFilter: FilterMethods;
  setActiveFilter: React.Dispatch<React.SetStateAction<FilterMethods>>;
  setLoadingTodosId: React.Dispatch<React.SetStateAction<number[]>>;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
};

export const Footer: React.FC<Props> = ({
  todos,
  activeFilter,
  setActiveFilter,
  setLoadingTodosId,
  setTodos,
  setErrorMessage,
}) => {
  const hasCompletedTodos = todos.find(todo => todo.completed) !== undefined;

  const handleOnClickCLearAll = async () => {
    const completedTodos = todos.filter(todo => todo.completed);
    const completedIds = completedTodos.map(todo => todo.id);

    setLoadingTodosId(completedIds);

    try {
      const deleteCallback = async (todo: Todo) => {
        try {
          await deleteTodo(todo.id);

          return { id: todo.id, status: 'resolved' };
        } catch {
          setErrorMessage('Unable to delete a todo');

          return { id: todo.id, status: 'rejected' };
        }
      };

      const res = await Promise.allSettled(completedTodos.map(deleteCallback));

      const resolvedIds = res.reduce(
        (acc, item) => {
          if (item.status === 'fulfilled' && item.value.status === 'resolved') {
            return { ...acc, [item.value.id]: item.value.id };
          }

          return acc;
        },
        {} as Record<number, number>,
      );

      setTodos(currentTodos =>
        currentTodos.filter(todo => !resolvedIds[todo.id]),
      );
    } catch {
      setErrorMessage('Unable to clear completed todos');
    } finally {
      setLoadingTodosId([]);
    }
  };

  return (
    <>
      {todos.length !== 0 && (
        <footer className="todoapp__footer" data-cy="Footer">
          <span className="todo-count" data-cy="TodosCounter">
            {todos.filter(todo => !todo.completed).length} items left
          </span>

          <nav className="filter" data-cy="Filter">
            {Object.values(FilterMethods).map(method => {
              return (
                <a
                  href="#/"
                  className={cn('filter__link', {
                    selected: activeFilter === method,
                  })}
                  data-cy={`FilterLink${method}`}
                  onClick={() => setActiveFilter(method)}
                  key={method}
                >
                  {method}
                </a>
              );
            })}
          </nav>
          <button
            type="button"
            className="todoapp__clear-completed"
            data-cy="ClearCompletedButton"
            onClick={handleOnClickCLearAll}
            disabled={!hasCompletedTodos}
          >
            Clear completed
          </button>
        </footer>
      )}
    </>
  );
};
