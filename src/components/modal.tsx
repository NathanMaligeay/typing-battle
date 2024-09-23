// components/Modal.tsx
import React from 'react';
import "../styles/main.css";


interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  const customStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    width: 'fit-content',
    alignItems : 'flex-end',
};

  return (
    <div className='modal'>
    <div onClick={onClose}>
      <div style={customStyle} onClick={(e) => e.stopPropagation()}>
        <button className='xButton' onClick={onClose}>X</button>
        {children}
      </div>
    </div>
    </div>
  );
};

export default Modal;
