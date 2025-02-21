import React, {createContext, useEffect, useRef} from "react";
import "./styles.sass";

export const DialogContext = createContext({});

export const DialogProvider = (props) => {
    const areaRef = useRef();
    const ref = useRef();

    const close = (force = false) => {
        if (props.disableClosing && !force) return;
        areaRef.current?.classList.add("dialog-area-hidden");
        ref.current?.classList.add("dialog-hidden");
    }

    const onClose = (e) => {
        if (e.animationName === "fadeOut") {
            hideTooltips(false);
            props?.close();
        }
    }

    const handleKeyDown = (e) => {
        if (e.code === "Enter" && props.submit) props.submit();
    }

    const hideTooltips = (state) => Array.from(document.getElementsByClassName("tooltip")).forEach(element => {
        if (state && !element.classList.contains("tooltip-invisible"))
            element.classList.add("tooltip-invisible");
        if (!state && element.classList.contains("tooltip-invisible"))
            element.classList.remove("tooltip-invisible");
    });

    useEffect(() => {
        const handleClick = (event) => {
            if (!ref.current?.contains(event.target)) close();
        }

        document.addEventListener("mousedown", handleClick);

        return () => document.removeEventListener("mousedown", handleClick);
    }, [ref]);

    return (
        <DialogContext.Provider value={close}>
            <div className="dialog-area" ref={areaRef}>
                <div className={"dialog" + (props.customClass ? " " + props.customClass : "")} ref={ref}
                     onAnimationEnd={onClose} onKeyDown={handleKeyDown} onAnimationStart={() => hideTooltips(true)}>
                    {props.children}
                </div>
            </div>
        </DialogContext.Provider>
    )
}