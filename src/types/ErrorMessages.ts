export const ErrorMessages = {
  Load: 'Unable to load todos', //..  не вдалося завантажити завдання
  Title: 'Title should not be empty', // ..Заголовок не може бути порожнім
  Add: 'Unable to add a todo', //..  Не вдалося додати завдання
  Delete: 'Unable to delete a todo', //.. Не вдалося видалити завдання
  Update: 'Unable to update a todo', //..  Не вдалося оновити завдання
};

export type FilterBy = 'all' | 'active' | 'completed';
