/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { deleteTodo, getTodos, postTodo } from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { Filter } from './components/Filter';
import { TodoList } from './components/TodoList';
import { ErrorMessage } from './components/ErrorMessage';

import { Filters } from './types/FilterStatus';
import { Todo } from './types/Todo';

const filterTodos = (todos: Todo[], filterStatus: Filters) => {
  switch (filterStatus) {
    case Filters.ALL: return todos;
    case Filters.ACTIVE: return todos.filter(({ completed }) => !completed);
    case Filters.COMPLETED: return todos.filter(({ completed }) => completed);
    default: throw new Error('Error: Filter todos');
  }
};

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterStatus, setFilterStatus] = useState<Filters>(Filters.ALL);
  const [newTodoTitle, setNewTodoTitle] = useState<string>('');
  const [isAdding, setIsAdding] = useState(false);
  const [isDeleting, setIsDeleting] = useState<number[]>([]);
  const [error, setError] = useState('');
  const [showErrorTrigger, setShowErrorTrigger] = useState(0);

  const visibleTodos = useMemo(
    () => filterTodos(todos, filterStatus),
    [todos, filterStatus, error],
  );

  const activeTodosCount = useMemo(
    () => filterTodos(todos, Filters.ALL).length,
    [todos],
  );

  const showErrorMessage = (errorMessage: string) => {
    setError(errorMessage);
    setShowErrorTrigger(tick => tick + 1);
  };

  const handleNewTodoTitle = (event: React.ChangeEvent<HTMLInputElement>) => (
    setNewTodoTitle(event.target.value)
  );

  const handleCloseError = () => {
    setError('');
  };

  const handleAddNewTodo = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!newTodoTitle.replace(/\s/g, '')) {
      showErrorMessage('Title can\'t be empty');
      setNewTodoTitle('');

      return;
    }

    if (user) {
      const newTodoData = {
        id: 0,
        userId: user.id,
        title: newTodoTitle,
        completed: false,
      };

      setIsAdding(true);
      setTodos(prevTodos => [...prevTodos, newTodoData]);
      try {
        const newTodo = await postTodo(newTodoData);

        setTodos(prevTodos => [...prevTodos, newTodo]);
        setNewTodoTitle('');
      } catch {
        showErrorMessage('Unable to add a todo');
      } finally {
        setTodos(copyTodos => copyTodos.filter(todo => todo.id !== 0));
      }

      setIsAdding(false);
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
    setIsDeleting(prevIds => [...prevIds, todoId]);

    try {
      await deleteTodo(todoId);
      setTodos(copyTodos => copyTodos.filter(todo => todo.id !== todoId));
    } catch {
      showErrorMessage('Unable to delete a todo');
    } finally {
      setIsDeleting(prevIds => prevIds.filter(id => id !== todoId));
    }
  };

  const handleClearCompleted = () => {
    todos.forEach(todo => {
      if (todo.completed) {
        handleDeleteTodo(todo.id);
      }
    });
  };

  useEffect(() => {
    const loadTodos = async () => {
      if (user) {
        try {
          const todosFromServer = await getTodos(user.id);

          setTodos(todosFromServer);
        } catch {
          showErrorMessage('Unable to load a todos');
        }
      }
    };

    loadTodos();
  }, []);

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [todos]);

  useEffect(() => {
    const errorTimeout = setTimeout(() => setError(''), 3000);

    return () => {
      clearTimeout(errorTimeout);
    };
  }, [showErrorTrigger]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              data-cy="ToggleAllButton"
              type="button"
              className="todoapp__toggle-all active"
            />
          )}

          <form
            onSubmit={handleAddNewTodo}
          >
            <input
              data-cy="NewTodoField"
              type="text"
              ref={newTodoField}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={newTodoTitle}
              onChange={handleNewTodoTitle}
              disabled={isAdding}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          <TodoList
            todos={visibleTodos}
            isDeleting={isDeleting}
            onDeleteTodo={handleDeleteTodo}
          />
        </section>

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="todosCounter">
              {`${activeTodosCount} items left`}
            </span>

            <Filter filterStatus={filterStatus} onFilter={setFilterStatus} />

            <button
              data-cy="ClearCompletedButton"
              type="button"
              className="todoapp__clear-completed"
              onClick={handleClearCompleted}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <ErrorMessage error={error} onCloseError={handleCloseError} />
    </div>
  );
};
