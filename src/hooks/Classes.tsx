import { useState } from "react";

const useClasses = (initClasses: string[] = []) => {
  const [classes, setClasses] = useState<string[]>(initClasses);

  const addClass = (newClass: string) => {
    if (newClass && !classes.includes(newClass)) {
      setClasses([...classes, newClass]);
    }
  };

  const removeClass = (classToRemove: string) => {
    if (classToRemove && classes.includes(classToRemove)) {
      setClasses(classes.filter((c) => c !== classToRemove));
    }
  };

  const getClasses = () => classes.join(" ");

  return { addClass, removeClass, getClasses };
};

export default useClasses;
