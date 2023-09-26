import React from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { Navigation } from '../Navigation';
import { Filters } from '../../types/Filters';
import { client } from '../../utils/fetchClient';

type Props = {
  todos: Todo[]
  setTodos: (callback: (todos: Todo[]) => Todo[]) => void
  filterTodos: Filters
  setFilterTodos: (option: Filters) => void
  setErrorMessage: (message: string) => void
  completedTodoCount: boolean
  setLoadingItems: (id: (prevState: number[]) => number[]) => void
};

export const Footer: React.FC<Props> = ({
  todos,
  setTodos,
  filterTodos,
  setFilterTodos,
  setErrorMessage,
  completedTodoCount,
  setLoadingItems,
}) => {
  const itemsLeft = (): number => {
    const activeTasks = todos.filter((task) => !task.completed);

    return activeTasks.length;
  };

  const handleDelete = () => {
    const todosToDelete = todos.filter(
      (todo) => todo.completed,
    );

    todosToDelete.forEach((todo) => {
      setLoadingItems((prevState) => {
        return [...prevState, todo.id];
      });
      client.delete(`/todos/${todo.id}`)
        .then(() => {
          setTodos((prevState: Todo[]) => {
            return prevState
              .filter((toDelete: Todo) => toDelete.id !== todo.id);
          });
        })
        .catch(() => {
          setErrorMessage('Unable to delete a todo');
        })
        .finally(() => setLoadingItems((prevState) => {
          return prevState.filter((id) => id !== todo.id);
        }));
    });
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${itemsLeft()} items left`}
      </span>

      <Navigation filterTodos={filterTodos} setFilterTodos={setFilterTodos} />

      {/* don't show this button if there are no completed todos */}
      <button
        type="button"
        className={classNames('todoapp__clear-completed', {
          hidden: !completedTodoCount,
        })}
        data-cy="ClearCompletedButton"
        onClick={handleDelete}
      >
        Clear completed
      </button>
    </footer>
  );
};
