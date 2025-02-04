"use client";

import React from 'react';
import { mergeClasses } from '../../lib/utils';

export const OffresPedagogiqueBlock = () => {

    return <div className={mergeClasses(
        "flex flex-col items-stretch px-2",
        "mb-8"
    )}>
        <div className="heading-1 text-center">Nos offres pédagogiques</div>
        NOS OFFRES PEDAGOGIQUES
    </div>;
}


interface CourseSectionProps {
	title: string;
	description: string;
	activeTab: string;
	tabs: string[];
	onTabClick: (tab: string) => void;
}

const CourseSection: React.FC<CourseSectionProps> = ({
	title,
	description,
	activeTab,
	tabs,
	onTabClick,
}) => {
	return (
		<div className="p-6 text-white">
			{/* Tabs */}
			<nav className="flex space-x-4 border-b border-orange-500 pb-2">
				{tabs.map((tab) => (
					<button
						key={tab}
						onClick={() => onTabClick(tab)}
						className={`text-lg font-semibold ${
							tab === activeTab
								? 'text-orange-500 border-b-2 border-orange-500'
								: 'text-gray-400 hover:text-orange-400'
						}`}
					>
						{tab}
					</button>
				))}
			</nav>

			{/* Content */}
			<div className="mt-4">
				<div className="flex items-center space-x-2">
					{/* <FaExpand className="text-orange-500 text-xl" /> */}
					<h2 className="text-xl font-bold text-orange-500">{title}</h2>
				</div>
				<p className="mt-2 text-gray-300 text-lg max-w-lg">{description}</p>
			</div>
		</div>
	);
};

export default CourseSection;
