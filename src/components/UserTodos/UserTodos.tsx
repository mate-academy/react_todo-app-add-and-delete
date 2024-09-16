import { useEffect, useState } from 'react';
import { Todo } from '../../types/Todo';
import { getTodos } from '../../api/todos';
import * as todoService from '../../api/todos';
import { TodoList } from '../TodoList/TodoList';
import { TodoForm } from '../TodoForm/TodoForm';
import { TodoFooter } from '../TodoFooter/TodoFooter';

type FilterType = 'All' | 'Active' | 'Completed';

type Props = {
  userId: number;
  onError: (errorMessage: string) => void;
};

export const UserTodos: React.FC<Props> = ({ userId, onError }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todoTitle, setTodoTitle] = useState('');
  const [filterTodos, setFilterTodos] = useState<FilterType>('All');
  const [creating, setCreating] = useState(false);
  const [processings, setProcessings] = useState<number[]>([]);
  const resetTitle = () => setTodoTitle('');

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => onError('Unable to load todos'));
  }, [onError]);

  const handleAddTodo = (newTodo: Todo) => {
    setCreating(true);

    if (newTodo.title.trim().length === 0) {
      onError('Title should not be empty');
      setCreating(false);
      resetTitle();

      return Promise.resolve();
    }

    return todoService
      .createTodo({
        userId,
        title: newTodo.title.trim(),
        completed: newTodo.completed,
      })
      .then(todo => {
        setTodos([...todos, todo]);
        resetTitle();
      })
      .catch(() => onError('Unable to add a todo'))
      .finally(() => setCreating(false));
  };

  const handleUpdateTodo = (updatedTodo: Todo) => {
    return todoService
      .updateTodo(updatedTodo)
      .then(() => {
        const updatedTodos = todos.map(todo =>
          todo.id === updatedTodo.id ? updatedTodo : todo,
        );

        setTodos(updatedTodos);
      })
      .catch(() => onError('Unable to update a todo'));
  };

  const handleDeleteTodo = (todoId: number) => {
    return todoService
      .deleteTodo(todoId)
      .then(() =>
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        ),
      )
      .catch(() => onError('Unable to delete a todo'));
  };

  const handleClearCompleted = () => {
    const completedTodoIds = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    setProcessings(completedTodoIds);

    Promise.all(
      completedTodoIds.map(todoId => handleDeleteTodo(todoId)),
    ).finally(() => setProcessings([]));
  };

  const handleToggleAllTodos = () => {
    setProcessings(todos.map(todo => todo.id));
    const isAllCompleted = todos.every(todo => todo.completed);
    const updatedTodos = todos.map(todo => ({
      ...todo,
      completed: !isAllCompleted,
    }));

    Promise.all(updatedTodos.map(todo => todoService.updateTodo(todo)))
      .then(() => setTodos(updatedTodos))
      .catch(() => onError('Unable to toggle all todos'))
      .finally(() => setProcessings([]));
  };

  const filteredTodos = todos.filter(todo => {
    switch (filterTodos) {
      case 'All':
        return true;
      case 'Active':
        return !todo.completed;
      case 'Completed':
        return todo.completed;
      default:
        return false;
    }
  });

  const isNoCompletedTodos = filteredTodos.every(todo => !todo.completed);
  const activeTodosCount = todos.filter(todo => !todo.completed).length;

  return (
    <div className="todoapp__content">
      <TodoForm
        onAdd={handleAddTodo}
        todoTitle={todoTitle}
        setTodoTitle={setTodoTitle}
        onToggleAllTodos={handleToggleAllTodos}
        isCompletedTodos={!isNoCompletedTodos}
      />
      <TodoList
        todos={filteredTodos}
        creating={creating}
        processings={processings}
        todoTitle={todoTitle}
        onDelete={handleDeleteTodo}
        onUpdate={handleUpdateTodo}
      />
      {todos.length !== 0 && (
        <TodoFooter
          activeTodosCount={activeTodosCount}
          isNoCompletedTodos={isNoCompletedTodos}
          onClearCompleted={handleClearCompleted}
          selectedFilter={filterTodos}
          onFilterChange={setFilterTodos}
        />
      )}
    </div>
  );
};
