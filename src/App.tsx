/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { deleteTodo, getTodos, postTodo, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);

  const activeTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos
    .filter(todo => todo.completed)
    .map(todo => todo.id);

  const inputRef = useRef<HTMLInputElement>(null);

  const onError = (errorString: string) => {
    setErrorMessage(errorString);
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  };

  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case 'active':
        return !todo.completed;
      case 'completed':
        return todo.completed;
      case 'all':
      default:
        return todo;
    }
  });

  const handlClearAll = async () => {
    try {
      setLoadingTodoIds(completedTodos);
      const deletionList = await Promise.allSettled(
        completedTodos.map(id => deleteTodo(id)),
      );

      const hasErorr = deletionList.some(item => item.status === 'rejected');
      const seccessIds = completedTodos
        .map((id, i) => (deletionList[i].status === 'fulfilled' ? id : null))
        .filter((id): id is number => id !== null);

      setTodos(prev => prev.filter(todo => !seccessIds.includes(todo.id)));
      setLoadingTodoIds([]);

      if (hasErorr) {
        onError('Unable to delete a todo');
      }
    } catch {
      onError('Unable to delete a todo');
    }
  };

  const handleDelete = async (todosId: number) => {
    try {
      setLoadingTodoIds([todosId]);
      const deleteAproved = await deleteTodo(todosId);

      if (deleteAproved) {
        setTodos(filteredTodos.filter(todo => todo.id !== todosId));
        setLoadingTodoIds([]);
      }
    } catch (error) {
      onError('Unable to delete a todo');
      setLoadingTodoIds([]);
    }
  };

  const handleTodoSubmit = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    try {
      if (e.key === 'Enter') {
        e.preventDefault();
        const cleanInput = input.trim();

        if (cleanInput !== '') {
          const tempTodoObject: Todo = {
            id: 0,
            title: cleanInput,
            userId: USER_ID,
            completed: false,
          };

          setTempTodo(tempTodoObject);
          const newTodo = await postTodo(cleanInput);

          if (newTodo) {
            setTempTodo(null);
            setTodos([...todos, newTodo]);
            setInput('');
            setErrorMessage('');
            if (inputRef.current) {
              inputRef.current.focus();
            }
          }
        }

        if (!cleanInput) {
          onError('Title should not be empty');
          setTempTodo(null);
        }
      }
    } catch (error) {
      onError('Unable to add a todo');
      setTempTodo(null);
    }
  };

  useEffect(() => {
    getTodos()
      .then((res: Todo[]) => {
        setTodos(res);
      })
      .catch(() => {
        onError('Unable to load todos');
      });
  }, []);

  useEffect(() => {
    if (tempTodo === null || loadingTodoIds) {
      inputRef.current?.focus();
    }
  }, [tempTodo, loadingTodoIds]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          inputRef={inputRef}
          tempTodo={tempTodo}
          input={input}
          setInput={setInput}
          handleTodoSubmit={handleTodoSubmit}
        />
        <TodoList
          filteredTodos={filteredTodos}
          loadingTodoIds={loadingTodoIds}
          tempTodo={tempTodo}
          handleDelete={handleDelete}
        />
        {todos.length > 0 && (
          <Footer
            activeTodos={activeTodos}
            completedTodos={completedTodos}
            filter={filter}
            setFilter={setFilter}
            handlClearAll={handlClearAll}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${errorMessage ? '' : 'hidden'}`}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => {
            setErrorMessage('');
          }}
        />
        {/* show only one message at a time */}
        {errorMessage}
        {/* Unable to update a todo */}
      </div>
    </div>
  );
};
