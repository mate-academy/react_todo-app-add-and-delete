export type OptionsError = 'load' | 'add' | 'delete' | 'update' | 'empty';

export const ERROR_MESSAGES: Record<OptionsError, string> = {
  load: 'Unable to load todos',
  add: 'Unable to add a todo',
  delete: 'Unable to delete a todo',
  update: 'Unable to update a todo',
  empty: 'Title should not be empty',
};

export interface ErrorNotificationsProps {
  isVisible: boolean;
  message: string | null;
  onClose: () => void;
}
