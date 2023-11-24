import { onEventShowMenu } from "tauri-plugin-context-menu";
import { invoke } from "@tauri-apps/api/tauri";
import { useState } from "react";

const [ctEnabled, setCtEnabled] = useState(false);

onEventShowMenu("contextmenu", async (_e?: MouseEvent) => {
  const options = {
    items: [
      {
        label: "Enable Clickthrough",
        event: () => {
          setCtEnabled(true);
          invoke("toggle_clickthrough");
        },
        disabled: ctEnabled ? false : true,
      },
      {
        label: "Disable Clickthrough",
        event: () => {
          setCtEnabled(false);
          invoke("toggle_clickthrough");
        },
        disabled: ctEnabled ? true : false,
      },
    ],
  };
  return options;
});
