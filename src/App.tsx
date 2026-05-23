// /* eslint-disable jsx-a11y/label-has-associated-control */
// /* eslint-disable jsx-a11y/control-has-associated-label */

import React, { useState, useEffect } from 'react';
import { FilterType, ErrorMessage } from './types/Enum';
import { UserWarning } from './UserWarning';
import { USER_ID, getTodos, createTodo, deleteTodo } from './api/todos';
import { Todo } from './types/Todo';

import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(ErrorMessage.None);
  const [filter, setFilter] = useState<FilterType>(FilterType.All);
  const [title, setTitle] = useState('');
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingTodoIds, setDeletingTodoIds] = useState<number[]>([]);

  const onAddTodo = (todoTitle: string) => {
    setIsSubmiting(true);
    const newTempTodo: Todo = {
      id: 0,
      title: todoTitle,
      completed: false,
      userId: USER_ID,
    };

    setTempTodo(newTempTodo);

    createTodo({ title: todoTitle, userId: USER_ID, completed: false })
      .then(createdTodo => {
        setTodos(currentTodos => [...currentTodos, createdTodo]);
        setTitle('');
      })
      .catch(() => setErrorMessage(ErrorMessage.Add))
      .finally(() => {
        setIsSubmiting(false);
        setTempTodo(null);
      });
  };

  const onDeleteTodo = (todoId: number) => {
    setDeletingTodoIds(prev => [...prev, todoId]);

    deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.Delete);
      })
      .finally(() => {
        setDeletingTodoIds(currentIds =>
          currentIds.filter(id => id !== todoId),
        );
      });
  };

  useEffect(() => {
    getTodos()
      .then(data => setTodos(data))
      .catch(() => setErrorMessage(ErrorMessage.Load))
      .finally(() => setIsLoading(false));
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  let filteredTodos = todos;

  if (filter === FilterType.Active) {
    filteredTodos = todos.filter(todo => !todo.completed);
  } else if (filter === FilterType.Completed) {
    filteredTodos = todos.filter(todo => todo.completed);
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">{isLoading ? 'loading' : 'todos'}</h1>

      <div className="todoapp__content">
        <Header
          title={title}
          setTitle={setTitle}
          setErrorMessage={setErrorMessage}
          isSubmiting={isSubmiting}
          onAddTodo={onAddTodo}
          deletingTodoIds={deletingTodoIds}
        />

        {todos.length > 0 && (
          <>
            <TodoList
              todos={filteredTodos}
              tempTodo={tempTodo}
              deletingTodosIds={deletingTodoIds}
              onDelete={onDeleteTodo}
            />

            <Footer
              todos={todos}
              filter={filter}
              setFilter={setFilter}
              onDelete={onDeleteTodo}
            />
          </>
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
