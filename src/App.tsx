import React, { useEffect, useState } from 'react';
import {
  USER_ID,
  createTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from './api/todos';
import { ErrorNotification } from './components/errorNotification';
import { Footer } from './components/footer';
import { Header } from './components/header';
import { TodoList } from './components/todoList';
import { Todo } from './types/Todo';
import { UserWarning } from './UserWarning';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [loading, setLoading] = useState<boolean>(false);
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [editingTodoTitle, setEditingTodoTitle] = useState<string>('');

  useEffect(() => {
    if (USER_ID) {
      setLoading(true);
      getTodos()
        .then(setTodos)
        .catch(() => setError('Unable to load todos'))
        .finally(() => setLoading(false));
    }
  }, []);

  const handleAddTodo = (event: React.FormEvent) => {
    event.preventDefault();
    if (!newTodo.trim()) {
      setError('Title should not be empty');

      return;
    }

    setLoading(true);

    createTodo(newTodo)
      .then((newTodoItem: Todo) => {
        setTodos(prevTodos => [...prevTodos, newTodoItem]);
        setNewTodo('');
      })
      .catch(() => {
        setError('Unable to add a todo');
      })
      .finally(() => setLoading(false));
  };

  const handleToggleTodo = (todo: Todo) => {
    const updatedTodo = { ...todo, completed: !todo.completed };

    setLoading(true);

    updateTodo(todo.id, updatedTodo)
      .then(() => {
        setTodos(prevTodos =>
          prevTodos.map(t => (t.id === todo.id ? updatedTodo : t)),
        );
      })
      .catch(() => {
        setError('Unable to update a todo');
      })
      .finally(() => setLoading(false));
  };

  const handleToggleAllTodos = () => {
    const allCompleted = todos.every(todo => todo.completed);
    const newStatus = !allCompleted;

    setLoading(true);

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
      .finally(() => setLoading(false));
  };

  const handleDeleteTodo = (todoId: number) => {
    const deletedTodo = todos.find(todo => todo.id === todoId);

    if (!deletedTodo) {
      return;
    }

    setLoading(true);

    deleteTodo(todoId)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        setError('Unable to delete a todo');
      })
      .finally(() => setLoading(false));
  };

  const handleEditTodo = (todo: Todo) => {
    setEditingTodoId(todo.id);
    setEditingTodoTitle(todo.title);
  };

  const handleUpdateTodo = (event: React.FormEvent) => {
    event.preventDefault();
    if (editingTodoTitle.trim() === '') {
      handleDeleteTodo(editingTodoId as number);

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

    setLoading(true);

    const newTodoo = { ...updatedTodo, title: editingTodoTitle };

    updateTodo(editingTodoId as number, newTodoo)
      .then(() => {
        setTodos(prevTodos =>
          prevTodos.map(todo => (todo.id === editingTodoId ? newTodoo : todo)),
        );
        setEditingTodoId(null);
      })
      .catch(() => {
        setError('Unable to update a todo');
      })
      .finally(() => setLoading(false));
  };

  const handleCancelEdit = () => {
    setEditingTodoId(null);
  };

  const handleClearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
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
            <Header
              newTodo={newTodo}
              loading={loading}
              onAddTodo={handleAddTodo}
              onNewTodoChange={setNewTodo}
              onToggleAllTodos={handleToggleAllTodos}
              allCompleted={allCompleted}
            />

            <TodoList
              todos={todos}
              filter={filter}
              editingTodoId={editingTodoId}
              editingTodoTitle={editingTodoTitle}
              loading={loading}
              onToggleTodo={handleToggleTodo}
              onDeleteTodo={handleDeleteTodo}
              onEditTodo={handleEditTodo}
              onUpdateTodo={handleUpdateTodo}
              onEditingTodoTitleChange={setEditingTodoTitle}
              onCancelEdit={handleCancelEdit}
            />

            {todos.length > 0 && (
              <Footer
                todos={todos}
                filter={filter}
                onSetFilter={setFilter}
                onClearCompleted={handleClearCompleted}
              />
            )}
          </div>

          <ErrorNotification data-cy="ErrorNotification" error={error} />
        </>
      )}
    </div>
  );
};
