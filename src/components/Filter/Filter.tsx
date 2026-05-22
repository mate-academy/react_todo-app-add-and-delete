import '../../styles/filter.scss';
import { Filter as Filters, Todo } from '../../types/Todo';
import { Dispatch, SetStateAction } from 'react';
import React from 'react';
import * as postService from '../../api/todos';
import { ErrorMessage } from '../../types/ErrorMessage';

type Props = {
  posts: Todo[];
  filter: Filters | undefined;
  setPosts: Dispatch<SetStateAction<Todo[]>>;
  setFilter: React.Dispatch<React.SetStateAction<Filters>>;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
};

const items: Filters[] = [Filters.all, Filters.active, Filters.completed];

export const Filter: React.FC<Props> = ({
  posts,
  setPosts,
  setFilter,
  setErrorMessage,
  filter,
}) => {
  const anyCompleted = posts.some(post => post.completed);
  const todosCounter = posts.filter(post => !post.completed);
  const clearCompleted = async () => {
    const completedTodos = posts.filter(todo => todo.completed);
    const results = await Promise.allSettled(
      completedTodos.map(todo => postService.deletePost(todo.id)),
    );

    setPosts(post =>
      post.filter(
        todos =>
          !todos.completed ||
          results[completedTodos.findIndex(t => t.id === todos.id)]?.status !==
            'fulfilled',
      ),
    );
    // Якщо хоч одне видалення не вдалося — показуємо помилку
    if (results.some(result => result.status === 'rejected')) {
      setErrorMessage(ErrorMessage.DeleteTodo);
    }
  };

  const handleFilter =
    (next: Filters) => (event: React.MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      setFilter(next);
      setErrorMessage('');
    };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todosCounter.length} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {items.map(fil => (
          <a
            key={fil}
            href={fil === 'all' ? '#/' : `#/${fil}`}
            className={`filter__link${filter === fil ? ' selected' : ''}`}
            onClick={handleFilter(fil)}
            data-cy={`FilterLink${fil.charAt(0).toUpperCase() + fil.slice(1)}`}
          >
            {fil.charAt(0).toUpperCase() + fil.slice(1)}
          </a>
        ))}
      </nav>
      {/* {anyCompleted ? ( */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={clearCompleted}
        disabled={!anyCompleted}
      >
        Clear completed
      </button>
      {/* ) : null} */}
    </footer>
  );
};
