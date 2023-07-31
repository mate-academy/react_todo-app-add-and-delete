/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './components/UserWarning';
import { addTodo, deleteTodo, getTodos } from './api/todos';
import { Todo } from './types/Todo';
import { FilterType } from './types/FilterType';
import { TodoFilter } from './components/TodoFilter';
import { Todolist } from './components/TodoList';
import { TodoErrors } from './components/TodoErrors';

const USER_ID = 11240;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState(FilterType.ALL);
  const [errorText, setErrorText] = useState('');
  const [title, setTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  useEffect(() => {
    setErrorText('');
    getTodos(USER_ID)
      .then((fetchedTodos: Todo[]) => {
        setTodos(fetchedTodos);
      })
      .catch((error: Error) => {
        setErrorText(error.message);
        setTimeout(() => {
          setErrorText('');
        }, 3000);
      });
  }, []);

  const visibletodos = useMemo(() => {
    switch (filter) {
      case FilterType.COMPLETED:
        return todos.filter((todo) => todo.completed);
      case FilterType.ACTIVE:
        return todos.filter((todo) => !todo.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  const addTodosHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      setErrorText('Title can\'t be empty');

      return;
    }

    setTempTodo({
      id: 0,
      title,
      completed: false,
      userId: USER_ID,
    });

    if (title.trim()) {
      try {
        const newTodo = await addTodo({
          userId: USER_ID,
          title,
          completed: false,
        });

        setTodos([...todos, newTodo]);
      } catch (error) {
        setErrorText('Unable to add a todo');
      } finally {
        setTempTodo(null);
      }
    }

    setTitle('');
  };

  const deleteTodoHandler = async (todoId: number) => {
    try {
      await deleteTodo(todoId);
      setTodos(todos.filter(todo => todo.id !== todoId));
    } catch (error) {
      setErrorText('Unable to delete a todo');
    }
  };

  const activeTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <header className="todoapp__header">
          {activeTodos.length > 0
          && (<button type="button" className="todoapp__toggle-all active" />)}

          <form onSubmit={addTodosHandler}>
            <input
              value={title}
              onChange={event => {
                setTitle(event.target.value);
                setErrorText('');
              }}
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
            />
          </form>
        </header>

        <Todolist
          tempTodo={tempTodo}
          deleteTodoHandler={deleteTodoHandler}
          todos={visibletodos}
        />

        <footer className="todoapp__footer">
          <span className="todo-count">
            {`${activeTodos.length} items left`}
          </span>

          <TodoFilter filter={filter} setFilter={setFilter} />

          {completedTodos.length > 0 && (
            <button type="button" className="todoapp__clear-completed">
              Clear completed
            </button>
          )}
        </footer>
      </div>

      <TodoErrors errorText={errorText} setErrorText={setErrorText} />
    </div>
  );
};
