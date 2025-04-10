import { useState } from 'react';
import { Todo } from '../types/Todo';
import { USER_ID } from '../api/todos';
import { client } from '../utils/fetchClient';
import { Errors } from '../types/Errors';
import { FilterBy } from '../types/FilterBy';
import { getTodos } from '../api/todos';
import { useEffect } from 'react';

export const TodoManager = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState(Errors.DEFAULT);
  const [filterBy, setFilterBy] = useState(FilterBy.All);
  const [loading, setLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isDeleting, setIsDeleting] = useState<number | null>(null); // Track the ID of the todo being deleted
  const [isClearingCompleted, setIsClearingCompleted] = useState(false);
  const [isToggling, setIsToggling] = useState<number | null>(null);
  const onClearError = () => {
    setErrorMessage(Errors.DEFAULT);
  };

  const filter = (todosList: Todo[], activeFilter: FilterBy) => {
    switch (activeFilter) {
      case FilterBy.Active:
        return todosList.filter(todo => !todo.completed);
      case FilterBy.Completed:
        return todosList.filter(todo => todo.completed);
      case FilterBy.All:
      default:
        return todosList;
    }
  };

  useEffect(() => {
    setLoading(true); // Start loading
    getTodos()
      .then(todosFromServer => {
        setTodos(todosFromServer);
      })
      .catch(() => {
        setErrorMessage(Errors.LOAD);
      })
      .finally(() => {
        setLoading(false); // Stop loading
      });
  }, []);

  const handleAddTodo = async (title: string) => {
    setIsAdding(true);

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setErrorMessage(Errors.EMPTY);
      setIsAdding(false);

      return;
    }

    const newTempTodo: Todo = {
      id: 0,
      title: trimmedTitle,
      completed: false,
      userId: USER_ID, // Replace with your userId
    };

    setTempTodo(newTempTodo);

    try {
      const newTodo = await client.post<Todo>('/todos', {
        title: trimmedTitle,
        completed: false,
        userId: USER_ID,
      });

      setTodos(prev => [...prev, newTodo]);
      setNewTodoTitle('');
    } catch (err) {
      setErrorMessage(Errors.ADD);
      setTempTodo(null);
    } finally {
      setTempTodo(null);
      setIsAdding(false);
    }
  };

  const todosToDisplay = tempTodo ? [tempTodo, ...todos] : todos;

  const handleDeleteTodo = async (todoId: number) => {
    setIsDeleting(todoId);

    try {
      await client.delete(`/todos/${todoId}`);
      setTodos(prev => prev.filter(todo => todo.id !== todoId));
    } catch (err) {
      setErrorMessage(Errors.DELETE);
    } finally {
      setIsDeleting(null);
    }
  };

  const handleClearCompleted = async () => {
    setIsClearingCompleted(true);
    const completedTodos = todos.filter(todo => todo.completed);

    try {
      await Promise.all(
        completedTodos.map(todo => client.delete(`/todos/${todo.id}`)),
      );
      setTodos(prev => prev.filter(todo => !todo.completed));
    } catch (err) {
      setErrorMessage(Errors.DELETE_ID);
    } finally {
      setIsClearingCompleted(false);
    }
  };

  const handleToggleAllTodos = async () => {
    const allCompleted = todos.every(todo => todo.completed);

    try {
      // Optimistically update the UI
      setTodos(prev =>
        prev.map(todo => ({ ...todo, completed: !allCompleted })),
      );

      // Send PATCH requests to update the todos on the server
      await Promise.all(
        todos.map(todo =>
          client.patch<Todo>(`/todos/${todo.id}`, { completed: !allCompleted }),
        ),
      );
    } catch (err) {
      setErrorMessage(Errors.TOGGLE_ALL);
      // Revert UI state if the request fails
      setTodos(prev =>
        prev.map(todo => ({
          ...todo,
          completed: todos.find(t => t.id === todo.id)?.completed ?? false,
        })),
      );
    }
  };

  const onToggleTodo = async (todoId: number) => {
    const todoToToggle = todos.find(todo => todo.id === todoId);

    if (!todoToToggle) {
      return;
    }

    setTodos(prev =>
      prev.map(todo =>
        todo.id === todoId ? { ...todo, completed: !todo.completed } : todo,
      ),
    );

    setIsToggling(todoId);

    try {
      await client.patch(`/todos/${todoId}`, {
        completed: !todoToToggle.completed,
      });
    } catch (error) {
      setErrorMessage(Errors.TOGGLE);
    } finally {
      setIsToggling(null);
    }
  };

  const filteredTodos = filter(todos, filterBy);

  useEffect(() => {
    if (errorMessage !== Errors.DEFAULT) {
      const timer = setTimeout(() => setErrorMessage(Errors.DEFAULT), 3000);

      return () => clearTimeout(timer);
    }

    return undefined;
  }, [errorMessage]);

  return {
    filterBy,
    setFilterBy,
    todos,
    tempTodo,
    setTempTodo,
    loading,
    todosToDisplay,
    filteredTodos,
    setTodos,
    errorMessage,
    setErrorMessage,
    isAdding,
    handleAddTodo,
    isDeleting,
    setIsDeleting,
    handleToggleAllTodos,
    onToggleTodo,
    isToggling,
    setIsToggling,
    handleClearCompleted,
    isClearingCompleted,
    setIsClearingCompleted,
    handleDeleteTodo,
    newTodoTitle,
    setNewTodoTitle,
    onClearError,
  };
};
