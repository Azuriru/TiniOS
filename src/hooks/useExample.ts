import { useMemo, useState } from "react";

export default function useExample() {
    const [example, setExample] = useState(1);

    const useSubHook = (userInput: any) => {
        const memoized = useMemo(() => {
            return {
                userInput,
                example
            };
        }, [userInput, example]);

        return memoized;
    };

    return useSubHook;
}
