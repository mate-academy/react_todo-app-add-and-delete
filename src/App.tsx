import React, { useEffect, useState } from 'react';

import * as TodosService from './api/todos';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import { Filter } from './types/Filter';
import { getVisibleTodos } from './utils/getVisibleTodos';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ErrorMessage } from './components/ErrorMessage';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [errorMessage, setErrorMessage] = useState('');
  const [todoTitle, setTodoTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [todoLoadingIds, setLoadingTodoIds] = useState<number[]>([]);

  const visibleTodos = getVisibleTodos(todos, filter);
  const trimmedTitle = todoTitle.trim();

  useEffect(() => {
    setErrorMessage('');
    setIsLoading(true);
    TodosService.getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage('Unable to load todos'))
      .finally(() => setIsLoading(false));
  }, []);

  function addTodo({ title, userId, completed }: Todo) {
    setTempTodo({ title, userId, completed, id: 0 });
    setIsLoading(true);

    TodosService.addTodo({ title, userId, completed })
      .then(newTodo => {
        setTodos(prevTodos => [...prevTodos, newTodo]);
        setTodoTitle('');
      })
      .catch(() => setErrorMessage('Unable to add a todo'))
      .finally(() => {
        setIsLoading(false);
        setTempTodo(null);
      });
  }

  function deleteTodo(todoId: number) {
    setIsLoading(true);
    setLoadingTodoIds(prev => [...prev, todoId]);

    TodosService.deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => setErrorMessage('Unable to delete a todo'))
      .finally(() => {
        setIsLoading(false);
        setLoadingTodoIds(prev => prev.filter(id => id !== todoId));
      });
  }

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTodoTitle(event.target.value);
  };

  const handleSubmit = () => {
    if (trimmedTitle) {
      addTodo({
        title: trimmedTitle,
        id: 0,
        userId: TodosService.USER_ID,
        completed: false,
      });
    } else {
      setErrorMessage('Title should not be empty');
    }
  };

  const handleClearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);
    const idsToDelete = completedTodos.map(todo => todo.id);

    setLoadingTodoIds(idsToDelete);

    Promise.allSettled(
      completedTodos.map(todo =>
        TodosService.deleteTodo(todo.id).then(() => {
          setTodos(current =>
            current.filter(complitedTodo => complitedTodo.id !== todo.id),
          );
        }),
      ),
    )
      .then(results => {
        const hasError = results.some(result => result.status === 'rejected');

        if (hasError) {
          setErrorMessage('Unable to delete a todo');
        }
      })
      .finally(() => setLoadingTodoIds([]));
  };

  if (!TodosService.USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          title={todoTitle}
          onTitleChange={handleTitleChange}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />

        <TodoList
          todos={visibleTodos}
          tempTodo={tempTodo}
          onTodoDelete={deleteTodo}
          todoLoadingIds={todoLoadingIds}
        />

        {!!todos.length && (
          <Footer
            todos={todos}
            filter={filter}
            onFilterChange={setFilter}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <ErrorMessage
        errorMessage={errorMessage}
        onErrorChange={setErrorMessage}
      />
    </div>
  );
};
