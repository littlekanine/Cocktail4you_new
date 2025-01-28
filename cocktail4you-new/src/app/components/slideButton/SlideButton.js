import React from 'react';

import './slideButton.scss';
import { useLanguage } from '@/app/context/LanguageContext';

const SlideButton = () => {
	const { isFrench, toggleLanguage } = useLanguage();
	return (
		<div>
			<label class="switch">
				<input type="checkbox" checked={!isFrench} onChange={toggleLanguage}></input>
				<span class="slider round"></span>
			</label>
		</div>
	);
};

export default SlideButton;
