import React, { useEffect, useState, useRef } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, USER_ID, postTodo, deleteTodo } from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './Components/TodoList/TodoList';
import { Footer } from './Components/Footer/Footer';
import { Header } from './Components/Header/Header';
import cn from 'classnames';

export enum SelectOption {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [option, setOption] = useState(SelectOption.All);
  const [loading, setLoading] = useState(false);
  const [titleFInput, setTitleFInput] = useState('');
  const inputFocus = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage('Unable to load todos'))
      .finally(() => {
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      });
  }, []);

  useEffect(() => {
    inputFocus.current?.focus();
  }, [loading]);

  const filteredTodos = todos.filter(todo => {
    switch (option) {
      case SelectOption.Active:
        return !todo.completed;
      case SelectOption.Completed:
        return todo.completed;
      case SelectOption.All:
      default:
        return true;
    }
  });

  const todosLength = todos.filter(todo => !todo.completed).length;

  const checkCompletedTodos = todos.every(todo => todo.completed === true);

  function addTodo({ title, userId, completed }: Todo) {
    setLoading(true);
    postTodo({ title, userId, completed })
      .then(newTodo => setTodos(currentTodo => [...currentTodo, newTodo]))
      .catch(() => {
        setErrorMessage('Unable to add todo');
      })
      .finally(() => setLoading(false));
  }

  function deleteTodos(todoId: number) {
    setLoading(true);
    deleteTodo(todoId)
      .then(() =>
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        ),
      )
      .catch(() => setErrorMessage('Unable to delete a todo'))
      .finally(() => setLoading(false));
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!titleFInput.trim()) {
      setErrorMessage('Title should not be empty');

      return;
    }

    const newTodo = {
      id: 0,
      userId: USER_ID,
      title: titleFInput,
      completed: false,
    };

    setTitleFInput('');
    addTodo(newTodo);
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          onSetTitle={setTitleFInput}
          onSubmit={handleSubmit}
          title={titleFInput}
          onFocus={inputFocus}
          isLoading={loading}
        />

        <TodoList
          todos={filteredTodos}
          onDelete={deleteTodos}
          isLoading={loading}
        />
        {todos.length !== 0 && (
          <Footer
            todosCounter={todosLength}
            checkCompleted={checkCompletedTodos}
            option={option}
            onSetOption={setOption}
          />
        )}
      </div>
      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !errorMessage },
        )}
      >
        <button data-cy="HideErrorButton" type="button" className="delete" />
        {errorMessage}
      </div>
    </div>
  );
};
