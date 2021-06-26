import { useEffect, useRef } from "preact/hooks";

export const useEventListener = <E extends keyof WindowEventMap>(
  eventName: E, handler: EventListener, element?: Document | Window | null
): void => {
  const cachedHandler = useRef<EventListener>();

  useEffect(() => {
    cachedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    if (!element?.addEventListener) return;
    const eventHandler = (e: Event) => cachedHandler.current(e);
    element.addEventListener(eventName, eventHandler);
    return () => { element.removeEventListener(eventName, eventHandler); }
  }, [eventName, element]);
};
