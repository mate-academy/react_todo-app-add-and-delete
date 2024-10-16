import React, { useEffect, useMemo, useState } from 'react';
import { Header, Footer, Notification, TodoList } from './components';
import { USER_ID, getTodos, addTodo, deleteTodo } from './api/todos';
import { FilterOption, Todo, Error } from './types';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<Error>(Error.DEFAULT);
  const [filterOption, setFilterOption] = useState<FilterOption>(
    FilterOption.all,
  );
  const [todoInputValue, setTodoInputValue] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);

  const todosAmount = useMemo(() => todos.length, [todos]);
  const uncompletedTodosAmount = useMemo(
    () => todos.reduce((amount, todo) => amount + (todo.completed ? 0 : 1), 0),
    [todos],
  );

  const handleResetError = () => setError(Error.DEFAULT);

  const handleError = (message: Error) => {
    setError(message);

    setTimeout(handleResetError, 3000);
  };

  const handleSubmitTodo = (title: string) => {
    if (!title) {
      handleError(Error.EMPTY_TITLE);

      return;
    }

    const newTodo = {
      title: title.trim(),
      userId: USER_ID,
      completed: false,
    };

    setTempTodo({ ...newTodo, id: 0 });

    setIsLoading(true);

    addTodo(newTodo)
      .then(response => {
        setTodos(currentTodos => [...currentTodos, response]);
        setTodoInputValue('');
      })
      .catch(() => {
        handleError(Error.ADDING_TODO);
      })
      .finally(() => {
        setIsLoading(false);
        setTempTodo(null);
      });
  };

  const handleDeleteTodo = (id: number) => {
    setIsLoading(true);
    setLoadingTodoIds(current => [...current, id]);

    deleteTodo(id)
      .then(() =>
        setTodos(currentTodos => currentTodos.filter(todo => todo.id !== id)),
      )
      .catch(() => handleError(Error.DELETING_TODO))
      .finally(() => {
        setLoadingTodoIds(current =>
          current.filter(deletedId => deletedId !== id),
        );
        setIsLoading(false);
      });
  };

  const handleDeleteCompleted = () => {
    const completedIds = todos.reduce<number[]>((ids, todo) => {
      if (todo.completed) {
        ids.push(todo.id);
      }

      return ids;
    }, []);

    completedIds.forEach(handleDeleteTodo);
  };

  useEffect(() => {
    handleResetError();

    getTodos()
      .then(currentTodos => {
        setTodos(currentTodos);
      })
      .catch(() => {
        handleError(Error.LOADING_TODOS);
      });
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todosAmount={todosAmount}
          uncompletedTodosAmount={uncompletedTodosAmount}
          isLoading={isLoading}
          title={todoInputValue}
          onTitleChange={setTodoInputValue}
          onSubmit={handleSubmitTodo}
        />

        {!!todosAmount && (
          <>
            <TodoList
              todos={todos}
              filterOption={filterOption}
              tempTodo={tempTodo}
              onDelete={handleDeleteTodo}
              loadingTodoIds={loadingTodoIds}
              isNewTodoLoading={isLoading}
            />

            <Footer
              filterOption={filterOption}
              setFilterOption={setFilterOption}
              todosAmount={todosAmount}
              uncompletedTodosAmount={uncompletedTodosAmount}
              onDeleteCompleted={handleDeleteCompleted}
            />
          </>
        )}
      </div>

      <Notification error={error} onReset={handleResetError} />
    </div>
  );
};
