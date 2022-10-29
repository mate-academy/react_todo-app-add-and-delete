import React, {
  useContext, useEffect, useRef, useState, useMemo,
} from 'react';
import classNames from 'classnames';
import { AuthContext } from './components/Auth/AuthContext';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import { getTodos, postTodos, deleteTodos } from './api/todos';
import { TodoFooter } from './components/TodoFooter';
import { Status } from './types/Status';
import { TodoError } from './components/TodoError';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState(Status.All);
  const [isAdding, setIsAdding] = useState(false);
  const [addedTodo, setAddedTodo] = useState<Todo | null>(null);
  const [isChanging, setIsChanging] = useState(false);

  const loadTodos = async () => {
    try {
      if (user) {
        const todosFromServer = await getTodos(user.id);

        setTodos(todosFromServer);
      }
    } catch {
      setError('Unable to load todos');
    }
  };

  const addTodos = async (todo: Todo) => {
    setIsAdding(true);

    try {
      const newTodo = await postTodos(todo);

      setTodos(prevTodos => [...prevTodos, newTodo]);
    } catch {
      setError('Unable to add todo');
    } finally {
      setIsAdding(false);
      setAddedTodo(null);
    }
  };

  const removeTodos = async (todo: Todo) => {
    setIsChanging(true);

    try {
      const removedTodo = await deleteTodos(todo.id);

      setTodos(todos.filter(item => item.id !== removedTodo.id));
    } catch {
      setError('Unable to delete a todo');
    } finally {
      setIsChanging(false);
    }
  };

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    loadTodos();
  }, []);

  const handleNewTodoKeyDown = (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const val = newTodoField.current?.value;

    if (!val) {
      setError('Title can\'t be empty');

      return;
    }

    const newTodo: Todo = {
      id: 0,
      userId: user ? user.id : 0,
      title: val,
      completed: false,
    };

    setAddedTodo(newTodo);
    addTodos(newTodo);
    newTodoField.current.value = '';
  };

  const handleClearCompleted = () => {
    todos.filter(todo => todo.completed)
      .forEach(todo => removeTodos(todo));
  };

  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (filter) {
        case Status.Active:
          return !todo.completed;

        case Status.Completed:
          return todo.completed;

        default:
          return true;
      }
    });
  }, [todos, filter]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            data-cy="ToggleAllButton"
            type="button"
            className={classNames(
              { 'todoapp__toggle-all': todos.length },
              'active',
            )}
            aria-label="ToogleAllButton"
            hidden={!todos.length}
          />

          <form onSubmit={(event) => handleNewTodoKeyDown(event)}>
            <input
              data-cy="NewTodoField"
              type="text"
              ref={newTodoField}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              disabled={isAdding}
            />
          </form>
        </header>

        {todos.length > 0
          && (
            <>
              <TodoList
                todos={filteredTodos}
                addedTodo={addedTodo}
                removeTodos={removeTodos}
                isChanging={isChanging}
              />
              <TodoFooter
                todos={todos}
                filter={filter}
                setFilter={setFilter}
                clearCompleted={handleClearCompleted}
              />
            </>
          )}
      </div>

      {error && (
        <TodoError
          error={error}
          setError={setError}
        />
      )}
    </div>
  );
};
