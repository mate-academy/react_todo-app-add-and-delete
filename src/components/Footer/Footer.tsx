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
    const completedTodosId = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    setLoadingTodosId(prev => [...prev, ...completedTodosId]);

    try {
      const results = await Promise.allSettled(
        completedTodosId.map(id => deleteTodo(id)),
      );

      const successfulDeletions = results
        .filter(result => result.status === 'fulfilled')
        .map((_, index) => completedTodosId[index]);

      setTodos(todos.filter(todo => !successfulDeletions.includes(todo.id)));

      if (results.some(result => result.status === 'rejected')) {
        setErrorMessage('Unable to delete some todos');
      }
    } catch (error) {
      setErrorMessage('Unable to delete a todo');
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
