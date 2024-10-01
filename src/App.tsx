/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { Todo } from './types/Todo';
import { createTodos, deleteTodo, getTodos, updateTodo } from './api/todos';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { Error } from './components/Error';


const USER_ID = 0;

export enum StatusTodos {
  ALL = 'all',
  ACTIVE = 'active',
  COMPLETED = 'completed',
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<StatusTodos>(StatusTodos.ALL);
  const [deletingTodoId, setDeletingTodoId] = useState<number | null>(null);
  const [isAddingTodo, setIsAddingTodo] = useState<boolean>(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);


  useEffect(() => {
    getTodos(USER_ID)
      .then(fetchedTodos => setTodos(fetchedTodos))
      .catch(() => setError('Unable to load todos'));
  }, []);

  const handleAddTodo = async (title: string, completed: boolean): Promise<Todo | undefined> => {
    const trimmedTitle = title.trim()

    const newTodo: Omit<Todo, 'id'> = { title: trimmedTitle, userId: USER_ID, completed };



    const tempTodoItem: Todo = { id: Date.now(), ...newTodo };
    setTempTodo(tempTodoItem);
    setIsAddingTodo(true);
    setError(null);

    try {
      if (trimmedTitle === '') {
        setError('Title should not be empty');
      }

      const createdTodo = await createTodos(newTodo);

      setTodos(prevTodos => [...prevTodos, createdTodo]);
      setTempTodo(null);

      return createdTodo
    } catch (error) {
      setTempTodo(null);
      setError('Unable to add a todo');
    } finally {
      setIsAddingTodo(false);
    }
  };

  const handleUpdateTodoStatus = async (id: number, completed: boolean) => {
    const todoToUpdate = todos.find(todo => todo.id === id);
    if (!todoToUpdate) {
      setError('Todo not found');
      return;
    }

    try {
      const updatedTodo = await updateTodo({ ...todoToUpdate, completed });
      setTodos(currentTodos =>
        currentTodos.map(todo => (todo.id === updatedTodo.id ? updatedTodo : todo)),
      );
    } catch (e) {
      setError('Unable to update a todo');
    }
  };


  const handleDeleteTodo = async (todoId: number) => {
    setDeletingTodoId(todoId);
    setIsAddingTodo(true);
    try {
      await deleteTodo(todoId);

      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
    } catch (e) {
      setError('Unable to delete a todo');
    } finally {
      setDeletingTodoId(null);
      setIsAddingTodo(false);
    }
  };

  const handleStatusChange = (newStatus: StatusTodos) => setStatus(newStatus);

  const filteredTodos = todos.filter(todo => {
    if (status === StatusTodos.ACTIVE) return !todo.completed;
    if (status === StatusTodos.COMPLETED) return todo.completed;
    return true;
  });

  const counterOfActiveTodos = todos.filter(todo => !todo.completed).length;

  const handleClearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.forEach(todo => {
      handleDeleteTodo(todo.id);
    });
  };

  return (
      <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header onAddTodo={handleAddTodo} />
        <TodoList todos={filteredTodos}
          onUpdateStatus={handleUpdateTodoStatus}
          onDeleteTodo={handleDeleteTodo}
          deletingTodoId={deletingTodoId}
          isAddingTodo={isAddingTodo}
          tempTodo={tempTodo}
        />
        {todos.length > 0 && (
          <Footer
            status={status}
            onChangeStatus={handleStatusChange}
            counterOfActiveTodos={counterOfActiveTodos}
            todos={todos}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>
      <Error error={error} onClose={() => {
        console.log('before close notification')
        setError(null)}}/>
    </div>
  );
};
