import React, {
  ChangeEvent, useCallback, useEffect, useState,
} from 'react';

import { getTodos, addTodo, removeTodo } from './api/todos';
import { UserWarning } from './UserWarning';
import { Todo, ErrorTypes } from './types/types';
import { Filter } from './components/Filter/Filter';
import { NewTodo } from './components/NewTodo/NewTodo';
// eslint-disable-next-line max-len
import NotificationError from './components/NotificationError/NotificationError';

const USER_ID = 6982;

export const App: React.FC = () => {
  const [task, setTask] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState(ErrorTypes.none);
  const [tempTodo, setTemptodo] = useState<Todo | null>(null);
  const [isDataUpdated, setIsdataUpdated] = useState(false);
  const [activeIds, setActiveIds] = useState([0]);

  const handleTodoChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTask(event.target.value);
  };

  const resetTempTodo = useCallback(() => {
    setTemptodo(null);
    setActiveIds([0]);
  }, []);

  const loadTodos = async () => {
    setIsdataUpdated(true);

    try {
      const todosFromServer = await getTodos(Number(USER_ID));

      setTodos(todosFromServer);
    } catch {
      setError(ErrorTypes.get);
    } finally {
      setIsdataUpdated(false);
      resetTempTodo();
    }
  };

  const handleTodoSubmit = async (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!task.trim().length) {
      setError(ErrorTypes.emptyTitle);
      setTask('');

      return;
    }

    setTemptodo({
      id: 0,
      userId: USER_ID,
      title: task,
      completed: false,
    });
    setTask('');

    try {
      await addTodo({
        userId: USER_ID,
        title: task,
        completed: false,
      });
      loadTodos();
    } catch {
      setError(ErrorTypes.add);
      resetTempTodo();
    }
  };

  const handleRemoveTodo = async (id: number) => {
    setActiveIds((activeId) => [...activeId, id]);

    try {
      await removeTodo(id);
      loadTodos();
    } catch {
      setError(ErrorTypes.delete);
      resetTempTodo();
    }
  };

  const handleClearCompleted = () => {
    todos.forEach((todo) => {
      if (todo.completed) {
        handleRemoveTodo(todo.id);
      }
    });
  };

  const resetError = () => setError(ErrorTypes.none);

  useEffect(() => {
    loadTodos();
  }, []);
  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title is-1">todos</h1>

      <div className="todoapp__content">
        <NewTodo
          task={task}
          isDataUpdated={isDataUpdated}
          handleTodoChange={handleTodoChange}
          handleTodoSubmit={handleTodoSubmit}
        />

        {(todos.length > 0 || tempTodo) && (
          <Filter
            todos={todos}
            tempTodo={tempTodo}
            activeIds={activeIds}
            handleRemoveTodo={handleRemoveTodo}
            handleClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      {error && <NotificationError error={error} resetError={resetError} />}
    </div>
  );
};
