/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import { addTodo, deleteTodo, getTodos } from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { ErrorNotification } from './components/ErrorNotification';
import { Footer } from './components/Footer';
import { TodoList } from './components/TodoList';
import { Todo } from './types/Todo';
import { FilterType } from './types/FilterType';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterType, setFilterType] = useState<string>('all');
  const [error] = useState<boolean>(false);
  const [todoTitle, setTodoTitle] = useState<string>('');
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const userId = user ? user?.id : 0;

  const postTodo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newTodo = {
      title: todoTitle,
      completed: false,
      userId,
    };

    addTodo(newTodo)
      .then(() => getTodos(userId).then(setTodos));
    setTodoTitle('');
  };

  const removeTodo = (todoId: number) => {
    deleteTodo(todoId).then(() => getTodos(userId).then(setTodos));
  };

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    getTodos(userId).then(setTodos);
  }, []);

  const filteredTodos = todos.filter(todo => {
    switch (filterType) {
      case FilterType.All:
        return todo;

      case FilterType.Active:
        return !todo.completed;

      case FilterType.Completed:
        return todo.completed;

      default:
        return null;
    }
  });

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
            onSubmit={event => {
              postTodo(event);
            }}
          >
            <input
              data-cy="NewTodoField"
              type="text"
              ref={newTodoField}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={todoTitle}
              onChange={event => {
                setTodoTitle(event.target.value);
              }}
            />
          </form>
        </header>

        <TodoList
          todos={filteredTodos}
          removeTodo={removeTodo}
        />
        <Footer
          todos={todos}
          filterType={filterType}
          onFilterChange={setFilterType}
        />

      </div>
      <ErrorNotification
        error={error}
      />
    </div>
  );
};
