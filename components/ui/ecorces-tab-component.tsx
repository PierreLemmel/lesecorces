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
    tabPosition?: "Top" | "Right";
}

const EcorcesTabComponent = (props: TabComponentProps) => {
    const {
        tabs,
        className,
        tabPosition = "Top"
    } = props;

    const [activeTab, setActiveTab] = useState(0);

    const isTop = tabPosition === "Top";

	return <div className={mergeClasses(
        "grid",
        isTop ? "grid-rows-[repeat(auto,2)] grid-cols-1" : "grid-cols-[5fr_2fr]",
        "gap-3",
        className
    )}>
        <div className={mergeClasses(
            "flex",
            isTop ? "justify-evenly" : "justify-start",
            isTop ? "flex-row" : "flex-col",
            isTop ? "row-start-1" : "col-start-2"
        )}>
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


        {tabs.map((tab, index) => {

            const isCurrentTab = activeTab === index;

            return <div
                key={index}
                className={mergeClasses(
                    "flex flex-col",
                    "py-3 gap-2",
                    isTop ? "row-start-2 col-start-1" : "col-start-1 row-start-1",
                    isCurrentTab ? "visible" : "invisible"
                )}
            >
                <div className="flex flex-row gap-6 items-center">
                    <EcorcesIcon icon={faPuzzlePiece} />
                    <div className="text-lg font-semibold">
                        {tab.title}
                    </div>
                </div>
                <div className="text-white">
                    {tab.content}
                </div>
            </div>
            })}
                
        {/* <div className={mergeClasses(
            "flex flex-col",
            "py-3 gap-2",
            isTop ? "row-start-2" : "col-start-1 row-start-1"
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
        </div> */}
    </div>
};

export default EcorcesTabComponent;