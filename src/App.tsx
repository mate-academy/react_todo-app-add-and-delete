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
  const [isError, setIsError] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const completedTodo = todos.filter((todo) => todo.completed);
  const clearCompleted = () => {
    completedTodo.filter((todo) => deleteTodo(todo.id)
      .then()
      .catch(() => setIsDelete(true)));
  };

  const updateTodos = (todoId: unknown) => setTodos(todos
    .filter((todo) => todo.id !== todoId));

  const removeTodo = (todoId: number | undefined) => {
    deleteTodo(todoId)
      .then((todoID) => updateTodos(todoID))
      .catch(() => setIsDelete(true));
  };

  const addNewTodo = (todo: Todo) => setTodos([...todos, todo]);
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      if (value !== '') {
        createTodo(value, user?.id)
          .then((todo) => addNewTodo(todo))
          .catch(() => setIsError(true));
        setValue('');
      } else {
        setIsEmpty(true);
      }
    }
  };

  useEffect(() => {
    setIsHidden(true);
    getTodos(user?.id)
      .then(setTodos)
      .catch(() => setIsError(true));

    setTimeout(() => {
      setIsHidden(true);
      setIsDelete(false);
      setIsEmpty(false);
    }, 3000);

    setIsAdding(true);
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
                  setIsHidden(true);
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
                  setIsHidden(true);
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
                  setIsHidden(true);
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
