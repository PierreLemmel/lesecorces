import { DependencyList, RefObject, useEffect, useState } from "react";

export function useElementSize<T extends HTMLElement = HTMLElement>(ref: RefObject<T>, onSizeChanged: (size: { width: number, height: number }) => void) {

    useEffect(() => {
    
        const measureSize = () => {
            if (ref.current) {
                const size = {
                    width: ref.current.offsetWidth,
                    height: ref.current.offsetHeight
                }

                onSizeChanged(size);
            }
        };

        measureSize();
        window.addEventListener('resize', measureSize);

        return () => {
            window.removeEventListener('resize', measureSize);
        };
    }, []);

}

export const useWindowSize = () => {
    const [size, setSize] = useState<{ width: number, height: number }>({ width: 0, height: 0 });

    useEffect(() => {
        const measureSize = () => {
            if (window) {
                const size = {
                    width: window.innerWidth,
                    height: window.innerHeight
                }

                setSize(size);
            }
        };

        measureSize();
        window.addEventListener('resize', measureSize);

        return () => {
            window.removeEventListener('resize', measureSize);
        };
    }, [])

    return size;
}


export const useEffectAsync = (effect: () => Promise<void>, deps?: DependencyList): void => {
    deps ||= [];
    
    useEffect(() => {
        (async () => {
            await effect();
        })();
    }, deps); // eslint-disable-line react-hooks/exhaustive-deps
}