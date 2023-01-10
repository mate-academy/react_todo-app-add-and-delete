/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { AuthContext } from './components/Auth/AuthContext';
import { TodoList } from './components/TodoList';
import { FilterList } from './components/FilterList';
import { getTodos, pushTodo } from './api/todos';
import { Todo } from './types/Todo';
import { ErrorNotification } from './components/ErrorNotification';
import { Filter } from './types/Filter';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [todoList, setTodoList] = useState<Todo[]>([]);
  const [visibleTodoList, setVisibleList] = useState<Todo[]>([]);
  const [newTitle, setNewTitle] = useState('');

  const [isAdding, setIsAdding] = useState(false);

  const [emptyFieldError, setEmptyError] = useState(false);
  const [failedAddError, setAddError] = useState(false);
  const [failedDeleteError, setDeleteError] = useState(false);

  const findTodos = async () => {
    const loadedTodos = await getTodos(user?.id) || null;

    setTodoList(loadedTodos);
    setVisibleList(loadedTodos);
  };

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    findTodos();
  }, []);

  const cancelErrors = () => {
    setEmptyError(false);
    setAddError(false);
  };

  const findNewTodoId = (): number => {
    if (todoList.length !== 0) {
      const max = todoList.reduce((a, b) => (a.id > b.id ? a : b));

      return max.id + 1;
    }

    return 1;
  };

  const pushTodos = async () => {
    const pushedTodo = await pushTodo(findNewTodoId(), newTitle, user?.id);

    setVisibleList(prevTodos => {
      return [...prevTodos, pushedTodo];
    });
    setTodoList(prevTodos => {
      return [...prevTodos, pushedTodo];
    });
  };

  const deleteTodos = (id: number) => {
    try {
      setVisibleList(prevTodos => {
        return (prevTodos.filter(item => item.id !== id));
      });
      setTodoList(prevTodos => {
        return (prevTodos.filter(item => item.id !== id));
      });
    } catch {
      setDeleteError(true);
    }
  };

  const countActiveItems = (): number => {
    let sum = 0;

    todoList.forEach(item => {
      if (!item.completed) {
        sum += 1;
      }

      return sum;
    });

    return sum;
  };

  const filterTodos = async (filterBy: Filter) => {
    setVisibleList(todoList);

    switch (filterBy) {
      case Filter.active:
        setVisibleList(prevTodos => {
          return (prevTodos.filter(item => !item.completed));
        });
        break;
      case Filter.completed:
        setVisibleList(prevTodos => {
          return (prevTodos.filter(item => item.completed));
        });
        break;
      case Filter.clearComplete:
        setVisibleList(prevTodos => {
          return (prevTodos.filter(item => !item.completed));
        });
        setTodoList(prevTodos => {
          return (prevTodos.filter(item => !item.completed));
        });
        break;
      default:
        break;
    }
  };

  const isCompletedTodo = () => {
    if (todoList.find(item => item.completed)) {
      return true;
    }

    return false;
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            data-cy="ToggleAllButton"
            type="button"
            className="todoapp__toggle-all active"
          />

          <form
            onSubmit={(event) => {
              event.preventDefault();
              if (newTitle.trim() === '') {
                setEmptyError(true);
              } else {
                try {
                  setIsAdding(true);
                  pushTodos();
                } catch {
                  setAddError(true);
                } finally {
                  setIsAdding(false);
                  setNewTitle('');
                  setTimeout(cancelErrors, 3000);
                }
              }
            }}
          >
            <input
              data-cy="NewTodoField"
              type="text"
              ref={newTodoField}
              value={newTitle}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              onChange={(event) => {
                setNewTitle(event.target.value);
              }}
              // eslint-disable-next-line no-unneeded-ternary
              disabled={isAdding ? (true) : (false)}
            />
          </form>
        </header>

        {user && (
          <section className="todoapp__main" data-cy="TodoList">
            <TodoList
              todos={visibleTodoList}
              onDelete={deleteTodos}
            />
          </section>
        )}

        {isAdding && (
          <div data-cy="Todo" className="todo">
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
              />
            </label>

            <span data-cy="TodoTitle" className="todo__title">{newTitle}</span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
            >
              ×
            </button>

            <div data-cy="TodoLoader" className="modal overlay is-active">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        )}

        <footer className="todoapp__footer" data-cy="Footer">
          <FilterList
            isCompletedTodo={isCompletedTodo()}
            itemCount={countActiveItems()}
            onFilter={filterTodos}
          />
        </footer>

      </div>

      <ErrorNotification
        emptyFieldError={emptyFieldError}
        failedAddError={failedAddError}
        failedDeleteError={failedDeleteError}
      />
    </div>
  );
};
