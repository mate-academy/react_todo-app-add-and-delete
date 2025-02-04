import React, { useEffect, useRef, useState } from 'react';
import { getTodos, addTodo, deleteTodoById, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import { Filter } from './types/Filter';
import { applyFilterToTodos } from './utils/filterHelper';
import { TodoHeader } from './components/TodoHeader';
import { TodoFooter } from './components/TodoFooter';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const [todoItems, setTodoItems] = useState<Todo[]>([]);
  const [alertMessage, setAlertMessage] = useState('');
  const [currentFilter, setCurrentFilter] = useState(Filter.All);
  const [loadingState, setLoadingState] = useState(false);
  const inputElement = useRef<HTMLInputElement | null>(null);
  const [temporaryTodo, setTemporaryTodo] = useState<Todo | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [deletingIds, setDeletingIds] = useState<number[]>([]);

  const remainingTasks = todoItems.filter(task => !task.completed).length;
  const doneTasks = todoItems.filter(task => task.completed);
  const visibleTodos = applyFilterToTodos(todoItems, currentFilter);

  const showAlert = (message: string) => {
    setAlertMessage(message);
    setTimeout(() => setAlertMessage(''), 3000);
  };

  const fetchTaskList = () => {
    getTodos()
      .then(setTodoItems)
      .catch(() => showAlert('Unable to load todos'));
  };

  useEffect(fetchTaskList, []);

  const addNewTask = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const title = newTaskTitle.trim();

    if (!title) {
      showAlert('Title should not be empty');

      return;
    }

    setLoadingState(true);
    setTemporaryTodo({ id: 0, title, userId: USER_ID, completed: false });

    addTodo(title)
      .then(newTask => {
        setTodoItems(prev => [...prev, newTask]);
        setNewTaskTitle('');
      })
      .catch(() => showAlert('Unable to add a todo'))
      .finally(() => {
        setTemporaryTodo(null);
        setLoadingState(false);
      });
  };

  const deleteTask = (taskIds: number[]) => {
    if (!taskIds.length) {
      return;
    }

    setDeletingIds(taskIds);

    taskIds.forEach(taskId => {
      deleteTodoById(taskId)
        .then(() => {
          setTodoItems(prev => prev.filter(task => task.id !== taskId));
        })
        .catch(() => showAlert('Unable to delete a todo'))
        .finally(() => setDeletingIds([]));
    });
  };

  const removeCompletedTasks = () => {
    const completedTaskIds = doneTasks.map(task => task.id);

    deleteTask(completedTaskIds);
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          todos={todoItems}
          newTaskTitle={newTaskTitle}
          setNewTaskTitle={setNewTaskTitle}
          addTask={addNewTask}
          isLoading={loadingState}
          inputRef={inputElement}
          idsLoading={deletingIds}
        />

        <TodoList
          todos={visibleTodos}
          deleteTask={deleteTask}
          temporaryTodo={temporaryTodo}
          isLoading={loadingState}
          pendingIds={deletingIds}
        />

        {todoItems.length > 0 && (
          <TodoFooter
            currentFilter={currentFilter}
            setFilter={setCurrentFilter}
            remainingTasks={remainingTasks}
            hasCompletedTasks={doneTasks.length > 0}
            clearCompletedTasks={removeCompletedTasks}
          />
        )}
      </div>

      <ErrorNotification message={alertMessage} clearMessage={showAlert} />
    </div>
  );
};
