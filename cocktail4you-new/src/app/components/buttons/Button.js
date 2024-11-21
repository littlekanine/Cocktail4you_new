import React from 'react';
import './buttons.scss';

const Button = ({ text, icon, onClick, className = '' }) => {
	return (
		<div>
			<button className={`button ${className}`} onClick={onClick}>
				{icon && <span className="button-icon">{icon}</span>}
				{text && <span className="button-text">{text}</span>}
			</button>
		</div>
	);
};

export default Button;
