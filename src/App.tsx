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

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [todoList, setTodoList] = useState<Todo[]>([]);
  const [emptyFieldError, setEmptyError] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  const findTodos = async () => {
    const loadedTodos = await getTodos(user?.id) || null;

    setTodoList(loadedTodos);
  };

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    findTodos();
  }, []);

  const cancelEmptyError = () => {
    setEmptyError(false);
  };

  const findNewTodoId = (): number => {
    if (todoList.length !== 0) {
      const max = todoList.reduce((a, b) => (a.id > b.id ? a : b));

      return max.id + 1;
    }

    return 0;
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
              if (newTitle === '') {
                setEmptyError(true);
              } else {
                pushTodo(findNewTodoId(), newTitle, user?.id);
                setNewTitle('');
                findTodos();
              }

              setTimeout(cancelEmptyError, 3000);
            }}
          >
            <input
              data-cy="NewTodoField"
              type="text"
              ref={newTodoField}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              onChange={(event) => {
                setNewTitle(event.target.value);
              }}
            />
          </form>
        </header>

        {user && (
          <section className="todoapp__main" data-cy="TodoList">
            <TodoList todos={todoList} />
          </section>
        )}

        {todoList.length !== 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <FilterList itemCount={todoList.length} />
          </footer>
        )}
      </div>

      <ErrorNotification emptyFieldError={emptyFieldError} />
    </div>
  );
};
