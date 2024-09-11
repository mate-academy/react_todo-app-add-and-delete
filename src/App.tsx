import React, { useEffect, useMemo, useState } from 'react';
import * as todoService from './api/todos';
import { Todo } from './types/Todo';
import { FilterValues } from './types/FilterValues';
import { TodoList } from './Components/TodoList';
import { Header } from './Components/Header';
import { Footer } from './Components/Footer';
import { ErrorNotification } from './Components/ErrorNotification';

function applyFIlter(filter: FilterValues, todos: Todo[]) {
  return todos.filter(todo => {
    switch (filter) {
      case FilterValues.Active:
        return !todo.completed;
      case FilterValues.Completed:
        return todo.completed;
      default:
        return true;
    }
  });
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [processingTodosId, setProcessingTodosId] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState(FilterValues.All);
  const filteredTodos = useMemo(
    () => applyFIlter(filter, todos),
    [filter, todos],
  );

  const applyErrorForSomeTime = (errorText: string, delayToRemove = 3000) => {
    setErrorMessage(errorText);

    setTimeout(() => setErrorMessage(''), delayToRemove);
  };

  useEffect(() => {
    todoService
      .getTodos()
      .then(setTodos)
      .catch(() => applyErrorForSomeTime('Unable to load todos'));
  }, []);

  const addTodo = async ({ id, title, userId, completed }: Todo) => {
    try {
      if (title.length === 0) {
        throw new Error();
      }

      setTempTodo({ id, title, userId, completed });

      const returnedTodo = await todoService.postTodo({
        title,
        userId,
        completed,
      });

      setTodos(currentTodos => [...currentTodos, returnedTodo]);
    } catch (error) {
      if (title.length === 0) {
        applyErrorForSomeTime('Title should not be empty');
      } else {
        applyErrorForSomeTime('Unable to add a todo');
      }

      throw error;
    } finally {
      setTempTodo(null);
    }
  };

  const updateTodo = (todoToUpdate: Todo) => {
    return todoService
      .updateTodo(todoToUpdate)
      .then(() =>
        setTodos(currentTodos => {
          return currentTodos.map(todo =>
            todo.id === todoToUpdate.id ? todoToUpdate : todo,
          );
        }),
      )
      .catch(error => {
        applyErrorForSomeTime('Unable to update a todo');
        throw error;
      });
  };

  const deleteTodo = (todoId: number) => {
    setProcessingTodosId(currIds => [...currIds, todoId]);

    return todoService
      .deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(error => {
        applyErrorForSomeTime('Unable to delete a todo');
        throw error;
      })
      .finally(() => {
        setProcessingTodosId(currIds => currIds.filter(id => id !== todoId));
      });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          onAddTodo={addTodo}
          onUpdateTodosCompleted={updateTodo}
        />

        <TodoList
          todos={filteredTodos}
          processings={processingTodosId}
          tempTodo={tempTodo}
          onDeleteTodo={deleteTodo}
        />

        {todos.length > 0 && (
          <Footer
            todos={todos}
            currentFilter={filter}
            onChangeFilter={setFilter}
            onDelete={deleteTodo}
          />
        )}
      </div>

      <ErrorNotification errorMessage={errorMessage} />
    </div>
  );
};
