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

    if (task) {
      setTemptodo({
        id: 0,
        userId: USER_ID,
        title: task,
        completed: false,
      });
    }

    try {
      await getTodos(Number(USER_ID)).then(res => {
        setTodos(res);
        setTemptodo(null);
        setIsdataUpdated(false);
      });
    } catch {
      setError('unable to get todos');
    }
  };

  const handleTodoSubmit = async (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (task === '') {
      setError("The title can't be empty");

      return;
    }

    try {
      await addTodo({
        userId: USER_ID,
        title: task,
        completed: false,
      }).then(() => loadTodos());
    } catch {
      setError('unable to add todos');
    }

    setActiveIds([0]);
    setTask('');
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const handleRemoveTodo = async (id: number) => {
    setActiveIds((activeId) => [...activeId, id]);

    try {
      await removeTodo(id)
        .then(() => {
          loadTodos();
        });
    } catch {
      setError('Unable to delete a todo');
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

        {
          todos.length > 0 && (
            <Filter
              todos={todos}
              tempTodo={tempTodo}
              activeIds={activeIds}
              handleRemoveTodo={handleRemoveTodo}
              handleClearCompleted={handleClearCompleted}
            />
          )
        }
      </div>

      {
        error
        && (
          <NotificationError
            error={error}
            resetError={resetError}
          />
        )
      }
    </div>
  );
};
