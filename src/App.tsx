import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import {
  deleteTodos,
  getTodos,
  patchTodos,
  postTodos,
  USER_ID,
} from './api/todos';
import { Todo } from './types/Todo';
import { Footer } from './components/Footer';
import { Selected } from './types/Selected';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';

export const App: React.FC = () => {
  const [allTodos, setAllTodos] = useState<Todo[]>([]);
  const [errors, setErrors] = useState('');
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [updatingText, setUpdatingText] = useState('');
  const [loadingTodo, setLoadingTodo] = useState(true);
  const [editTodo, setEditTodo] = useState('');
  const [selected, setSelected] = useState<Selected>(Selected.All);
  const [disabledInput, setDisabledInput] = useState<boolean>(false);
  const [temp, setTemp] = useState<Todo | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const todos = await getTodos();

        if (!todos || todos.length === 0) {
          setErrors('Unable to load todos');
          setAllTodos([]);
        } else {
          setAllTodos(todos);
          setErrors('');
        }
      } catch {
        setErrors('Unable to load todos');
      } finally {
        setLoadingTodo(false);
      }
    };

    loadTodos();
  }, []);

  useEffect(() => {
    if (!errors) {
      return;
    }

    const timeout = setTimeout(() => setErrors(''), 3000);

    return () => clearTimeout(timeout);
  }, [errors]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const filteredTodos = allTodos.filter(todo => {
    if (selected === Selected.Active) {
      return !todo.completed;
    }

    if (selected === Selected.Completed) {
      return todo.completed;
    }

    return true;
  });

  const completedTodos = allTodos.filter(todo => todo.completed).length;

  const handleEdit = (id: number, title: string) => {
    setUpdatingId(id);
    setUpdatingText(title);
  };

  const handleAdd = async () => {
    if (editTodo.trim() === '') {
      setErrors('Title should not be empty');

      return;
    }

    const tempTodo: Todo = {
      id: Math.random(),
      title: editTodo.trim(),
      completed: false,
      userId: USER_ID!,
    };

    setTemp(tempTodo);
    setDisabledInput(true);

    try {
      const newTodo = await postTodos({
        title: editTodo.trim(),
        completed: false,
      });

      setEditTodo('');
      setAllTodos(current => [...current, newTodo]);
      setEditTodo('');
    } catch {
      setErrors('Unable to add a todo');
    } finally {
      setTemp(null);
      setDisabledInput(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  };

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      await deleteTodos(id);
      setAllTodos(current => current.filter(todo => todo.id !== id));
    } catch {
      setErrors('Unable to delete a todo');
    } finally {
      setDeletingId(null);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  };

  const handleSave = async (id: number) => {
    if (!updatingText.trim()) {
      return;
    }

    try {
      const updatedTodo = await patchTodos(id, { title: updatingText.trim() });

      setAllTodos(current => current.map(t => (t.id === id ? updatedTodo : t)));
    } catch {
      setErrors('Unable to update todo');
    } finally {
      setUpdatingId(null);
      setUpdatingText('');
    }
  };

  const toggleCompleted = async (id: number, currentStatus: boolean) => {
    try {
      const updatedTodo = await patchTodos(id, { completed: !currentStatus });

      setAllTodos(current => current.map(t => (t.id === id ? updatedTodo : t)));
    } catch {
      setErrors('Unable to update todo');
    }
  };

  const clearAllCompleted = async () => {
    const completedTodosList = allTodos.filter(todo => todo.completed);

    const successfulDeletions: number[] = [];

    await Promise.all(
      completedTodosList.map(async todo => {
        try {
          await deleteTodos(todo.id);
          successfulDeletions.push(todo.id);
        } catch {
          setErrors('Unable to delete a todo');
        }
      }),
    );

    setAllTodos(current =>
      current.filter(todo => !successfulDeletions.includes(todo.id)),
    );
    inputRef.current?.focus();
  };

  const updateAllToCompleted = async () => {
    const shouldCompleteAll = !allTodos.every(todo => todo.completed);

    try {
      const updatedTodos = await Promise.all(
        allTodos.map(todo =>
          patchTodos(todo.id, { completed: shouldCompleteAll }),
        ),
      );

      setAllTodos(updatedTodos);
    } catch {
      setErrors('Unable to update all todos');
    }
  };

  const errorNotificationClass = classNames(
    'notification',
    'is-danger',
    'is-light',
    'has-text-weight-normal',
    { hidden: !errors },
  );

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          updateAll={updateAllToCompleted}
          handleAdd={handleAdd}
          editTodo={editTodo}
          setEditTodo={setEditTodo}
          disabledInput={disabledInput}
          inputRef={inputRef}
        />

        <TodoList
          loadingTodo={loadingTodo}
          filteredTodos={filteredTodos}
          toggleCompleted={toggleCompleted}
          updatingId={updatingId}
          handleSave={handleSave}
          updatingText={updatingText}
          setUpdatingText={setUpdatingText}
          temp={temp}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          deletingId={deletingId}
        />

        {allTodos.length > 0 && (
          <Footer
            allTodos={allTodos}
            selected={selected}
            setSelected={setSelected}
            clearAll={clearAllCompleted}
            completedTodos={completedTodos}
          />
        )}
      </div>

      <div data-cy="ErrorNotification" className={errorNotificationClass}>
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrors('')}
        ></button>
        {errors}
      </div>
    </div>
  );
};
