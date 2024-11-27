/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  deleteTodo,
  getTodos,
  patchTodo,
  postTodo,
  USER_ID,
} from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { Error } from './components/Error';

export enum Filter {
  all = 'All',
  active = 'Active',
  completed = 'Completed',
}

export const App: React.FC = () => {
  const [value, setValue] = useState<string>('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [idsOfRecedingTodos, setIdsOfRecedingTodos] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [todoOnSelect, setTodoOnSelect] = useState<Todo | null>(null);
  const [isInputDisabled, setIsInputDisabled] = useState<boolean>(false);
  const [filter, setFilter] = useState<string>(Filter.all);
  const [error, setError] = useState<string>('');

  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (filter) {
        case Filter.active:
          return !todo.completed;
        case Filter.completed:
          return todo.completed;
        default:
          return todo;
      }
    });
  }, [filter, todos]);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const nrOfActiveTodos = todos.filter(t => !t.completed).length;

  // #region finished Functions

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setError('Unable to load todos');
        setTimeout(() => setError(''), 3000);
      });
  }, []);

  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, [isInputDisabled]);

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const trimmedValue = value.trim();

    if (trimmedValue.length === 0) {
      setError('Title should not be empty');

      return;
    }

    const todo = {
      id: 0,
      userId: USER_ID,
      title: trimmedValue,
      completed: false,
    };

    setTempTodo(todo);
    setIsInputDisabled(true);

    postTodo(todo)
      .then(_todo => {
        setTodos(currentTodos => [...currentTodos, _todo]);
        setTimeout(() => setValue(''), 200);
      })
      .catch(() => {
        setError('Unable to add a todo');
        setTimeout(() => setError(''), 3000);
      })
      .finally(() => {
        setTempTodo(null);
        setIsInputDisabled(false);
      });
  }

  function deleteRequest(id: number) {
    deleteTodo(id)
      .then(() => {
        setTimeout(() => {
          setTodos(currentTodos =>
            currentTodos.filter(_todo => _todo.id !== id),
          );
        }, 500);
      })
      .catch(() => {
        setError('Unable to delete a todo');

        setTimeout(() => setError(''), 3000);
      })
      .finally(() => {
        setTimeout(() => {
          setIdsOfRecedingTodos([]);
          inputRef.current?.focus();
        }, 500);
      });
  }

  function onDelete(event: React.MouseEvent<HTMLButtonElement>, id: number) {
    event.preventDefault();

    setIdsOfRecedingTodos(ids => [...ids, id]);
    deleteRequest(id);
  }

  function onDeleteSelected(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();

    todos.forEach(_t => {
      if (_t.completed) {
        const { id } = _t;

        setIdsOfRecedingTodos(ids => [...ids, id]);
        deleteRequest(id);
      }
    });
  }

  function onSelect(id: number, todo: Todo) {
    setTodoOnSelect(todo);

    patchTodo(id, todo).then(_todo => {
      setTodos(currentTodos => {
        return currentTodos.map(t => (_todo.id === t.id ? _todo : t));
      });

      setTodoOnSelect(null);
    });
  }

  function allSelected(event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();

    setFilter(Filter.all);
  }

  function activeSelected(event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();

    setFilter(Filter.active);
  }

  function completedSelected(event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();

    setFilter(Filter.completed);
  }

  // #endregion

  if (error) {
    setTimeout(() => setError(''), 3000);
  }

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          onSubmit={onSubmit}
          value={value}
          setValue={setValue}
          inputRef={inputRef}
          isInputDisabled={isInputDisabled}
        />
        <TodoList
          tempTodo={tempTodo}
          todoOnSelect={todoOnSelect}
          filteredTodos={filteredTodos}
          idsOfRecedingTodos={idsOfRecedingTodos}
          onDelete={onDelete}
          onSelect={onSelect}
        />

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <Footer
            nrOfActiveTodos={nrOfActiveTodos}
            filter={filter}
            allSelected={allSelected}
            activeSelected={activeSelected}
            completedSelected={completedSelected}
            onDeleteSelected={onDeleteSelected}
            todos={todos}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <Error error={error} />
    </div>
  );
};
