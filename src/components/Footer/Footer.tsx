import React from 'react';
import { ERROR, FilterBy } from '../../types/enums';
import { Todo } from '../../types/Todo';
import { deleteTodo } from '../../api/todos';

type Props = {
  todos: Todo[];
  filterQwery: FilterBy;
  setFilterQwery: (qwery: FilterBy) => void;
  setErrorMessage: (value: ERROR) => void;
  setTodos: (callback: (prev: Todo[]) => Todo[]) => void;
  todosLoading: number[];
  loading: {
    adIdToLoadingList: (id: number) => void;
    removeIdFromLoadingList: (id: number | null) => void;
  };
};

const footerComponent: React.FC<Props> = ({
  todos,
  setTodos,
  filterQwery,
  setFilterQwery,
  setErrorMessage,
  loading,
}) => {
  const activeTodos = todos.filter(item => item.completed);
  const activeCount = todos.length - activeTodos.length || 0;
  const isSomeDone = todos.some(item => item.completed);
  const filterOptions: (keyof typeof FilterBy)[] = Object.keys(
    FilterBy,
  ) as (keyof typeof FilterBy)[];

  // console.log('render footer');

  const filterChange = (input: FilterBy) => {
    const value = input;

    if (!value) {
      return;
    }

    setFilterQwery(value);
  };

  const onError = () => {
    setErrorMessage(ERROR.delete);
    loading.removeIdFromLoadingList(null);
  };

  const deleteAllCompleted = () => {
    activeTodos.forEach(async item => {
      loading.adIdToLoadingList(item.id);
      try {
        await deleteTodo(item.id);
        setTodos(prev => prev.filter(todo => todo.id !== item.id));
      } catch (error) {
        onError();
      } finally {
        loading.removeIdFromLoadingList(item.id);
      }
    });

    // setTodos(prev => prev.filter(item => !item.completed));
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeCount} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        {filterOptions.map(item => {
          const filterValue = FilterBy[item];

          return (
            <a
              href="#/"
              key={item}
              className={`filter__link ${filterQwery === filterValue && 'selected'}`}
              data-cy={filterValue}
              onClick={e =>
                filterChange(e.currentTarget.dataset.cy as FilterBy)
              }
            >
              {item}
            </a>
          );
        })}
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!isSomeDone}
        onClick={() => deleteAllCompleted()}
      >
        Clear completed
      </button>
    </footer>
  );
};

const areLoaded = (prevProps: Props, nextProps: Props) => {
  const todosChanged = prevProps.todos !== nextProps.todos;
  const todosLoadingEmpty = nextProps.todosLoading.length === 0;

  return todosChanged && !todosLoadingEmpty;
};

export const Footer = React.memo(footerComponent, areLoaded);
