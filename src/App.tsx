import {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import classNames from 'classnames';
import { Todo } from './types/Todo';
import { addTodo, getTodos, removeTodo } from './api/todos';
import { TodoList } from './components/TodoList';
import { Loader } from './components/Loader';
import { FilterBy } from './types/FilteredBy';
import { TodoFilter } from './components/TodoFilter';
import { Form } from './components/Form';
import { ErrorMessage } from './components/ErrorMessage';
import { setSingleOrPluralWordByCount } from './HelpersFunctions';

const USER_ID = 6894;

function filterTodosByCompleted(todos: Todo[], filterBy: FilterBy): Todo[] {
  switch (filterBy) {
    case FilterBy.ACTIVE:
      return todos.filter(todo => !todo.completed);

    case FilterBy.COMPLETED:
      return todos.filter(todo => todo.completed);

    default:
      return todos;
  }
}

export interface TodoItem {
  todo: Todo,
  isLoading: boolean,
}

export const App: FC = () => {
  const [allTodos, setAllTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [todoTitle, setTodoTitle] = useState('');
  const [filterType, setFilterType] = useState<FilterBy>(FilterBy.ALL);
  const [tempTodos, setTempTodos] = useState<Todo | null>(null);
  const [activeInput, setActiveInput] = useState(true);
  const [isQuery, setIsQuery] = useState(false);
  const [deletedTodoIds, setDeletedTodoIds] = useState<number[]>([]);

  const addError = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  };

  const loadAllTodos = async () => {
    try {
      const todos = await getTodos(USER_ID);

      setAllTodos(todos);
      setIsQuery(true);
    } catch {
      addError('Unable to update a todo');
    } finally {
      setTempTodos(null);
      setActiveInput(true);
    }
  };

  const handleRemoveTodo = useCallback(
    async (id: number) => {
      try {
        setDeletedTodoIds(prev => [...prev, id]);
        await removeTodo(id)
          .then(() => {
            const todosWithoutDeleted = allTodos.filter((todo) => (
              todo.id !== id
            ));

            setAllTodos(todosWithoutDeleted);
          });
      } catch {
        setErrorMessage('Unable to delete a todo');
      } finally {
        setDeletedTodoIds([]);
      }
    }, [allTodos],
  );

  useEffect(() => {
    loadAllTodos();
  }, []);

  const handleRemoveAllComplitedTodo = useCallback(async () => {
    const completedTodos = allTodos.filter(({ completed }) => completed);

    completedTodos.forEach(async todo => {
      try {
        setDeletedTodoIds(prev => [...prev, todo.id]);
        await removeTodo(todo.id)
          .then(() => {
            const todosWithoutDeleted = allTodos.filter(({ completed }) => (
              !completed
            ));

            setAllTodos(todosWithoutDeleted);
          });
      } catch {
        setErrorMessage('Unable to delete a todo');
      } finally {
        setDeletedTodoIds([]);
      }
    });
  }, [allTodos]);

  const visibleTodos = useMemo(() => {
    return filterTodosByCompleted(allTodos, filterType);
  }, [allTodos, filterType]);

  const countActiveTodos = filterTodosByCompleted(
    allTodos,
    FilterBy.ACTIVE,
  ).length;

  const isComplitedTodo = allTodos.length - countActiveTodos > 0;
  const isActiveTodo = countActiveTodos > 0;

  const handleAddNewTodo = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!todoTitle.trim()) {
        addError('Title can not be empty');

        return;
      }

      const newTodo = {
        userId: USER_ID,
        title: todoTitle,
        completed: false,
      };

      setTempTodos({ ...newTodo, id: 0 });
      setActiveInput(false);

      addTodo(newTodo)
        .then(todo => {
          setAllTodos(todos => [...todos, todo]);
        })
        .catch(() => addError('Unable to add a todo'))
        .finally(() => {
          setActiveInput(true);
          setTodoTitle('');
          setTempTodos(null);
        });
    }, [todoTitle],
  );

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            aria-label="clear"
            type="button"
            className={classNames(
              'todoapp__toggle-all',
              {
                active: isActiveTodo,
              },
            )}
          />

          <Form
            handleAddTodo={handleAddNewTodo}
            todoTitle={todoTitle}
            setTodoTitle={setTodoTitle}
            activeInput={activeInput}
          />
        </header>

        {(!allTodos.length && isQuery)
        && (
          <span style={{
            display: 'flex',
            justifyContent: 'center',
            color: 'grey',
          }}
          >
            You have not any todos
          </span>
        )}

        {allTodos.length === 0
        && errorMessage.length === 0
        && !isQuery
          ? (
            <Loader />
          ) : (
            <section className="todoapp__main">
              <TodoList
                todos={visibleTodos}
                tempTodos={tempTodos}
                handleRemoveTodo={handleRemoveTodo}
                deletedTodoIds={deletedTodoIds}
              />
            </section>
          )}

        {allTodos.length === 0
        || (
          <footer className="todoapp__footer">
            <span className="todo-count">
              {`${countActiveTodos} ${setSingleOrPluralWordByCount('item', countActiveTodos)} left`}
            </span>

            <nav className="filter">
              <TodoFilter
                filteredTodos={filterType}
                setFilteredTodos={setFilterType}
              />
            </nav>

            {isComplitedTodo
            && (
              <button
                type="button"
                className="todoapp__clear-completed"
                onClick={handleRemoveAllComplitedTodo}
              >
                Clear completed
              </button>
            )}

          </footer>
        )}
      </div>

      <ErrorMessage
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
