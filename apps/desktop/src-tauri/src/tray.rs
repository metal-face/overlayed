use tauri::{AppHandle, CustomMenuItem, Manager, SystemTray, SystemTrayEvent, SystemTrayMenu};

use crate::{
  commands::{set_clickthrough, toggle_clickthrough},
  constants::*,
  Clickthrough,
};

pub fn create_tray_items() -> SystemTray {
  // System tray configuration
  let tray = SystemTray::new().with_menu(
    SystemTrayMenu::new()
      .add_item(CustomMenuItem::new(
        TRAY_TOGGLE_CLICKTHROUGH,
        "Enable Clickthrough",
      ))
      .add_item(CustomMenuItem::new(TRAY_SHOW_APP, "Show Overlayed"))
      .add_item(CustomMenuItem::new(TRAY_RELOAD, "Reload App"))
      .add_item(CustomMenuItem::new(TRAY_OPEN_DEVTOOLS, "Open Devtools"))
      .add_item(CustomMenuItem::new(TRAY_SETTINGS, "Settings"))
      .add_native_item(tauri::SystemTrayMenuItem::Separator)
      .add_item(CustomMenuItem::new(TRAY_QUIT, "Quit")),
  );

  return tray;
}
pub fn handle_tray_events(app: &AppHandle, event: SystemTrayEvent) {
  match event {
    SystemTrayEvent::MenuItemClick { id, .. } => match id.as_str() {
      TRAY_TOGGLE_CLICKTHROUGH => {
        let window = app.get_window(MAIN_WINDOW_NAME).unwrap();

        toggle_clickthrough(window, app.state::<Clickthrough>())
      }
      TRAY_SHOW_APP => {
        let window = app.get_window(MAIN_WINDOW_NAME).unwrap();
        window.show().unwrap();
        window.set_focus().unwrap();
      }
      TRAY_RELOAD => {
        let window = app.get_window(MAIN_WINDOW_NAME).unwrap();
        window.eval("window.location.reload();").unwrap();
      }
      TRAY_SETTINGS => {
        let window = app.get_window(MAIN_WINDOW_NAME).unwrap();
        let storage = app.state::<Clickthrough>();

        set_clickthrough(false, &window, storage);

        window
          .eval("window.location.href = 'http://localhost:1420/#/settings'")
          .unwrap();
      }
      TRAY_OPEN_DEVTOOLS => {
        let window = app.get_window(MAIN_WINDOW_NAME).unwrap();
        window.open_devtools();
      }
      TRAY_QUIT => std::process::exit(0),
      _ => {}
    },
    _ => {}
  }
}
