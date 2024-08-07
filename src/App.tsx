{
  /* eslint-disable import/extensions */
}

import React, { useEffect, useState } from 'react';
import {
  USER_ID,
  createTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from './api/todos';
{
  /*  eslint-disable-next-line import/extensions */
}

import { ErrorNotification } from './components/ErrorNotification.tsx';
import { Footer } from './components/Footer.tsx';
import { Header } from './components/Header.tsx';
import { TodoList } from './components/TodoList.tsx';
import { Todo } from './types/Todo';
import { UserWarning } from './UserWarning.tsx';

enum Filter {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [newTodo, setNewTodo] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [isLoading, setIsLoading] = useState(false);
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [editingTodoTitle, setEditingTodoTitle] = useState<string>('');

  useEffect(() => {
    if (USER_ID) {
      setIsLoading(true);
      getTodos()
        .then(setTodos)
        .catch(() => setError('Unable to load todos'))
        .finally(() => setIsLoading(false));
    }
  }, []);

  const handleAddTodo = (title: string) => {
    if (!title.trim()) {
      setError('Title should not be empty');

      return;
    }

    setIsLoading(true);

    const newTempTodo: Todo = {
      id: 0,
      title: newTodo,
      completed: false,
      userId: USER_ID,
    };

    setTempTodo(newTempTodo);

    createTodo(title)
      .then((newTodoItem: Todo) => {
        setTodos(prevTodos => [...prevTodos, newTodoItem]);
        setNewTodo('');
        setTempTodo(null);
      })
      .catch(() => {
        setError('Unable to add a todo');
        setTempTodo(null);
      })
      .finally(() => setIsLoading(false));
  };

  const handleToggleTodo = (todo: Todo) => {
    const updatedTodo = { ...todo, completed: !todo.completed };

    setIsLoading(true);

    updateTodo(todo.id, updatedTodo)
      .then(() => {
        setTodos(prevTodos =>
          prevTodos.map(t => (t.id === todo.id ? updatedTodo : t)),
        );
      })
      .catch(() => {
        setError('Unable to update a todo');
      })
      .finally(() => setIsLoading(false));
  };

  const handleToggleAllTodos = () => {
    const allCompleted = todos.every(todo => todo.completed);
    const newStatus = !allCompleted;

    setIsLoading(true);

    const updatedTodos = todos.map(todo => ({
      ...todo,
      completed: newStatus,
    }));

    Promise.all(
      updatedTodos.map(todo =>
        updateTodo(todo.id, todo).catch(() => {
          setError('Unable to update a todo');
        }),
      ),
    )
      .then(() => {
        setTodos(updatedTodos);
      })
      .finally(() => setIsLoading(false));
  };

  const handleDeleteTodo = (todoId: number) => {
    const deletedTodo = todos.find(todo => todo.id === todoId);

    if (!deletedTodo) {
      return;
    }

    setIsLoading(true);

    deleteTodo(todoId)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        setError('Unable to delete a todo');
      })
      .finally(() => setIsLoading(false));
  };

  const handleEditTodo = (todo: Todo) => {
    setEditingTodoId(todo.id);
    setEditingTodoTitle(todo.title);
  };

  const handleUpdateTodo = (event: React.FormEvent, todoId: number) => {
    event.preventDefault();
    if (editingTodoTitle.trim() === '') {
      handleDeleteTodo(todoId);

      return;
    }

    const updatedTodo = todos.find(todo => todo.id === editingTodoId);

    if (!updatedTodo) {
      return;
    }

    if (updatedTodo.title === editingTodoTitle) {
      setEditingTodoId(null);

      return;
    }

    setIsLoading(true);

    // eslint-disable-next-line @typescript-eslint/no-shadow
    const newTodo = { ...updatedTodo, title: editingTodoTitle };

    updateTodo(todoId, newTodo)
      .then(() => {
        setTodos(prevTodos =>
          prevTodos.map(todo => (todo.id === todoId ? newTodo : todo)),
        );
        setEditingTodoId(null);
      })
      .catch(() => {
        setError('Unable to update a todo');
      })
      .finally(() => setIsLoading(false));
  };

  const handleCancelEdit = () => {
    setEditingTodoId(null);
  };

  const handleClearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    if (completedTodos.length === 0) {
      return;
    }

    setIsLoading(true);

    Promise.all(
      completedTodos.map(todo =>
        deleteTodo(todo.id).catch(() => {
          setError('Unable to delete a todo');
        }),
      ),
    )
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => !todo.completed));
      })
      .finally(() => setIsLoading(false));
  };

  const allCompleted = todos.length > 0 && todos.every(todo => todo.completed);

  return (
    <div className="todoapp">
      {!USER_ID ? (
        <UserWarning />
      ) : (
        <>
          <h1 className="todoapp__title">todos</h1>

          <div className="todoapp__content">
            {todos.length === 0 ? (
              <Header
                loading={isLoading}
                onAddTodo={handleAddTodo}
                onToggleAllTodos={() => {}}
                allCompleted={false}
              />
            ) : (
              <>
                <Header
                  loading={isLoading}
                  onAddTodo={handleAddTodo}
                  onToggleAllTodos={handleToggleAllTodos}
                  allCompleted={allCompleted}
                />

                <TodoList
                  todos={todos}
                  tempTodo={tempTodo}
                  filter={filter}
                  editingTodoId={editingTodoId}
                  editingTodoTitle={editingTodoTitle}
                  loading={isLoading}
                  onToggleTodo={handleToggleTodo}
                  onDeleteTodo={handleDeleteTodo}
                  onEditTodo={handleEditTodo}
                  onUpdateTodo={handleUpdateTodo}
                  onEditingTodoTitleChange={setEditingTodoTitle}
                  onCancelEdit={handleCancelEdit}
                />

                <Footer
                  todos={todos}
                  filter={filter}
                  onSetFilter={setFilter}
                  onClearCompleted={handleClearCompleted}
                />
              </>
            )}
          </div>

          <ErrorNotification data-cy="ErrorNotification" error={error} />
        </>
      )}
    </div>
  );
};
