"use client";

import React, { useState } from 'react';
import { mergeClasses } from '../../lib/utils';
import { faPuzzlePiece } from '@fortawesome/free-solid-svg-icons/faPuzzlePiece';
import { EcorcesIcon } from './icon';

export type TabContent = {
    title: string;
    content: string;
}

export type TabComponentProps = {
	tabs: TabContent[];
    className?: string;
}

const EcorcesTabComponent = (props: TabComponentProps) => {
    const {
        tabs,
        className
    } = props;

    const [activeTab, setActiveTab] = useState(0);
    const currentTab = tabs[activeTab];

	return <div className={mergeClasses(
        "flex flex-col items-stretch gap-3",
        className
    )}>
        <div className="flex flex-row justify-evenly">
            {tabs.map((tab, index) => {

                const isCurrentTab = activeTab === index;

                return <div
                    key={index}
                    className={mergeClasses(
                        "cursor-pointer text-golden2",
                        "px-1 py-2",
                        isCurrentTab && "bg-white/20"
                    )}
                    onClick={() => setActiveTab(index)}
                >
                    {tab.title}
                </div>
            })}
        </div>
        <div className={mergeClasses(
            "flex flex-col",
            "px-4 py-3 gap-2"
        )}>
            <div className="flex flex-row gap-6 items-center">
                <EcorcesIcon icon={faPuzzlePiece} />
                <div className="text-lg font-semibold">
                    {currentTab.title}
                </div>
            </div>
            <div className="text-white">
                {currentTab.content}
            </div>
        </div>
    </div>
};

export default EcorcesTabComponent;