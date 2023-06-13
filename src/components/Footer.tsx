import classNames from 'classnames';
import React from 'react';
import { SortType, Todo } from '../Types';
import { client } from '../utils/client';

interface Props {
  numberOfActiveTodos: number,
  selectedTab: SortType,
  setSelectedTab: (sortingType: SortType) => void,
  isThereCompletedTodos: boolean,
  todo: Todo[],
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  setDeleteErrorMessage: React.Dispatch<React.SetStateAction<string>>,
}

export const Footer: React.FC<Props> = ({
  numberOfActiveTodos,
  selectedTab,
  setSelectedTab,
  isThereCompletedTodos,
  todo,
  setTodos,
  setDeleteErrorMessage,
}) => {
  const deleteCompletedTodos = async () => {
    const completedTodoIds = todo
      .filter((element) => element.completed)
      .map((element) => element.id);

    try {
      await Promise.all(
        completedTodoIds.map((id) => client.delete(`/todos/${id}`)),
      );

      setTodos((prevTodo) => prevTodo.filter((element) => !element.completed));
    } catch (error) {
      setDeleteErrorMessage('Unable to delete completed todos');
      throw Error('There is an issue deleting completed todos.');
    }
  };

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${numberOfActiveTodos} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: selectedTab === SortType.All,
          })}
          onClick={() => setSelectedTab(SortType.All)}
          role="button"
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: selectedTab === SortType.Active,
          })}
          onClick={() => setSelectedTab(SortType.Active)}
          role="button"
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: selectedTab === SortType.Completed,
          })}
          onClick={() => setSelectedTab(SortType.Completed)}
          role="button"
        >
          Completed
        </a>
      </nav>

      {isThereCompletedTodos ? (
        <button
          type="button"
          className="todoapp__clear-completed"
          onClick={deleteCompletedTodos}
        >
          Clear completed
        </button>
      ) : <div className="todoapp__filler-div" />}
    </footer>
  );
};
