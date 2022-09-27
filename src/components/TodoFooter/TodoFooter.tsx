import React from 'react';
import classNames from 'classnames';

import { Todo } from '../../types/Todo';
import { TodoFilter } from '../TodoFilter';
import { Filter } from '../../types/Filter';

import { deleteTodo, getTodos } from '../../api/todos';

type Props = {
  todos: Todo[],
  filter: Filter,
  setFilter: React.Dispatch<React.SetStateAction<Filter>>,
  setIsClearButtonClicked: React.Dispatch<React.SetStateAction<boolean>>,
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
};

export const TodoFooter: React.FC<Props> = ({
  todos,
  setFilter,
  filter,
  setIsClearButtonClicked,
  setTodos,
}) => {
  const handleClearButton = () => {
    todos.forEach(async todo => {
      setIsClearButtonClicked(true);
      if (todo.completed) {
        await deleteTodo(todo.id);
      }

      await getTodos(todo.userId).then(setTodos);
      setIsClearButtonClicked(false);
    });
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${todos.length} items left`}
      </span>

      <TodoFilter
        setFilter={setFilter}
        filter={filter}
      />

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className={classNames('todoapp__clear-completed', {
          'is-hidden': !todos.some(todo => todo.completed),
        })}
        onClick={handleClearButton}
      >
        Clear completed
      </button>
    </footer>
  );
};
