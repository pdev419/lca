"use client";

import clsx from "clsx";
import { NextPage } from "next";
import {
  useEffect,
  useState,
  useRef,
  RefCallback,
  useLayoutEffect,
} from "react";
import React from "react";

interface TabProps {
  value: string;
  isCurrent: boolean;
  onClick?: () => void;
}

const Tab = React.forwardRef<HTMLDivElement, TabProps>(
  ({ value, isCurrent = false, onClick = () => {} }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(
          "text-sm sm:text-base md:text-xl pb-2 cursor-pointer hover:text-blue-300 whitespace-nowrap transition-colors",
          isCurrent ? "text-blue-600" : "text-gray-600"
        )}
        onClick={onClick}
      >
        {value}
      </div>
    );
  }
);

Tab.displayName = "Tab";

interface TabViewProps {
  onChangeTab: (tab: string) => void;
}

const TabView: NextPage<TabViewProps> = ({ onChangeTab }) => {
  const [currentTab, setCurrentTab] = useState("");
  const tabValues: string[] = ["Materials", "Transport", "Energy", "Waste"];
  const tabsRef = useRef<HTMLDivElement[]>([]);
  const [indicatorStyle, setIndicatorStyle] = useState({
    left: 0,
    width: 0,
  });
  const isInitialMount = useRef(true);

  const setTabRef: RefCallback<HTMLDivElement> = (element) => {
    if (element) {
      const index = tabValues.findIndex(
        (value) => value === element.textContent
      );
      if (index !== -1) {
        tabsRef.current[index] = element;
      }
    }
  };

  useEffect(() => {
    setCurrentTab(tabValues[0]);
  }, []);

  useLayoutEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const currentIndex = tabValues.indexOf(currentTab);
    if (currentIndex >= 0 && tabsRef.current[currentIndex]) {
      const tab = tabsRef.current[currentIndex];
      if (tab) {
        const { offsetLeft, offsetWidth } = tab;
        setIndicatorStyle({
          left: offsetLeft,
          width: offsetWidth,
        });
      }
    }
  }, [currentTab]);

  return (
    <div className="w-full flex flex-row justify-between gap-1 sm:gap-2 border-b-1 border-gray-300 relative overflow-x-auto py-2">
      {tabValues.map((value: string) => (
        <Tab
          key={value}
          value={value}
          isCurrent={value === currentTab}
          onClick={() => {
            setCurrentTab(value);
            onChangeTab(value);
          }}
          ref={setTabRef}
        />
      ))}
      <div
        className="absolute bottom-0 h-[3px] bg-blue-600 transition-all duration-300 ease-in-out"
        style={{
          left: `${indicatorStyle.left}px`,
          width: `${indicatorStyle.width}px`,
        }}
      />
    </div>
  );
};

export default TabView;
