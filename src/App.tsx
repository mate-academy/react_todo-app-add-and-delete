import React, {
  useContext, useEffect, useMemo, useRef, useState,
} from 'react';
import classnames from 'classnames';
import { createTodo, getTodos, deleteTodo } from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { Todo } from './types/Todo';
import { Filters } from './types/Filters';
import { Header } from './components/Auth/Header';
import { TodoList } from './components/Auth/TodoList';
import { FooterTodo } from './components/Auth/FooterTodo';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [value, setValue] = useState('');

  const [currentFilter, setCurrentFilter] = useState(Filters.All);
  const [isError, setisError] = useState(false);
  const [isDelete, setisDelete] = useState(false);
  const [isHidden, setisHidden] = useState(false);
  const [isEmpty, setisEmpty] = useState(false);
  const [isAdding, setisAdding] = useState(false);
  const completedTodo = todos.filter((todo) => todo.completed);
  const clearCompleted = () => {
    completedTodo.filter((todo) => deleteTodo(todo.id)
      .then()
      .catch(() => setisDelete(true)));
  };

  const removTodo = (todoId: any) => setTodos(todos
    .filter((todo) => todo.id !== todoId));

  const removeTodo = (todoId: number | undefined) => {
    deleteTodo(todoId)
      .then((todoID) => removTodo(todoID))
      .catch(() => setisDelete(true));
  };

  const addNewTodo = (todo: Todo) => setTodos([...todos, todo]);
  const handleKeyDown = (event: any) => {
    if (event.key === 'Enter' && value !== '') {
      createTodo(value, user?.id)
        .then((todo) => addNewTodo(todo))
        .catch(() => setisError(true));
      setValue('');
    } else if (event.key === 'Enter' && value === '') {
      setisEmpty(true);
    }
  };

  useEffect(() => {
    setisHidden(true);
    getTodos(user?.id)
      .then(setTodos)
      .catch(() => setisError(true));

    setTimeout(() => {
      setisHidden(true);
      setisDelete(false);
      setisEmpty(false);
    }, 3000);

    setisAdding(true);
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [todos]);

  const filterList = (todoss: Todo[]): Todo[] | undefined => todoss
    .filter((todo) => {
      if (!todo) {
        return [];
      }

      switch (currentFilter) {
        case Filters.Active:
          return !todo.completed;

        case Filters.Completed:
          return todo.completed;

        default:
          return todo;
      }
    });

  const filteredList = useMemo(() => filterList(todos), [currentFilter, todos]);

  return (
    <>
      <div className="todoapp">
        <h1 className="todoapp__title">todos</h1>

        <div className="todoapp__content">
          <Header
            value={value}
            setValue={setValue}
            handleKeyDown={handleKeyDown}
            isAdding={isAdding}
          />
          {todos.length !== 0 && (
            <>
              <TodoList filteredList={filteredList} removeTodo={removeTodo} />

              <FooterTodo
                todos={todos}
                setCurrentFilter={setCurrentFilter}
                clearCompleted={clearCompleted}
                currentFilter={currentFilter}
              />
            </>
          )}

          {isError && (
            <div
              data-cy="ErrorNotification"
              className={classnames(
                'notification is-danger is-light has-text-weight-normal',
                {
                  hidden: isHidden,
                },
              )}
            >
              <button
                aria-label="button"
                data-cy="HideErrorButton"
                type="button"
                hidden
                onClick={() => {
                  setisHidden(true);
                }}
                className="delete"
              />
              Unable to add a todo
            </div>
          )}
          {isDelete && (
            <div
              data-cy="ErrorNotification"
              className={classnames(
                'notification is-danger is-light has-text-weight-normal',
                {
                  hidden: isHidden,
                },
              )}
            >
              <button
                aria-label="button"
                data-cy="HideErrorButton"
                type="button"
                hidden
                onClick={() => {
                  setisHidden(true);
                }}
                className="delete"
              />
              Unable to delete a todo
            </div>
          )}
          {isEmpty && (
            <div
              data-cy="ErrorNotification"
              className="notification is-danger is-light has-text-weight-normal"
            >
              <button
                aria-label="button"
                data-cy="HideErrorButton"
                type="button"
                className="delete"
                onClick={() => {
                  setisHidden(true);
                }}
              />
              {'Title can\'t be empty'}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
