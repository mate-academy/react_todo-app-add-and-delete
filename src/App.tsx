import React, { useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';
import {
  patchTodo, deleteTodo, getTodos, postTodo,
} from './api/todos';
import { Error } from './components/Error/Error';
import { TypeFilter, Filter } from './components/Filter/Filter';
import { Item } from './components/Todo/Todo';
import { Todo } from './types/Todo';
import { UserWarning } from './UserWarning';

const USER_ID = 123111;

export const App: React.FC = () => {
  const [listTodo, setListTodo] = useState<Todo[]>([]);
  const [error, setError] = useState('');
  const [titleTodo, setTitleTodo] = useState('');
  const [filterTodo, setFilterTodo] = useState(TypeFilter.ALL);

  const getListTodo = useCallback(async (filter = TypeFilter.ALL) => {
    try {
      if (filter) {
        const result = await getTodos(USER_ID, filter);

        setFilterTodo(filter);
        setListTodo(result);
      }
    } catch (e) {
      setError('Something were wrong, please try again later');
    }
  }, []);

  useEffect(() => {
    getListTodo();
  }, []);

  const clearError = useCallback(() => setError(''), []);

  const onSubmitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (titleTodo) {
      try {
        await postTodo(
          { title: titleTodo, userId: USER_ID, completed: false },
        );

        getListTodo();
        setTitleTodo('');
      } catch (e) {
        setError('Oops, something were wrong, please try again later');
      }
    }
  };

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitleTodo(event.target.value);
  };

  const deleteTodoHandler = (id: number) => {
    deleteTodo(id).then(() => getListTodo());
  };

  const changeTodo = (id: number, completed: boolean) => {
    patchTodo(id, completed).then(() => getListTodo());
  };

  const clearCompleated = (todos: Todo[]) => {
    return todos.filter(todo => todo.completed);
  };

  const clearActive = (list: Todo[]) => {
    return list.filter(obj => !obj.completed);
  };

  const completedTodo = clearCompleated(listTodo);
  const activeTodo = clearActive(listTodo);

  function deleteAllTodosHandler(todos: Todo[]) {
    todos.forEach((todo) => deleteTodoHandler(todo.id));
  }

  function changeAllTodosHandler(todos: Todo[]) {
    todos.forEach((todo) => changeTodo(todo.id, true));
  }

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {!!activeTodo.length
            && (
              <button
                type="button"
                className="todoapp__toggle-all active"
                onClick={() => changeAllTodosHandler(activeTodo)}
                aria-label="Get all todos done"
              />
            )}
          <form onSubmit={onSubmitHandler}>
            <input
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={titleTodo}
              onChange={onChangeHandler}
            />
          </form>
        </header>

        <section className="todoapp__main">
          {listTodo.map((todo: Todo) => (
            <Item
              todo={todo}
              key={todo.id}
              deleteTodo={deleteTodoHandler}
              changeTodo={changeTodo}
            />
          ))}
        </section>

        {!!listTodo.length || filterTodo !== TypeFilter.ALL
          ? (
            <footer className="todoapp__footer">
              <span className="todo-count">
                {`${listTodo.length} items left`}
              </span>
              <Filter setFilter={getListTodo} />
              <button
                type="button"
                className={classNames('todoapp__clear-completed',
                  {
                    'todoapp__clear-completed__hidden':
                      completedTodo.length < 1,
                  })}
                onClick={() => deleteAllTodosHandler(completedTodo)}
              >
                Clear completed
              </button>
            </footer>
          )
          : ''}
      </div>

      {error && <Error errorText={error} errorClear={clearError} />}
    </div>
  );
};
