import { useState, useCallback } from "react";

export const useHealth = () => {
    const [health, setHealth] = useState<number>(1);

    const takeDamage = useCallback(() => setHealth((prev) => prev - 1), []);
    const resetHealth = useCallback(() => setHealth(1), []);

    return { health, takeDamage, resetHealth }
}