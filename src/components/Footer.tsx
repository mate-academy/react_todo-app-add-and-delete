import React from 'react';
import classNames from 'classnames';
import { ErrorType, Filter } from '../App';
import { Todo } from '../types/Todo';
import { deleteTodo } from '../api/todos';

type Props = {
  activeTodos: number;
  selectedFilter: string;
  setSelectedFilter: React.Dispatch<React.SetStateAction<Filter>>;
  completedTodos: number;
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setCurrentError: React.Dispatch<React.SetStateAction<ErrorType | ''>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDeleteAllPressed: React.Dispatch<React.SetStateAction<boolean>>;
};

export const Footer: React.FC<Props> = ({
  selectedFilter,
  activeTodos,
  setSelectedFilter,
  completedTodos,
  todos,
  setTodos,
  setCurrentError,
  setIsLoading,
  setIsDeleteAllPressed,
}) => {
  const handleDeleteAllCompleted = () => {
    const todos1 = todos.filter(todo => todo.completed);

    setIsDeleteAllPressed(true);
    setIsLoading(true);

    Promise.allSettled(todos1.map(todo => deleteTodo(todo.id.toString())))
      .then(results => {
        const successfulIds: number[] = [];
        let hasErrors = false;

        results.forEach((result, index) => {
          if (result.status === 'fulfilled') {
            successfulIds.push(todos1[index].id);
          } else {
            hasErrors = true;
          }
        });

        setTodos(prev => prev.filter(todo => !successfulIds.includes(todo.id)));

        if (hasErrors) {
          setCurrentError(ErrorType.UnableToDeleteTodo);
        }
      })
      .finally(() => {
        setIsLoading(false);
        setIsDeleteAllPressed(false);
      });
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodos} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(Filter).map((filter: Filter, index) => {
          return (
            <a
              href={`#/${filter}`}
              key={index}
              className={classNames('filter__link', {
                selected: selectedFilter === filter,
              })}
              data-cy={`FilterLink${filter}`}
              onClick={() => setSelectedFilter(filter)}
            >
              {filter}
            </a>
          );
        })}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={() => handleDeleteAllCompleted()}
        disabled={completedTodos === 0}
      >
        Clear completed
      </button>
    </footer>
  );
};
