/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext, useEffect, useRef, useState, useCallback,
} from 'react';
import { getTodos, addTodo, deleteTodo } from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { TodoList } from './components/TodoList/TodoList';
import { Todo } from './types/Todo';
import { TodoFooter } from './components/TodoFooter/TodoFooter';
import { Status, ErrorType } from './Enums/Enums';
import { Errors } from './components/Errors/Errors';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [visibleTodos, setVisibleTodos] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState<Status>(Status.ALL);
  const [error, setError] = useState<ErrorType>(ErrorType.None);
  const [title, setTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const getTodosFromApi = async () => {
      if (user) {
        try {
          const response = await getTodos(user?.id);

          setTodos(response);
        } catch {
          throw new Error('Todos not found');
        }
      }
    };
    // focus the element with `ref={newTodoField}`

    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    getTodosFromApi();
  }, [todos]);

  const hendlerError = (p: ErrorType) => {
    setError(p);

    setTimeout(() => {
      setError(ErrorType.None);
    }, 3000);
  };

  useEffect(() => {
    const newVisibleTodos = todos.filter(todoFilter => {
      switch (filterBy) {
        case Status.ACTIVE:
          return !todoFilter.completed;

        case Status.COMPLETED:
          return todoFilter.completed;

        default:
          return todoFilter;
      }
    });

    setVisibleTodos(newVisibleTodos);
  }, [filterBy, todos]);

  const onAddTodo = useCallback(async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (title.length === 0) {
      hendlerError(ErrorType.EmptyTitle);

      return;
    }

    if (user) {
      setIsAdding(true);

      try {
        await addTodo(title, user.id);
      } catch {
        setError(ErrorType.Add);
      }
    }

    setTitle('');
    setIsAdding(false);
  }, [user, title]);

  const onDeleteTodo = useCallback(async (todoId: number) => {
    setIsDeleting(true);

    if (user) {
      try {
        await deleteTodo(todoId);
      } catch {
        setError(ErrorType.Delete);
      }
    }

    setIsDeleting(false);
  }, [user]);

  const onDeleteCompleted = useCallback(async () => {
    setIsDeleting(true);

    try {
      await Promise.all(todos.map(todo => {
        if (todo.completed) {
          return deleteTodo(todo.id);
        }

        return null;
      }));
    } catch {
      setError(ErrorType.Delete);
    }

    setIsDeleting(false);
  }, [todos]);

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

          <form onSubmit={onAddTodo}>
            <input
              data-cy="NewTodoField"
              type="text"
              ref={newTodoField}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            />
          </form>
        </header>

        <TodoList
          todos={visibleTodos}
          setError={hendlerError}
          onDeleteTodo={onDeleteTodo}
          isDeleting={isDeleting}
          isAdding={isAdding}
          title={title}
        />
        {todos.length > 0
          && (
            <TodoFooter
              todos={todos}
              filterBy={filterBy}
              setFilterBy={setFilterBy}
              onDeleteCompleted={onDeleteCompleted}
            />
          )}
      </div>

      <Errors error={error} setError={hendlerError} />
    </div>
  );
};
