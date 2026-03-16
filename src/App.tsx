import React, { FormEvent, useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, deletePost, addPost, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { TodoHeader } from './todo/TodoHeader';
import { TodoMain } from './todo/TodoMain';
import { TodoFooter } from './todo/TodoFooter';
import { ErrorNotification } from './components/Error/ErrorNotification';

export enum FilterOption {
  Active = 'Active',
  Completed = 'Completed',
  default = 'Default',
}

export enum ErrorMessage {
  title = 'Title should not be empty',
  loading = 'Unable to load todos',
  add = 'Unable to add a todo',
  delete = 'Unable to delete a todo',
  default = '',
}

function FilteredTodos(todos: Todo[], filterOption: FilterOption) {
  switch (filterOption) {
    case FilterOption.Active:
      return todos.filter(x => !x.completed);

    case FilterOption.Completed:
      return todos.filter(x => x.completed);

    case FilterOption.default:
      return todos;

    default:
      return todos;
  }
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterOption, setFilterOption] = useState<FilterOption>(
    FilterOption.default,
  );
  const [errorMessage, setErrorMessage] = useState<ErrorMessage>(
    ErrorMessage.default,
  );
  const [todoTitle, setTodoTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processings, setProcessings] = useState<number[]>([]);
  const isSaving = tempTodo !== null;
  const deleteTodo = async (id: number) => {
    setProcessings(prev => [...prev, id]);

    try {
      await deletePost(id);
      setTodos(prev => prev.filter(todo => todo.id !== id));
    } catch {
      setErrorMessage(ErrorMessage.delete);
    } finally {
      setProcessings(prev => prev.filter(x => x !== id));

      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  };

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = todoTitle.trim();

    if (!trimmed) {
      setErrorMessage(ErrorMessage.title);

      return;
    }

    const newTodo = { title: trimmed, completed: false, userId: USER_ID };

    setTempTodo({ ...newTodo, id: 0 });

    try {
      const created = await addPost(newTodo);

      setTodos(prev => [...prev, created]);
      setTodoTitle('');
    } catch {
      setErrorMessage(ErrorMessage.add);
    } finally {
      setTempTodo(null);

      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  }

  async function clearCompleted() {
    const ids = todos.filter(t => t.completed).map(t => t.id);

    if (!ids.length) {
      return;
    }

    setProcessings(prev => [...prev, ...ids]);

    const results = await Promise.allSettled(ids.map(id => deletePost(id)));
    const succeeded = results
      .map((r, i) => (r.status === 'fulfilled' ? ids[i] : null))
      .filter(Boolean) as number[];

    setTodos(prev => prev.filter(t => !succeeded.includes(t.id)));

    if (results.some(r => r.status === 'rejected')) {
      setErrorMessage(ErrorMessage.delete);
    }

    setProcessings(prev => prev.filter(x => !ids.includes(x)));

    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  }

  const usingTodos = FilteredTodos(todos, filterOption);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const todosFromServer = await getTodos();

        setTodos(todosFromServer);
      } catch {
        setErrorMessage(ErrorMessage.loading);
      }
    };

    load();
  }, []);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage(ErrorMessage.default);
      }, 3000);

      return () => clearTimeout(timer);
    }

    return;
  }, [errorMessage]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      {!USER_ID && <UserWarning message="Please set your USER_ID" />}
      {USER_ID && (
        <ErrorNotification
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
        />
      )}
      <div className="todoapp__content">
        <TodoHeader
          handleSubmit={handleSubmit}
          todos={usingTodos}
          todoTitle={todoTitle}
          setTodoTitle={setTodoTitle}
          inputRef={inputRef}
          isSaving={isSaving}
        ></TodoHeader>
        <TodoMain
          usingTodos={usingTodos}
          processings={processings}
          onDelete={deleteTodo}
          tempTodo={tempTodo}
        ></TodoMain>
        {todos.length > 0 && (
          <TodoFooter
            todos={todos}
            filterOption={filterOption}
            setFilterOption={setFilterOption}
            clearCompleted={clearCompleted}
          ></TodoFooter>
        )}
      </div>
    </div>
  );
};
