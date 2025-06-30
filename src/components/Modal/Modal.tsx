interface ModalProps {
  active: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ active, onClose, children }) => {
  if (!active) {
    return null;
  }

  return (
    <div
      className={`modal overlay ${active ? 'is-active' : ''}`}
      onClick={onClose}
    >
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {children}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};
