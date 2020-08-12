import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import styles from './modal.module.css';
import Widget from '../Widget';


export const Modal = ({ children, isOpen, onClose }) => {
  function handleBlackAreaClick(event) {
    const isModalTag = event.target.classList.contains(styles.modal);
    if(isModalTag && onClose) {
      onClose()
    }
  }
  //console.log(isOpen);
  return (
    <div
      onClick={handleBlackAreaClick}
      className={classNames(styles.modal, {
        [styles.modalActive]: isOpen
      })}
    >
      <div>
  <Widget>{isOpen && children()}</Widget>
      </div>
    </div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.func.isRequired
};