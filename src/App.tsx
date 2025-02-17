/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';

import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { Status } from './types/Status';
import { Header } from './components/Header/Header';
import { ToDoList } from './components/ToDoList/ToDoList';
import { Error } from './components/Error/Error';
import { Footer } from './components/Footer/Footer';

import { USER_ID } from './api/todos';
import { getTodos } from './api/todos';
import { createTodo } from './api/todos';
import { deleteTodo } from './api/todos';
import { updateToDo } from './api/todos';

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

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setError('Unable to load todos');
      });
  }, []);

  useEffect(() => {
    if (error) {
      setTimeout(() => setError(''), 3000);
    }
  }, [error]);

  const visibleToDos = useMemo(
    () => getVisibleToDos(todos, status),
    [todos, status],
  );

  const addTodo = async (toDoTitle: string) => {
    const newTitle = toDoTitle.trim();

    if (!newTitle) {
      setError('Title should not be empty');

      return;
    }

    const newToDo = { id: 0, title: newTitle, completed: false };

    setTempTodo(newToDo);
    createTodo(newToDo)
      .then(resultTodo => {
        setTodos([...todos, resultTodo]);
        setTitle('');
      })
      .catch(() => setError('Unable to add a todo'))
      .finally(() => setTempTodo(null));
  };

  const deleteTodoById = async (id: number) => {
    try {
      await deleteTodo(id);
      setTodos(toDoState => toDoState.filter(todo => todo.id !== id));
    } catch {
      setError('Unable to delete a todo');
    }
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
    todos.forEach(todo => {
      if (!todo.completed) {
        return;
      }

      deleteTodo(todo.id)
        .then(() =>
          setTodos(prevTodos => prevTodos.filter(el => el.id !== todo.id)),
        )
        .catch(() => setError('Unable to delete a todo'));
    });
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
