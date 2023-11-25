import { useEffect, useState } from "react";
import { listen } from "@tauri-apps/api/event";
import { invoke } from "@tauri-apps/api";
import { showMenu } from "tauri-plugin-context-menu";
import overlayedConfig from "./config";

export const useClickthrough = () => {
  const [clickthrough, setClickthrough] = useState(false);

  useEffect(() => {
    /**
     * Listen for the native 'contextmenu' event and prevent default behavior.
     * Then use tauri plugin to show custom context menu with option to enable
     * clickthrough.
     */
    document.addEventListener("contextmenu", e => {
      e.preventDefault();
      showMenu({
        items: [
          {
            label: "Enable Clickthrough",
            event: () => {
              invoke<boolean>("set_clickthrough", { value: true }).catch(e => {
                console.error("An error has occurred", e);
              });
            },
          },
        ],
      }).catch(e => {
        console.error("An error occurred showing the menu", e);
      });
    });

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
