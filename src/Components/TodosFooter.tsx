import classNames from 'classnames';
import React, { Dispatch, SetStateAction } from 'react';
import { filterTodos } from './Todolist';
import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

interface T {
  todos: Todo[]
  setTodos: Dispatch<SetStateAction<Todo[]>>
  filterType: string
  setFilterType: Dispatch<SetStateAction<string>>
  setIsError: Dispatch<SetStateAction<boolean>>
  setTempTodo: Dispatch<SetStateAction<Todo | null>>
}

export const TodosFooter: React.FC<T> = (
  {
    todos,
    setTodos,
    filterType,
    setFilterType,
    setIsError,
    setTempTodo,
  },
) => {
  const localFilterTodos = todos.filter(todo => !todo.completed).length;

  const deleted = async (todo: Todo) => {
    await client.delete(`/todos/${todo.id}`);
  };

  const handleAllDelete = async () => {
    const newTodos = todos.map(todo => {
      if (todo.completed) {
        return { ...todo, isLoading: true };
      }

      return todo;
    });

    setTodos(newTodos);

    try {
      setTimeout(() => {
        todos
          .filter(todo => todo.completed)
          .forEach(todo => {
            deleted(todo);
          });

        setTodos(todos.filter(todo => !todo.completed));
      }, 1000);
    } catch (error) {
      setIsError(true);
      setTimeout(() => {
        setIsError(false);
      }, 3000);
    } finally {
      setTimeout(() => {
        setTempTodo(null);
      }, 3000);
    }
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {localFilterTodos !== 1 ? `${localFilterTodos} items left` : '1 item left'}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          data-cy="FilterLinkAll"
          className={classNames('filter__link',
            { selected: filterType === 'all' })}
          onClick={() => setFilterType('all')}
        >
          All
        </a>

        <a
          href="#/active"
          data-cy="FilterLinkActive"
          className={classNames('filter__link',
            { selected: filterType === 'active' })}
          onClick={() => setFilterType('active')}
        >
          Active
        </a>
        <a
          href="#/completed"
          data-cy="FilterLinkCompleted"
          className={classNames('filter__link',
            { selected: filterType === 'completed' })}
          onClick={() => setFilterType('completed')}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className={classNames('todoapp__clear-completed',
          { hidden: filterTodos(todos, 'completed').length === 0 })}
        data-cy="ClearCompletedButton"
        onClick={handleAllDelete}
      >
        Clear completed
      </button>
    </footer>
  );
};
