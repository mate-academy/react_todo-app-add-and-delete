import React, { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { ErrorMessageEnum } from '../../types/ErrorMessageEnum';
import { Query } from '../../types/Query';
import { QueryEnum } from '../../types/QueryEnum';
import { deleteTodo } from '../../api/todos';

interface Props {
  allTodos: Todo[],
  setAllTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  setErrorMessage: React.Dispatch<React.SetStateAction<'' | ErrorMessageEnum>>
  setQuery: React.Dispatch<React.SetStateAction<Query>>,
}

export const Footer: React.FC<Props> = ({
  allTodos,
  setAllTodos = () => { },
  setTodos = () => { },
  setErrorMessage = () => { },
  setQuery = () => { },
}) => {
  const [selected, setSelected] = useState<Query>(QueryEnum.All);

  const activeTodos = [...allTodos]
    .filter(todo => !todo.completed);

  const completedTodos = [...allTodos]
    .filter(todo => todo.completed);

  const handleSetQueryClick = (value: Query) => {
    setSelected(value);
    setQuery(value);
  };

  const deleteCompletedTodos = async () => {
    try {
      await Promise.all(completedTodos.map(todo => deleteTodo(todo.id)));

      setTodos(prevTodos => prevTodos
        .filter(todo => !todo.completed));

      setAllTodos(prevTodos => prevTodos
        .filter(todo => !todo.completed));
    } catch {
      setErrorMessage(ErrorMessageEnum.DeleteTodoError);
    }
  };

  return (
    <>
      {
        !!allTodos.length && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {`${activeTodos.length} items left`}
            </span>

            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={classNames('filter__link', {
                  selected: selected === QueryEnum.All,
                })}
                onClick={() => handleSetQueryClick(QueryEnum.All)}
                data-cy="FilterLinkAll"
              >
                All
              </a>

              <a
                href="#/active"
                className={classNames('filter__link', {
                  selected: selected === QueryEnum.Active,
                })}
                onClick={() => handleSetQueryClick(QueryEnum.Active)}
                data-cy="FilterLinkActive"
              >
                Active
              </a>

              <a
                href="#/completed"
                className={classNames('filter__link', {
                  selected: selected === QueryEnum.Completed,
                })}
                onClick={() => handleSetQueryClick(QueryEnum.Completed)}
                data-cy="FilterLinkCompleted"
              >
                Completed
              </a>
            </nav>

            {
              !!completedTodos.length && (
                <button
                  type="button"
                  className="todoapp__clear-completed"
                  onClick={deleteCompletedTodos}
                  data-cy="ClearCompletedButton"
                >
                  Clear completed
                </button>
              )
            }
          </footer>
        )
      }
    </>
  );
};
