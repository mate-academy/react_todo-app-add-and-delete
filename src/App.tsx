/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';
import { deleteTodo, getTodos, postTodo } from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { Todo } from './types/Todo';
import { Error } from './components/Error';
import { Navigation } from './components/Navigation';
import { Filter } from './types/Filter';
import { NewTodo } from './components/NewTodo';
import { TodoComponent } from './components/TodoComponent';
import { TodoList } from './components/TodoList';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState(Filter.ALL);
  const [error, setError] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [deletingTodo, setDeletingTodo] = useState(-1);
  const [deletingTodos, setDeletingTodos] = useState<number[]>([]);
  const [todoTitle, setTodoTitle] = useState('');

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  const loadTodos = async () => {
    if (!user) {
      return;
    }

    const todosFromServer = await getTodos(user.id);

    setTodos(todosFromServer);
  };

  useEffect(() => {
    loadTodos();
  }, [user]);

  const removeError = useCallback(() => {
    setError('');
  }, []);

  const handleError = useCallback((errorText: string) => {
    setError(errorText);
    setTimeout(removeError, 3000);
  }, []);

  const addTodo = useCallback(async (title: string) => {
    if (title.trim().length === 0) {
      handleError('Title can\'t be empty');
    }

    if (user && title.trim().length > 0) {
      setIsAdding(true);

      try {
        await postTodo({
          userId: user.id,
          title,
          completed: false,
        });

        await loadTodos();
      } catch {
        handleError('Unable to add a todo');
      }

      setIsAdding(false);
      setTodoTitle('');
    }
  }, []);

  const removeTodo = useCallback(async (todoId: number) => {
    setDeletingTodo(todoId);

    try {
      await deleteTodo(todoId);

      await loadTodos();
    } catch {
      handleError('Unable to delete a todo');
    }

    setDeletingTodo(-1);
  }, []);

  const filterTodos = (filterBy: Filter) => (
    todos.filter(todo => {
      switch (filterBy) {
        case Filter.ALL:
          return todo;

        case Filter.ACTIVE:
          return !todo.completed;

        case Filter.COMPLETED:
          return todo.completed;

        default:
          return todo;
      }
    }));

  const filteredTodos = filterTodos(filter);

  const completedTodos = filterTodos(Filter.COMPLETED);

  const activeTodos = todos.filter(todo => !todo.completed);

  const removeCompletedTodos = useCallback(async () => {
    setDeletingTodos(completedTodos.map(todo => todo.id));

    todos.forEach(todo => (
      todo.completed && removeTodo(todo.id)
    ));

    await loadTodos();

    setDeletingTodos([]);
  }, [todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              data-cy="ToggleAllButton"
              type="button"
              className={classNames('todoapp__toggle-all', {
                active: activeTodos.length === 0,
              })}
            />
          )}

          <NewTodo
            newTodoField={newTodoField}
            addTodo={addTodo}
            isAdding={isAdding}
            todoTitle={todoTitle}
            setTodoTitle={setTodoTitle}
          />
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {todos.length !== 0 && (
            <TodoList
              todos={filteredTodos}
              onRemoveTodo={removeTodo}
              deletingTodo={deletingTodo}
              deletingTodos={deletingTodos}
            />
          )}
          {isAdding && (
            <TodoComponent
              todo={{
                id: 0,
                userId: user?.id || 0,
                title: todoTitle,
                completed: false,
              }}
              onRemoveTodo={removeTodo}
              deletingTodo={deletingTodo}
              deletingTodos={deletingTodos}
            />
          )}
        </section>

        {todos.length !== 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="todosCounter">
              {`${activeTodos.length} items left`}
            </span>

            <Navigation
              isSelected={filter}
              onFilterTodos={setFilter}
            />

            {completedTodos.length > 0 && (
              <button
                data-cy="ClearCompletedButton"
                type="button"
                className="todoapp__clear-completed"
                onClick={removeCompletedTodos}
              >
                Clear completed
              </button>
            )}
          </footer>
        )}
      </div>

      {error && (
        <Error
          error={error}
          onRemoveError={removeError}
        />
      )}
    </div>
  );
};
