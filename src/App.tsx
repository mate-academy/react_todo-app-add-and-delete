import React, { useEffect, useState } from 'react';
import { UserWarning } from './components/UserWarning';
import { getTodos, addTodo } from './api/todos';

import { TodoHeader } from './components/TodoHeader';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import { ErrorNotification } from './components/ErrorNotification';

import { Todo } from './types/Todo';
import { TodoCompletionType } from './types/TodoCompletionType';
import { ErrorType } from './types/ErrorType';
import { filterTodos, getActiveTodosCount } from './common/helpers';

const USER_ID = 6955;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<ErrorType>(ErrorType.None);
  const [selectedFilterOption, setSelectedFilterOption]
    = useState(TodoCompletionType.All);

  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const onTodoAdd = async (todoTitle: string): Promise<void> => {
    if (todoTitle === '') {
      setError(ErrorType.EmptyTitle);

      return;
    }

    const newTodo: Todo = {
      id: 0,
      title: todoTitle,
      completed: false,
      userId: USER_ID,
    };

    setTempTodo(newTodo);

    try {
      const newTodoFromServer = await addTodo(USER_ID, newTodo);

      setTodos((prevTodos) => (
        [
          ...prevTodos,
          newTodoFromServer,
        ]
      ));
    } catch {
      setError(ErrorType.AddTodo);
    } finally {
      setTempTodo(null);
    }
  };

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => setError(ErrorType.LoadTodos));
  }, []);

  const filteredTodos = filterTodos(todos, selectedFilterOption);

  const activeTodosCount = getActiveTodosCount(todos);
  const hasCompletedTodos = activeTodosCount !== todos.length;

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader onTodoAdd={onTodoAdd} />

        {todos.length > 0 && (
          <>
            <TodoList
              todos={filteredTodos}
              tempTodo={tempTodo}
            />

            <TodoFooter
              selectedFilterOption={selectedFilterOption}
              onFilterSelect={setSelectedFilterOption}
              activeTodosCount={activeTodosCount}
              hasCompletedTodos={hasCompletedTodos}
            />
          </>
        )}
      </div>

      <ErrorNotification
        error={error}
        onClose={() => setError(ErrorType.None)}
      />
    </div>
  );
};
