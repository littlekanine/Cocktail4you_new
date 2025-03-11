import React from 'react';
import './buttons.scss';
import { motion } from 'framer-motion';

const Button = ({ text, icon, onClick, className = '' }) => {
	return (
		<motion.div whileHover = {{scale : 1.1}}>
			<button className={`button ${className}`} onClick={onClick}>
				{icon && <span className="button-icon">{icon}</span>}
				{text && <span className="button-text">{text}</span>}
			</button>
		</motion.div>
	);
};

export default Button;
