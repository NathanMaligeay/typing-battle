// components/Modal.tsx
import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  const buttonStyle: React.CSSProperties = {
    backgroundColor: 'transparent',
    color: 'yellow',
    fontFamily: 'silkscreen',
    border: 'none',
};

  return (
    <div className='modal'>
    <div onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()}>
        <button style={buttonStyle} onClick={onClose}>X</button>
        {children}
      </div>
    </div>
    </div>
  );
};

export default Modal;
