import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';
import { AuthContext } from './components/Auth/AuthContext';
import { TodoList } from './components/TodoList/TodoList';
import { TodosFilter } from './components/TodosFilter/TodosFilter';
import { Error } from './components/Error/Error';
import {
  createTodos,
  deleteTodos,
  getTodos,
  updateTodos,
} from './api/todos';
import { Todo, TodoStatus } from './types/Todo';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todoFilter, setTodoFilter] = useState<TodoStatus>(TodoStatus.All);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const newTodoField = useRef<HTMLInputElement>(null);
  const completedTodos = todos.filter(todoItem => todoItem.completed);
  const activeTodos = todos.filter(todoItem => !todoItem.completed);
  const isCompletedAll = activeTodos.length === 0;

  const filteredTodos = useMemo(() => {
    switch (todoFilter) {
      case TodoStatus.Active:
        return todos.filter(item => !item.completed);

      case TodoStatus.Completed:
        return todos.filter(item => item.completed);

      default:
        return todos;
    }
  }, [todos, todoFilter]);

  const handleChangeTodoFilter = (value: TodoStatus) => setTodoFilter(value);

  useEffect(() => {
    if (user) {
      getTodos(user.id)
        .then(todosFromServer => setTodos(todosFromServer));
    }
  }, [user]);

  const createNewTodo
    = useCallback((event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!query.trim()) {
        setError("Title can't be empty");

        return;
      }

      if (user) {
        setIsAdding(true);
        createTodos(user.id, query)
          .then(todo => {
            setTodos(prev => [...prev, todo]);
            setQuery('');
          })
          .catch(() => setError('Unable to add a todo'))
          .finally(() => setIsAdding(false));
      }
    }, [query]);

  const removeTodo = (todoId: number) => {
    return deleteTodos(todoId)
      .then(() => setTodos(prev => prev.filter(todo => todo.id !== todoId)))
      .catch(() => setError('Unable to delete a todo'));
  };

  const removeCompletedTodos = () => {
    if (completedTodos.length > 0) {
      completedTodos.map(completedTodo => removeTodo(completedTodo.id));
    }
  };

  const updateTodo = (todo: Todo) => {
    return updateTodos(todo)
      .then(() => {
        setTodos(prevState => prevState.map(item => {
          if (item.id === todo.id) {
            return todo;
          }

          return item;
        }));
      })
      .catch(() => setError('Unable to update a todo'));
  };

  const updateTodoStatus = (todo: Todo, status: boolean) => {
    return updateTodo({ ...todo, completed: status });
  };

  const updateAllTodoStatus = () => {
    if (isCompletedAll) {
      todos.map(todo => updateTodo({ ...todo, completed: false }));
    } else {
      activeTodos.map(todo => updateTodo({ ...todo, completed: true }));
    }
  };

  const updateTodoTitle = (todo: Todo, title: string) => {
    return updateTodo({ ...todo, title });
  };

  useEffect(() => {
    if (error.length) {
      setTimeout(() => setError(''), 3000);
    }
  }, [error]);

  useEffect(() => {
    if (newTodoField.current && todos.length !== 0 && !isAdding) {
      newTodoField.current.focus();
    }
  }, [isAdding]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length !== 0
            && (
              <button
                data-cy="ToggleAllButton"
                type="button"
                aria-label="toggleAll"
                className={classNames(
                  'todoapp__toggle-all',
                  { active: isCompletedAll },
                )}
                onClick={updateAllTodoStatus}
              />
            )}

          <form onSubmit={createNewTodo}>
            <input
              data-cy="NewTodoField"
              type="text"
              ref={newTodoField}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              disabled={isAdding}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </form>
        </header>

        {todos.length !== 0
          && (
            <>
              <TodoList
                todos={filteredTodos}
                deleteTodo={removeTodo}
                updateTodoStatus={updateTodoStatus}
                updateTodoTitle={updateTodoTitle}
              />

              <footer className="todoapp__footer" data-cy="Footer">
                <span className="todo-count" data-cy="todosCounter">
                  {`${todos.filter(todo => !todo.completed).length} items left`}
                </span>

                <TodosFilter
                  todoFilter={todoFilter}
                  handleChangeTodos={handleChangeTodoFilter}
                />

                <button
                  data-cy="ClearCompletedButton"
                  type="button"
                  className="todoapp__clear-completed"
                  style={{
                    opacity: !completedTodos.length ? 0 : 1,
                    cursor: completedTodos.length ? 'pointer' : 'default',
                  }}
                  onClick={removeCompletedTodos}
                >
                  Clear completed
                </button>
              </footer>
            </>
          )}
      </div>

      {error.length > 0
        && (
          <Error
            errorMessage={error}
            closeErrorMassage={() => setError('')}
          />
        )}
    </div>
  );
};
