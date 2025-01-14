import { useEffect, useState } from "react";
import { listen } from "@tauri-apps/api/event";
import overlayedConfig from "./config";
import { invoke } from "@tauri-apps/api";

export const useClickthrough = () => {
  const [clickthrough, setClickthrough] = useState(false);
  useEffect(() => {
    // sub if it changes from outside of tauri
    const unlisten = listen<boolean>("toggle_clickthrough", event => {
      setClickthrough(event.payload);
      overlayedConfig.set("clickthrough", event.payload);
    });

    // This is so we can sync the state
    invoke<boolean>("get_clickthrough").then(clickthrough => setClickthrough(clickthrough));

    return () => {
      unlisten.then(f => f());
    };
  }, []);

  return { clickthrough };
};
