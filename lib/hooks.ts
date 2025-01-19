import { DependencyList, RefObject, useEffect } from "react";

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

export const useEffectAsync = (effect: () => Promise<void>, deps?: DependencyList): void => {
    deps ||= [];
    
    useEffect(() => {
        (async () => {
            await effect();
        })();
    }, deps); // eslint-disable-line react-hooks/exhaustive-deps
}