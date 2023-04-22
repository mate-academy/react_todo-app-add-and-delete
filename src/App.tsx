import React, {
  ChangeEvent,
  useEffect,
  useState,
} from 'react';

import { getTodos, addTodo, removeTodo } from './api/todos';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { Filter } from './components/Filter/Filter';
import { NewTodo } from './components/NewTodo/NewTodo';
import NotificationError from
  './components/NotificationError/NotificationError';

const USER_ID = 6846;

export const App: React.FC = () => {
  const [task, setTask] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState('');
  const [tempTodo, setTemptodo] = useState<Todo | null>(null);
  const [isDataUpdated, setIsdataUpdated] = useState(false);
  const [activeIds, setActiveIds] = useState([0]);

  const handleTodoChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTask(event.target.value);
  };

  const loadTodos = async () => {
    setIsdataUpdated(true);

    try {
      const todosFromServer = await getTodos(Number(USER_ID));

      setTodos(todosFromServer);
    } catch {
      setError('unable to get todos');
    } finally {
      setIsdataUpdated(false);
      setTemptodo(null);
    }
  };

  const handleTodoSubmit = async (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!task.trim().length) {
      setError("The title can't be empty");
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
      setError('unable to add todos');
    } finally {
      setTemptodo(null);
      setActiveIds([0]);
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const handleRemoveTodo = async (id: number) => {
    setActiveIds((activeId) => [...activeId, id]);

    try {
      await removeTodo(id);
      loadTodos();
    } catch {
      setError('unable to delete a todo');
    } finally {
      setActiveIds([0]);
    }
  };

  const handleClearCompleted = () => {
    todos.forEach(todo => {
      if (todo.completed) {
        handleRemoveTodo(todo.id);
      }
    });
  };

  const resetError = () => setError('');

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

      {error && (
        <NotificationError
          error={error}
          resetError={resetError}
        />
      )}
    </div>
  );
};
