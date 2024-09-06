import { useState, useCallback, useEffect } from "react";

export const useHealth = () => {
    const [health, setHealth] = useState<number>(100);

    const takeDamage = useCallback(() => setHealth((prev) => prev -1),[]);
    const resetHealth = useCallback(() => setHealth(100),[]);

    return {health, takeDamage, resetHealth}
}