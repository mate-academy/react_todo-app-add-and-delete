import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { Select } from '../types/Select';
import { Errors } from '../types/Errors';
import { postDelete } from '../api/todos';

type Props = {
  countItemLeft: () => number;
  selectedFilter: Select
  setSelectedFilter: (selectedFilter: Select) => void;
  todoList: Todo [] | null;
  setTodoList: (todoList: Todo[] | null) => void;
  setTypeError: (typeError: Errors) => void
  setNotificationError: (notificationError: boolean) => void
  setLoadersTodoId: (loadersTodosId: number[]) => void
};

export const Footer: React.FC<Props> = ({
  countItemLeft,
  selectedFilter,
  setSelectedFilter,
  todoList,
  setTodoList,
  setTypeError,
  setNotificationError,
  setLoadersTodoId,
}) => {
  const { ALL, ACTIVE, COMPLETED } = Select;

  const deleteClickHandler = () => {
    const completedTodo
    = todoList?.filter(todo => todo.completed).map(todo => todo.id);

    if (completedTodo) {
      setLoadersTodoId(completedTodo);
    }

    completedTodo?.forEach(todo => {
      postDelete(todo)
        .then(() => {
          if (todoList) {
            setTodoList(
              todoList.filter(todoFilter => {
                return !completedTodo.includes(todoFilter.id);
              }),
            );
          }
        })
        .catch(() => {
          setTypeError(Errors.REMOVE);
          setNotificationError(true);
        });
    });
  };

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${countItemLeft()} items left`}
      </span>
      <nav className="filter">
        <a
          href="#/"
          className={classNames(
            'filter__link',
            { selected: selectedFilter === ALL },
          )}
          onClick={() => {
            setSelectedFilter(ALL);
          }}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames(
            'filter__link',
            { selected: selectedFilter === ACTIVE },
          )}
          onClick={() => {
            setSelectedFilter(ACTIVE);
          }}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames(
            'filter__link',
            { selected: selectedFilter === COMPLETED },
          )}
          onClick={() => {
            setSelectedFilter(COMPLETED);
          }}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        onClick={deleteClickHandler}
        className={classNames(
          'todoapp__clear-completed',
          {
            'is-invisible': (!todoList?.find(todo => todo.completed)),
          },
        )}
      >
        Clear completed
      </button>

    </footer>
  );
};
