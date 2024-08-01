import React from 'react';
import ReactDOM from 'react-dom';
import { IoClose } from "react-icons/io5";
import './modal.css';

function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}><IoClose /></button>
        {children}
      </div>
    </div>,
    document.body
  );
}

export default Modal;
