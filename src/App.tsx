/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  USER_ID,
  getTodos,
  createTodo,
  deleteTodo,
  updateToDo,
} from './api/todos'; // Ensure createTodo is imported
import { Todo } from './types/Todo';
import { Status } from './types/Status';
import { Header, ToDoList, Error, Footer } from './components';

function getVisibleToDos(newTodos: Todo[], newStatus: Status) {
  switch (newStatus) {
    case Status.Active:
      return newTodos.filter(todo => !todo.completed);

    case Status.Completed:
      return newTodos.filter(todo => todo.completed);

    default:
      return newTodos;
  }
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState('');
  const [status, setStatus] = useState(Status.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setError('Unable to load todos');
      });
  }, []);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (error) {
      timeoutId = setTimeout(() => setError(''), 3000);
    }

    return () => clearTimeout(timeoutId);
  }, [error]);

  const visibleToDos = useMemo(
    () => getVisibleToDos(todos, status),
    [todos, status],
  );

  const addTodo = (toDoTitle: string) => {
    const newTitle = toDoTitle.trim();

    if (!newTitle) {
      setError('Title should not be empty');

      return;
    }

    setIsLoading(true);

    const newToDo = { id: 0, title: newTitle, completed: false };

    setTempTodo(newToDo);

    return createTodo(newToDo)
      .then(resultTodo => {
        setTodos([...todos, resultTodo]);
        setTitle('');
      })
      .catch(() => setError('Unable to add a todo'))
      .finally(() => {
        setTempTodo(null);
        setIsLoading(false);
      });
  };

  const deleteTodoById = (id: number) => {
    setIsLoading(true);

    return deleteTodo(id)
      .then(() => {
        setTodos(toDoState => toDoState.filter(todo => todo.id !== id));
      })
      .catch(() => {
        setError('Unable to delete a todo');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const updateToDoByID = (id: number, updatedToDo: Partial<Todo>) => {
    updateToDo(id, updatedToDo)
      .then(() =>
        setTodos(state =>
          state.map(todo =>
            todo.id === id ? { ...todo, ...updatedToDo } : todo,
          ),
        ),
      )
      .catch(() => setError('Unable to update a Todo'));
  };

  const handleDeleteCompleted = () => {
    setIsLoading(true);
    const promises: Promise<void>[] = [];

    todos.forEach(todo => {
      if (!todo.completed) {
        return;
      }

      promises.push(
        deleteTodo(todo.id)
          .then(() =>
            setTodos(prevTodos => prevTodos.filter(el => el.id !== todo.id)),
          )
          .catch(() => setError('Unable to delete a todo')),
      );
    });
    Promise.all(promises).finally(() => setIsLoading(false));
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          onToDoSave={addTodo}
          onTitleChange={setTitle}
          initialTitle={title}
          isLoading={isLoading}
        />
        <ToDoList
          visibleToDos={visibleToDos}
          onDelete={deleteTodoById}
          onUpdate={updateToDoByID}
          tempTodo={tempTodo}
        />
        {!!todos.length && (
          <Footer
            todos={todos}
            status={status}
            setStatus={setStatus}
            deleteCompleteTodo={handleDeleteCompleted}
          />
        )}
      </div>
      <Error error={error} setError={setError} />
    </div>
  );
};
