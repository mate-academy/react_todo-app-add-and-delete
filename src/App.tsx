import React, { useEffect, useState } from 'react';
import {
  USER_ID,
  createTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from './api/todos';
import { ErrorNotification } from './components/ErrorNotification';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Todo } from './types/Todo';
import { UserWarning } from './UserWarning';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [editingTodoTitle, setEditingTodoTitle] = useState<string>('');
  const [loadingTodos, setLoadingTodos] = useState<number[]>([]);
  const [isAddingTodo, setIsAddingTodo] = useState<boolean>(false);
  const [tempTodoId, setTempTodoId] = useState<number | null>(null);

  useEffect(() => {
    if (USER_ID) {
      getTodos()
        .then(setTodos)
        .catch(() => setError('Unable to load todos'));
    }
  }, []);

  const handleAddTodo = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!newTodo.trim()) {
      setError('Title should not be empty');

      return;
    }

    const tempTodoItem: Todo = {
      id: Date.now(),
      userId: USER_ID,
      title: newTodo.trim(),
      completed: false,
    };

    setTodos(prevTodos => [...prevTodos, tempTodoItem]);

    setIsAddingTodo(true);
    setTempTodoId(tempTodoItem.id);

    try {
      const newTodoItem = await createTodo(newTodo.trim());

      setTodos(prevTodos =>
        prevTodos.map(todo =>
          todo.id === tempTodoItem.id ? newTodoItem : todo,
        ),
      );
      setNewTodo('');
    } catch {
      setError('Unable to add a todo');
      setTodos(prevTodos =>
        prevTodos.filter(todo => todo.id !== tempTodoItem.id),
      );
    } finally {
      setIsAddingTodo(false);
      setTempTodoId(null);
    }
  };

  const handleToggleTodo = async (todo: Todo) => {
    const updatedTodo = { ...todo, completed: !todo.completed };

    setLoadingTodos(prev => [...prev, todo.id]);

    try {
      await updateTodo(todo.id, updatedTodo);
      setTodos(prevTodos =>
        prevTodos.map(t => (t.id === todo.id ? updatedTodo : t)),
      );
    } catch {
      setError('Unable to update a todo');
    } finally {
      setLoadingTodos(prev => prev.filter(id => id !== todo.id));
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
    const deletedTodo = todos.find(todo => todo.id === todoId);

    if (!deletedTodo) {
      return;
    }

    setLoadingTodos(prev => [...prev, todoId]);

    try {
      await deleteTodo(todoId);
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
    } catch {
      setError('Unable to delete a todo');
    } finally {
      setLoadingTodos(prev => prev.filter(id => id !== todoId));
    }
  };

  const handleEditTodo = (todo: Todo) => {
    setEditingTodoId(todo.id);
    setEditingTodoTitle(todo.title);
  };

  const handleUpdateTodo = async (event: React.FormEvent) => {
    event.preventDefault();

    if (editingTodoTitle.trim() === '') {
      await handleDeleteTodo(editingTodoId as number);

      return;
    }

    const updatedTodo = todos.find(todo => todo.id === editingTodoId);

    if (!updatedTodo) {
      return;
    }

    if (updatedTodo.title === editingTodoTitle.trim()) {
      setEditingTodoId(null);

      return;
    }

    setLoadingTodos(prev => [...prev, editingTodoId as number]);

    try {
      await updateTodo(editingTodoId as number, {
        ...updatedTodo,
        title: editingTodoTitle.trim(),
      });

      setTodos(prevTodos =>
        prevTodos.map(todo =>
          todo.id === editingTodoId
            ? { ...todo, title: editingTodoTitle.trim() }
            : todo,
        ),
      );
      setEditingTodoId(null);
    } catch {
      setError('Unable to update a todo');
    } finally {
      setLoadingTodos(prev => prev.filter(id => id !== editingTodoId));
    }
  };

  const handleToggleAllTodos = async () => {
    const allCompleted = todos.every(todo => todo.completed);
    const newStatus = !allCompleted;

    const togglingTodosIds = todos
      .filter(todo => todo.completed !== newStatus)
      .map(todo => todo.id);

    setLoadingTodos(prevLoadingTodos => [
      ...prevLoadingTodos,
      ...togglingTodosIds,
    ]);

    try {
      await Promise.all(
        todos.map(todo =>
          todo.completed !== newStatus
            ? updateTodo(todo.id, { ...todo, completed: newStatus })
            : Promise.resolve(),
        ),
      );
      setTodos(todos.map(todo => ({ ...todo, completed: newStatus })));
    } catch {
      setError('Unable to update todos');
    } finally {
      setLoadingTodos(prevLoadingTodos =>
        prevLoadingTodos.filter(id => !togglingTodosIds.includes(id)),
      );
    }
  };

  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    const completedTodoIds = completedTodos.map(todo => todo.id);

    setLoadingTodos(prevLoadingTodos => [
      ...prevLoadingTodos,
      ...completedTodoIds,
    ]);

    try {
      await Promise.all(
        completedTodos.map(todo =>
          deleteTodo(todo.id).catch(() => setError('Unable to delete a todo')),
        ),
      );
      setTodos(todos.filter(todo => !todo.completed));
    } catch {
      setError('Unable to delete completed todos');
    } finally {
      setLoadingTodos(prevLoadingTodos =>
        prevLoadingTodos.filter(id => !completedTodoIds.includes(id)),
      );
    }
  };

  const allCompleted = todos.length > 0 && todos.every(todo => todo.completed);

  const handleCancelEdit = () => {
    setEditingTodoId(null);
  };

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
              onAddTodo={handleAddTodo}
              onNewTodoChange={setNewTodo}
              onToggleAllTodos={handleToggleAllTodos}
              allCompleted={allCompleted}
              isAddingTodo={isAddingTodo}
            />

            <TodoList
              todos={todos}
              filter={filter}
              editingTodoId={editingTodoId}
              editingTodoTitle={editingTodoTitle}
              loadingTodos={loadingTodos}
              tempTodoId={tempTodoId}
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
