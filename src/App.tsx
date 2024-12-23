/* eslint-disable jsx-a11y/control-has-associated-label */
import cn from 'classnames';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { USER_ID, addTodo, getTodos, deleteTodo } from './api/todos';
import { ErrorType } from './types/ErrorType';
import { filterTodos } from './components/TodoFilter/filterTodos';

import { Todo } from './types/Todo';
import { Status } from './types/Status';
import { TodoFilter } from './components/TodoFilter';
import { TodoItem } from './components/TodoItem';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [errorMsg, setErrorMsg] = useState<ErrorType>(ErrorType.Default);
  const [filter, setFilter] = useState<Status>(Status.All);
  const [processingTodos, setProcessingTodos] = useState<number[]>([]);

  const addInputRef = useRef<HTMLInputElement>(null);
  const allAreCompleted = useMemo(
    () => todos.every(todo => todo.completed),
    [todos],
  );
  const hasTodos = useMemo(() => todos.length > 0, [todos]);

  const filteredTodos = useMemo(
    () => filterTodos(todos, filter),
    [todos, filter],
  );

  const handleError = (error: ErrorType) => {
    setErrorMsg(error);

    setTimeout(() => {
      setErrorMsg(ErrorType.Default);
    }, 3000);
  };

  const onTodoAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!newTodoTitle.trim()) {
      handleError(ErrorType.EmptyTitle);

      return;
    }

    setTempTodo({
      title: newTodoTitle.trim(),
      id: 0,
      userId: USER_ID,
      completed: false,
    });

    addTodo(newTodoTitle.trim())
      .then(newTodo => {
        setTodos(prevTodos => [...prevTodos, newTodo]);
        setNewTodoTitle('');
      })
      .catch(() => {
        handleError(ErrorType.AddTodoFailed);
        setTodos(todos);
      })
      .finally(() => {
        setTempTodo(null);
      });
  };

  const onTodoDelete = useCallback(
    (todoId: number) => {
      setProcessingTodos(prevProcessing => [...prevProcessing, todoId]);

      deleteTodo(todoId)
        .then(() => {
          setTodos(prev => prev.filter(prevTodo => prevTodo.id !== todoId));
        })
        .catch(() => handleError(ErrorType.DeleteTodoFailed))
        .finally(() => {
          setProcessingTodos(prevIds => prevIds.filter(id => id !== todoId));
        });
    },
    [setTodos, setProcessingTodos, handleError],
  );

  const onTodoDeleteCompleted = useCallback(() => {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.forEach(todo => onTodoDelete(todo.id));
  }, [todos, onTodoDelete]);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => handleError(ErrorType.LoadTodosFailed));
  }, []);

  useEffect(() => {
    addInputRef.current?.focus();
  }, [todos, tempTodo]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <header className="todoapp__header">
        {/* this button should have `active` class only if all todos are completed */}
        <button
          type="button"
          className={cn('todoapp__toggle-all', { active: allAreCompleted })}
          data-cy="ToggleAllButton"
        />

        {/* Add a todo on form submit */}
        <form onSubmit={onTodoAdd}>
          <input
            disabled={tempTodo !== null}
            data-cy="NewTodoField"
            type="text"
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
            ref={addInputRef}
            value={newTodoTitle}
            onChange={e => setNewTodoTitle(e.target.value)}
          />
        </form>
      </header>

      <div className="todoapp__content">
        <section className="todoapp__main" data-cy="TodoList">
          {filteredTodos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onDelete={onTodoDelete}
              processingTodos={processingTodos}
            />
          ))}

          {tempTodo && <TodoItem onDelete={onTodoDelete} todo={tempTodo} />}
        </section>
        {/* Hide the footer if there are no todos */}
        {hasTodos && (
          <footer className="todoapp__footer" data-cy="Footer">
            <TodoFilter
              filter={filter}
              onFilterChange={setFilter}
              todos={todos}
              onDelete={onTodoDeleteCompleted}
            />
          </footer>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !errorMsg },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMsg(ErrorType.Default)}
        />
        {errorMsg}
      </div>
    </div>
  );
};
