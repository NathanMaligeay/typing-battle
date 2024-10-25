import { useState, useEffect } from 'react';

export interface Meteor {
  id: string;
}

export const useMeteors = () => {
  const [meteors, setMeteors] = useState<Meteor[]>([]);

  useEffect(() => {
    const addMeteor = () => {
      if (Math.random() < 0.1) {
        setMeteors(prevMeteors => [
          ...prevMeteors,
          { id: Math.random().toString(36).substr(2, 9) }
        ]);
      }
    };

    const interval = setInterval(addMeteor, 2500);
    return () => clearInterval(interval);
  }, []);

  const removeMeteor = (id: string) => {
    setMeteors(prevMeteors => prevMeteors.filter(meteor => meteor.id !== id));
  };

  return { meteors, removeMeteor };
};