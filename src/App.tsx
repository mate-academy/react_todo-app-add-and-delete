import React, {
  useContext,
  useEffect,
  useState,
  useRef,
} from 'react';
import classNames from 'classnames';
import { AuthContext } from './components/Auth/AuthContext';
import { Loader } from './components/Loader';
import { TodoList } from './components/TodoList';
import { Notification } from './components/Notification';

import { createTodo, getTodos, removeTodo } from './api/todos';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterKind, setFilterKind] = useState<Filter>(Filter.All);
  const [notification, setNotification] = useState<string>('');

  const [title, setTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [temporaryTodoTitle, setTemporaryTodoTitle] = useState('');
  const [deletedTodosId, setDeletedTodosId] = useState<number[]>([]);
  const completedTodos = todos.filter(todo => todo.completed);

  useEffect(() => {
    if (user) {
      getTodos(user.id).then(todosFromServer => {
        setTodos(todosFromServer);
        setIsLoading(false);
      })
        .catch(() => {
          setIsLoading(false);
          setNotification('Cannot load todos from server');
        });
    }
  }, []);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [todos]);

  const filterTodos = (option: Filter) => {
    switch (option) {
      case Filter.Active:
        return todos.filter(todo => !todo.completed);

      case Filter.Completed:
        return todos.filter(todo => todo.completed);

      default:
        return todos;
    }
  };

  const addTodo = async (newTodo: Omit<Todo, 'id'>) => {
    try {
      setTemporaryTodoTitle(title);
      setTitle('');
      const response = await createTodo(newTodo);
      const responseTodo = JSON.parse(JSON.stringify(response));

      const createdTodo = {
        id: responseTodo.id,
        userId: responseTodo.userId,
        title: responseTodo.title,
        completed: responseTodo.completed,
      };

      setTodos(currentTodos => ([...currentTodos, createdTodo]));
      setTemporaryTodoTitle('');
    } catch (e) {
      setNotification('Unable to add a todo');
    }

    setIsAdding(false);
  };

  const onDelete = async (todoId: number) => {
    setDeletedTodosId(current => ([...current, todoId]));

    try {
      await removeTodo(todoId);
      setDeletedTodosId(current => [...current].filter(id => id !== todoId));
      setTodos(
        currentTodo => ([...currentTodo.filter(todo => todo.id !== todoId)]),
      );
    } catch (e) {
      setNotification('Unable to delete a todo');
      setDeletedTodosId(current => [...current].filter(id => id !== todoId));
    }
  };

  const clearCompleted = () => {
    completedTodos.forEach(todo => onDelete(todo.id));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setNotification('');
    setIsAdding(true);

    if (!title || !/\S/.test(title)) {
      setNotification('Title can\'t be empty');
      setIsAdding(false);

      return;
    }

    const newTodo = {
      userId: user ? user.id : 0,
      title,
      completed: false,
    };

    addTodo(newTodo);
  };

  const visibleTodos = filterTodos(filterKind);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            data-cy="ToggleAllButton"
            type="button"
            aria-label="toggle-all-todos"
            className="todoapp__toggle-all active"
            onClick={() => {
              setNotification('Unable to update a todo');
            }}
          />

          <form onSubmit={handleSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              ref={newTodoField}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={title}
              onChange={event => setTitle(event.target.value)}
              disabled={isAdding}
            />
          </form>
        </header>

        {isLoading && <Loader />}

        {(todos.length !== 0 || isAdding) && (
          <>
            <TodoList
              todos={visibleTodos}
              onDelete={onDelete}
              deletedTodosId={deletedTodosId}
              isAdding={isAdding}
              temporaryTodoTitle={temporaryTodoTitle}
            />

            <footer className="todoapp__footer" data-cy="Footer">
              <span className="todo-count" data-cy="todosCounter">
                {`${todos.filter(todo => !todo.completed).length} items left`}
              </span>

              <nav className="filter" data-cy="Filter">
                <a
                  data-cy="FilterLinkAll"
                  href="#/"
                  className={classNames(
                    'filter__link',
                    { selected: filterKind === Filter.All },
                  )}
                  onClick={() => setFilterKind(Filter.All)}
                >
                  All
                </a>

                <a
                  data-cy="FilterLinkActive"
                  href="#/active"
                  className={classNames(
                    'filter__link',
                    { selected: filterKind === Filter.Active },
                  )}
                  onClick={() => setFilterKind(Filter.Active)}
                >
                  Active
                </a>
                <a
                  data-cy="FilterLinkCompleted"
                  href="#/completed"
                  className={classNames(
                    'filter__link',
                    { selected: filterKind === Filter.Completed },
                  )}
                  onClick={() => setFilterKind(Filter.Completed)}
                >
                  Completed
                </a>
              </nav>

              <button
                data-cy="ClearCompletedButton"
                type="button"
                className="todoapp__clear-completed"
                disabled={completedTodos.length === 0}
                onClick={clearCompleted}
              >
                Clear completed
              </button>
            </footer>
          </>
        )}
      </div>

      <Notification
        notification={notification}
        onSetNotification={setNotification}
      />
    </div>
  );
};
