import { showMenu } from "tauri-plugin-context-menu";
import { invoke } from "@tauri-apps/api/tauri";

invoke("get_clickthrough");

// TODO: tunnle into rust, call hacksores method for current state of clickthrough

const clickthroughEnabled = false;

showMenu({
  items: [
    {
      label: "Enable Clickthrough",
      event: () => {
        // TODO: call hacksores method for enabling clickthrough
      },
      disabled: clickthroughEnabled ? false : true,
    },
    {
      label: "Disable Clickthrough",
      event: () => {
        // TODO: call hacksores method for disabling clickthrough
      },
      disabled: clickthroughEnabled ? true : false,
    },
  ],
});
