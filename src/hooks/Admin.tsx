import { useState, useCallback } from "react";
import { getFirestore, doc, addDoc, collection, updateDoc } from "firebase/firestore";
import { message } from "antd";
import type { AlcoholType, MixerType, GarnishType } from "./Order";

const useAdmin = () => {
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string>();

  const db = getFirestore();

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
      const docRef = doc(db, "alcohol_type", selectedId as string);
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
    [selectedId, db]
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
      const docRef = doc(db, "mixer_type", selectedId as string);
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
    [selectedId, db]
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
      const docRef = doc(db, "garnish_type", selectedId as string);
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
    [selectedId, db]
  );

  return {
    isSaving,
    selectedId,
    addAlcohol,
    updateAlcohol,
    addMixer,
    updateMixer,
    addGarnish,
    updateGarnish,
    setSelectedId,
  };
};

export default useAdmin;
