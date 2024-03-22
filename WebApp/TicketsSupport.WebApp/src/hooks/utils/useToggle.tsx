import { useState } from "react";

export default function useToggle() {
    const [toggleState, setToggleState] = useState<boolean | null>(null);

    const toggle = () => {
        if (!toggleState)
            setToggleState(true);
        else
            setToggleState(false);
    }

    return { toggleState, toggle }
}