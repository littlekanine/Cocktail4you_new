import React from 'react';

import './slideButton.scss';
import { useLanguage } from '@/app/context/LanguageContext';

const SlideButton = () => {
	const { isFrench, toggleLanguage } = useLanguage();
	return (
		<div>
			<label className="switch">
				<input type="checkbox" checked={!isFrench} onChange={toggleLanguage}></input>
				<span className="slider round"></span>
			</label>
		</div>
	);
};

export default SlideButton;
