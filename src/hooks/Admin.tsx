import { useState, useCallback } from "react";
import { getFirestore, doc, addDoc, collection, updateDoc } from "firebase/firestore";
import { message } from "antd";
import type { AlcoholType, MixerType, GarnishType, CocktailType } from "./Order";

const useAdmin = () => {
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const db = getFirestore();

  const addCocktail = useCallback(
    (cocktail: CocktailType) => {
      const collectionRef = collection(db, "cocktail_type");

      setIsSaving(true);
      addDoc(collectionRef, cocktail)
        .then(() => {
          message.success("Cocktail saved successfully", 3);
        })
        .catch((e) => {
          message.error("There was an issue saving Cocktail", 5);
          console.error(e);
        })
        .finally(() => {
          setIsSaving(false);
        });
    },
    [db]
  );

  const updateCocktail = useCallback(
    (cocktail: CocktailType) => {
      const docRef = doc(db, "cocktail_type", cocktail.id as string);
      if (cocktail) {
        setIsSaving(true);
        updateDoc(docRef, { ...cocktail })
          .then(() => {
            message.success("Cocktail updated successfully", 3);
          })
          .catch((e) => {
            message.error("There was an issue saving Cocktail", 5);
            console.error(e);
          })
          .finally(() => {
            setIsSaving(false);
          });
      }
    },
    [db]
  );

  const addAlcohol = useCallback(
    (alcohol: AlcoholType) => {
      const collectionRef = collection(db, "alcohol_type");

      setIsSaving(true);
      addDoc(collectionRef, alcohol)
        .then(() => {
          message.success("Alcohol saved successfully", 3);
        })
        .catch((e) => {
          message.error("There was an issue saving Alcohol", 5);
          console.error(e);
        })
        .finally(() => {
          setIsSaving(false);
        });
    },
    [db]
  );

  const updateAlcohol = useCallback(
    (alcohol: AlcoholType) => {
      const docRef = doc(db, "alcohol_type", alcohol.id as string);
      if (alcohol) {
        setIsSaving(true);
        updateDoc(docRef, { ...alcohol })
          .then(() => {
            message.success("Alcohol updated successfully", 3);
          })
          .catch((e) => {
            message.error("There was an issue saving Alcohol", 5);
            console.error(e);
          })
          .finally(() => {
            setIsSaving(false);
          });
      }
    },
    [db]
  );

  const addMixer = useCallback(
    (mixer: MixerType) => {
      const collectionRef = collection(db, "mixer_type");

      setIsSaving(true);
      addDoc(collectionRef, mixer)
        .then(() => {
          message.success("Mixer saved successfully", 3);
        })
        .catch((e) => {
          message.error("There was an issue saving Mixer", 5);
          console.error(e);
        })
        .finally(() => {
          setIsSaving(false);
        });
    },
    [db]
  );

  const updateMixer = useCallback(
    (mixer: MixerType) => {
      const docRef = doc(db, "mixer_type", mixer.id as string);
      if (mixer) {
        setIsSaving(true);
        updateDoc(docRef, { ...mixer })
          .then(() => {
            message.success("Mixer updated successfully", 3);
          })
          .catch((e) => {
            message.error("There was an issue saving Mixer", 5);
            console.error(e);
          })
          .finally(() => {
            setIsSaving(false);
          });
      }
    },
    [db]
  );

  const addGarnish = useCallback(
    (garnish: GarnishType) => {
      const collectionRef = collection(db, "garnish_type");

      setIsSaving(true);
      addDoc(collectionRef, garnish)
        .then(() => {
          message.success("Garnish saved successfully", 3);
        })
        .catch((e) => {
          message.error("There was an issue saving Garnish", 5);
          console.error(e);
        })
        .finally(() => {
          setIsSaving(false);
        });
    },
    [db]
  );

  const updateGarnish = useCallback(
    (garnish: GarnishType) => {
      const docRef = doc(db, "garnish_type", garnish.id as string);
      if (garnish) {
        setIsSaving(true);
        updateDoc(docRef, { ...garnish })
          .then(() => {
            message.success("Garnish updated successfully", 3);
          })
          .catch((e) => {
            message.error("There was an issue saving Garnish", 5);
            console.error(e);
          })
          .finally(() => {
            setIsSaving(false);
          });
      }
    },
    [db]
  );

  return {
    isSaving,
    addAlcohol,
    updateAlcohol,
    addMixer,
    updateMixer,
    addGarnish,
    updateGarnish,
    addCocktail,
    updateCocktail,
  };
};

export default useAdmin;
