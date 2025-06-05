const handleAddTodo = async (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key !== 'Enter') return;

  const title = newTitle.trim();

  if (!title) {
    setErrorMessage('Title should not be empty');
    return;
  }

  setIsAdding(true);
  setErrorMessage('');

  const newTodo = {
    id: 0,
    userId: USER_ID,
    title,
    completed: false,
  };

  setTempTodo(newTodo);

  try {
    const createdTodo = await addTodo({ userId: USER_ID, title, completed: false });
    setTodos(prev => [...prev, createdTodo]);
    setNewTitle('');
  } catch {
    setErrorMessage('Unable to add a todo');
  } finally {
    setTempTodo(null);
    setIsAdding(false);
  }
};

const [processingIds, setProcessingIds] = useState<number[]>([]);

const handleDeleteTodo = async (todoId: number) => {
  setErrorMessage('');
  setProcessingIds(prev => [...prev, todoId]);

  try {
    await deleteTodo(todoId);
    setTodos(prev => prev.filter(todo => todo.id !== todoId));
  } catch {
    setErrorMessage('Unable to delete a todo');
  } finally {
    setProcessingIds(prev => prev.filter(id => id !== todoId));
  }
};

const handleClearCompleted = async () => {
  const completedTodos = todos.filter(todo => todo.completed);
  const ids = completedTodos.map(todo => todo.id);

  setErrorMessage('');
  setProcessingIds(prev => [...prev, ...ids]);

  await Promise.allSettled(
    completedTodos.map(todo =>
      deleteTodo(todo.id)
        .then(() => {
          setTodos(prev => prev.filter(t => t.id !== todo.id));
        })
        .catch(() => {
          setErrorMessage('Unable to delete a todo');
        })
    )
  );

  setProcessingIds(prev => prev.filter(id => !ids.includes(id)));
};

<button
  className="clear-completed"
  onClick={handleClearCompleted}
  disabled={!todos.some(todo => todo.completed)}
>
  Clear completed
</button>

<ul className="todo-list">
  {visibleTodos.map(todo => (
    <TodoItem
      key={todo.id}
      todo={todo}
      isProcessed={processingIds.includes(todo.id)}
      onDelete={() => handleDeleteTodo(todo.id)}
    />
  ))}

  {tempTodo && (
    <TodoItem
      todo={tempTodo}
      isProcessed
    />
  )}
</ul>

{errorMessage && (
  <div className="notification">
    {errorMessage}
    <button className="delete" onClick={() => setErrorMessage('')} />
  </div>
)}
