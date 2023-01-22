/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext, useEffect, useState,
} from 'react';
import {
  getTodos, addTodo, deleteTodo, completeTodo, editTodo,
} from './api/todos';
import { AuthContext } from './components/Auth';
import {
  Footer,
  Header,
  TodosList,
  ErrorNotification,
} from './components';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import { ErrorType } from './types/ErrorType';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState<string>('');
  const [filter, setFilter] = useState(Filter.all);
  const [error, setError] = useState<ErrorType | null>(null);
  const [isHidden, setIsHidden] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedTodoIds, setSelectedTodoIds] = useState<number[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  const user = useContext(AuthContext);
  const completedTodos = todos.filter(todo => todo.completed);

  const handleError = (errorType: ErrorType) => {
    setError(errorType);
    setIsHidden(false);
    setTimeout(() => setIsHidden(true), 3000);
  };

  const handleAdd = () => {
    if (!user) {
      return;
    }

    if (!title.trim()) {
      handleError(ErrorType.empty);

      return;
    }

    setIsAdding(true);

    const todo = {
      title,
      userId: user.id,
      completed: false,
    };

    addTodo(todo)
      .then(result => setTodos(
        prevTodos => [...prevTodos, result],
      ))
      .catch(() => {
        handleError(ErrorType.add);
      })
      .finally(() => {
        setIsAdding(false);
        setTitle('');
      });
  };

  const handleDelete = (id: number) => {
    setSelectedTodoIds(prev => [...prev, id]);

    deleteTodo(id)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
      })
      .catch(() => {
        handleError(ErrorType.delete);
      })
      .finally(() => {
        setSelectedTodoIds([]);
      });
  };

  const handleStatusChange = (id: number, data: boolean) => {
    setSelectedTodoIds(prev => [...prev, id]);

    completeTodo(id, data)
      .then(() => setTodos(prevTodos => {
        const selectedTodo = prevTodos.find(todo => todo.id === id);

        if (selectedTodo) {
          selectedTodo.completed = data;
        }

        return prevTodos;
      }))
      .catch(() => {
        handleError(ErrorType.update);
      })
      .finally(() => {
        setSelectedTodoIds([]);
      });
  };

  const completeAll = () => {
    if (todos.every(todo => todo.completed)) {
      todos.forEach(todo => handleStatusChange(todo.id, false));
    } else {
      todos.forEach(todo => handleStatusChange(todo.id, true));
    }
  };

  const clearCompleted = () => {
    completedTodos.forEach(todo => handleDelete(todo.id));
  };

  const handleFilter = (arr: Todo[], filterType: string) => {
    switch (filterType) {
      case Filter.active:
        return arr.filter(element => !element.completed);

      case Filter.completed:
        return arr.filter(element => element.completed);

      default:
        return arr;
    }
  };

  const handleDoubleClick = (id: number) => {
    setIsEditing(true);
    setSelectedTodoIds([id]);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSelectedTodoIds([]);
  };

  const handleEditing = (id: number, data: string, oldData: string) => {
    setIsEditing(false);

    if (!data.trim()) {
      handleDelete(id);

      return;
    }

    if (oldData === data) {
      handleCancel();

      return;
    }

    editTodo(id, data)
      .then(() => setTodos(prevTodos => {
        const selectedTodo = prevTodos.find(todo => todo.id === id);

        if (selectedTodo) {
          selectedTodo.title = data;
        }

        return prevTodos;
      }))
      .catch(() => {
        handleError(ErrorType.update);
      })
      .finally(() => {
        setSelectedTodoIds(prev => prev.filter(todoId => todoId !== id));
      });
  };

  useEffect(() => {
    if (user) {
      getTodos(user.id)
        .then(setTodos)
        .catch(() => {
          handleError(ErrorType.load);
        });
    }
  }, []);

  const visibleTodos = handleFilter(todos, filter);
  const activeCount = todos.filter(todo => !todo.completed).length;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          title={title}
          setTitle={setTitle}
          handleAdd={handleAdd}
          setIsHidden={setIsHidden}
          isAdding={isAdding}
          completeAll={completeAll}
          completedTodosCount={completedTodos.length}
          todosCount={todos.length}
        />

        {(todos.length > 0 || isAdding) && (
          <>
            <TodosList
              todos={visibleTodos}
              title={title}
              isAdding={isAdding}
              handleDelete={handleDelete}
              handleStatusChange={handleStatusChange}
              handleEditing={handleEditing}
              selectedTodoIds={selectedTodoIds}
              isEditing={isEditing}
              handleDoubleClick={handleDoubleClick}
              handleCancel={handleCancel}
            />

            <Footer
              filter={filter}
              setFilter={setFilter}
              activeCount={activeCount}
              clearCompleted={clearCompleted}
              completedTodosCount={completedTodos.length}
            />
          </>
        )}
      </div>

      <ErrorNotification
        isHidden={isHidden}
        setIsHidden={setIsHidden}
        error={error}
      />
    </div>
  );
};
