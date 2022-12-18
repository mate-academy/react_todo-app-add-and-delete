/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  FormEvent,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import classNames from 'classnames';

import { addTodo, deleteTodo, getTodos } from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import { AddTodoFieldForm } from './components/AddTodoFieldForm';
import { TodoFilters } from './types/TodoFilters';
import { ErrorNotification } from './components/ErrorNotification';
import { Error } from './types/Errors';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [filter, setFilter] = useState<TodoFilters>(TodoFilters.all);
  const [errorType, setErrorType] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [deletingTodoId, setDeletingTodoId] = useState(0);
  const [completedTodosId, setCompletedTodosId] = useState<number[]>([0]);

  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const visibleTodos = useCallback(() => {
    const {
      completed,
      active,
      all,
    } = TodoFilters;

    return todos.filter(todo => {
      switch (filter) {
        case completed:
          return todo.completed;
        case active:
          return !todo.completed;
        case all:
        default:
          return todo;
      }
    });
  }, [filter, todos]);

  const activeTodos = todos.filter(todo => !todo.completed);

  const loadUsersTodos = useCallback(async () => {
    if (!user) {
      return;
    }

    try {
      setTodos(await getTodos(user.id));
    } catch {
      setErrorType(Error.LoadTodos);
    }
  }, [user]);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    loadUsersTodos();
  }, [todos]);

  const handleSubmitForm = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setIsAdding(true);

      if (title.trim() && user) {
        await addTodo({
          userId: user.id,
          title: title.trim(),
          completed: false,
        });
        setTitle('');
      } else if (!title.trim()) {
        setErrorType(Error.EmptyTitle);
      } else {
        setErrorType(Error.AddTodo);
      }

      setIsAdding(false);
    }, [title, user],
  );

  const handleDelete = useCallback(async (todoId: number) => {
    setDeletingTodoId(todoId);

    try {
      await deleteTodo(todoId);
    } catch {
      setErrorType(Error.DeleteTodo);
    }

    setDeletingTodoId(0);
  }, []);

  const handleClearComplited = async () => {
    const completedId = todos.filter(todo => todo.completed)
      .map(todo => todo.id);

    try {
      setCompletedTodosId(completedId);
      await completedId.forEach(async id => {
        await deleteTodo(id);
      });
    } catch {
      setErrorType(Error.DeleteTodo);
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {!!todos.length && (
            <button
              data-cy="ToggleAllButton"
              type="button"
              className={classNames(
                'todoapp__toggle-all',
                {
                  active: todos.every(todo => todo.completed),
                },
              )}
            />
          )}

          <AddTodoFieldForm
            onChangeTitle={setTitle}
            title={title}
            onSubmit={handleSubmitForm}
            isAdding={isAdding}
          />
        </header>

        {!!todos.length && (
          <>
            <section
              className="todoapp__main"
              data-cy="TodoList"
            >
              <TodoList
                todos={visibleTodos()}
                isAdding={isAdding}
                title={title}
                onDelete={handleDelete}
                deletingTodoId={deletingTodoId}
                completedTodosId={completedTodosId}
              />
            </section>

            <Footer
              activeTodos={activeTodos.length}
              onSetFilter={setFilter}
              filter={filter}
              todos={todos}
              handleClearComplited={handleClearComplited}
            />
          </>
        )}
      </div>

      {errorType && (
        <ErrorNotification
          errorType={errorType}
          onErrorTypeChange={setErrorType}
        />
      )}
    </div>
  );
};
