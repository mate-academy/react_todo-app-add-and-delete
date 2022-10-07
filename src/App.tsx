/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext, useEffect, useMemo, useRef, useState,
} from 'react';
import classNames from 'classnames';
import { AuthContext } from './components/Auth/AuthContext';
import { Error } from './components/Error';
import { Filter } from './components/Filter';
import { getTodos, createTodo, deleteTodo } from './api/todos';
import { Todo } from './types/Todo';
import { TodoItem } from './components/TodoItem';
import { SortFilter } from './types/SortFilter';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [sortFilter, setSortFilter] = useState(SortFilter.all);
  const [visibelTodos, setVisibelTodos] = useState<Todo[]>([...todos]);
  const [completedTodos, setCompletedTodos]
  = useState<Todo[]>([...todos].filter(todo => todo.completed));

  const [isError, setError] = useState(false);
  const [messageError, setMessageError] = useState('');
  const [newTodoTitle, setTitle] = useState('');
  const [activeTodoId, setActiveTodoId] = useState([0]);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    if (user) {
      getTodos(user.id)
        .then(response => {
          setTodos(response);
        })
        .catch(() => {
          setError(true);
          setMessageError('Todos from server were not gotten');
        });
    }
  }, []);

  useMemo(() => {
    setVisibelTodos(() => (
      todos.filter(todo => {
        switch (sortFilter) {
          case SortFilter.active:
            return !todo.completed;

          case SortFilter.completed:
            return todo.completed;

          default:
            return true;
        }
      })));
  }, [todos, sortFilter]);

  useEffect(() => {
    setCompletedTodos(() => todos.filter(todo => todo.completed));
  }, [todos]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) {
      return;
    }

    if (newTodoTitle.trim().length === 0) {
      setError(true);
      setMessageError('Title can\'t be empty');

      return;
    }

    setVisibelTodos(visibleTodos => [...visibleTodos, {
      id: 0,
      userId: user.id,
      title: newTodoTitle,
      completed: false,
    }]);

    try {
      const isAdding = await createTodo({
        userId: user.id,
        title: newTodoTitle,
        completed: false,
      });

      setTodos(PrevTodos => [...PrevTodos, isAdding]);
    } catch (errorFromServer) {
      setError(true);
      setMessageError('Unable to add a todo');
    } finally {
      setVisibelTodos(visibleTodos => visibleTodos
        .filter(todo => todo.id !== 0));
    }

    setTitle('');
  };

  const handleRemoveTodo = async (removeTodoID: number) => {
    setActiveTodoId(idActive => [...idActive, removeTodoID]);

    try {
      await deleteTodo({ id: removeTodoID });

      setTodos(PrevTodos => PrevTodos.filter(todo => todo.id !== removeTodoID));
    } catch (errorFromServer) {
      setError(true);
      setMessageError('Unable to delete a todo');
    } finally {
      setActiveTodoId(idActive => idActive.filter(id => id !== removeTodoID));
    }
  };

  const handlerRemoveComleted = () => {
    completedTodos.forEach((todoComleted) => handleRemoveTodo(todoComleted.id));
  };

  const handleChangeSortFilter = (sort: SortFilter) => {
    if (sortFilter !== sort) {
      setSortFilter(sort);
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0
            && (
              <button
                data-cy="ToggleAllButton"
                type="button"
                className={classNames(
                  'todoapp__toggle-all',
                  { 'is-active': visibelTodos.length === 0 },
                )}
              />
            )}
          <form onSubmit={handleSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              ref={newTodoField}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={newTodoTitle}
              onChange={() => setTitle(newTodoField.current?.value || '')}
            />
          </form>
        </header>
        {todos.length > 0
          && (
            <>
              <section className="todoapp__main" data-cy="TodoList">
                {visibelTodos.map(todo => (
                  <TodoItem
                    todo={todo}
                    activeTodoId={activeTodoId}
                    handleRemoveTodo={handleRemoveTodo}
                  />
                ))}

              </section>
              <footer className="todoapp__footer" data-cy="Footer">
                <span className="todo-count" data-cy="todosCounter">
                  {`${todos.length - completedTodos.length} items left`}
                </span>

                <Filter
                  sortFilter={sortFilter}
                  handleChangeSortFilter={handleChangeSortFilter}
                />
                {completedTodos.length > 0
                  && (
                    <button
                      data-cy="ClearCompletedButton"
                      type="button"
                      className="todoapp__clear-completed"
                      onClick={handlerRemoveComleted}
                    >
                      Clear completed
                    </button>
                  )}

              </footer>
            </>

          )}

      </div>

      <Error
        isError={isError}
        setError={setError}
        messageError={messageError}
      />

    </div>
  );
};
