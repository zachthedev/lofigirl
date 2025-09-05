#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use serde::{Deserialize, Serialize};
use std::sync::{Arc, Mutex};
use tauri::{
    AppHandle, Emitter, Manager, State,
    menu::{MenuBuilder, MenuItemBuilder},
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
};

#[derive(Debug, Clone, Serialize, Deserialize)]
struct AppState {
    is_audio_mode: bool,
    is_playing: bool,
    is_window_visible: bool,
}

impl Default for AppState {
    fn default() -> Self {
        Self {
            is_audio_mode: false,
            is_playing: true,
            is_window_visible: false,
        }
    }
}

type AppStateType = Arc<Mutex<AppState>>;

// Tauri commands for frontend-backend communication
#[tauri::command]
async fn toggle_audio_mode(state: State<'_, AppStateType>, app: AppHandle) -> Result<bool, String> {
    let is_audio_mode = {
        let mut app_state = state.lock().map_err(|e| e.to_string())?;
        app_state.is_audio_mode = !app_state.is_audio_mode;
        app_state.is_audio_mode
    };

    // Update tray menu to reflect new state
    update_tray_menu(&app, &state)
        .await
        .map_err(|e| e.to_string())?;

    Ok(is_audio_mode)
}

#[tauri::command]
async fn toggle_playback(state: State<'_, AppStateType>, app: AppHandle) -> Result<bool, String> {
    let is_playing = {
        let mut app_state = state.lock().map_err(|e| e.to_string())?;
        app_state.is_playing = !app_state.is_playing;
        app_state.is_playing
    };

    // Update tray menu to reflect new state
    update_tray_menu(&app, &state)
        .await
        .map_err(|e| e.to_string())?;

    Ok(is_playing)
}

#[tauri::command]
async fn set_window_visibility(
    state: State<'_, AppStateType>,
    visible: bool,
    app: AppHandle,
) -> Result<(), String> {
    {
        let mut app_state = state.lock().map_err(|e| e.to_string())?;
        app_state.is_window_visible = visible;
    }

    // Update tray menu to reflect new state
    update_tray_menu(&app, &state)
        .await
        .map_err(|e| e.to_string())?;

    Ok(())
}

#[tauri::command]
async fn get_app_state(state: State<'_, AppStateType>) -> Result<AppState, String> {
    let app_state = state.lock().map_err(|e| e.to_string())?;
    Ok(app_state.clone())
}

async fn update_tray_menu(
    app: &AppHandle,
    state: &AppStateType,
) -> Result<(), Box<dyn std::error::Error>> {
    let (is_audio_mode, is_playing, is_visible) = {
        let app_state = state.lock().unwrap();
        (
            app_state.is_audio_mode,
            app_state.is_playing,
            app_state.is_window_visible,
        )
    };

    // Build tray menu with current state
    build_tray_with_state(app, is_audio_mode, is_playing, is_visible)?;
    Ok(())
}

fn build_tray_with_state(
    app: &AppHandle,
    is_audio_mode: bool,
    is_playing: bool,
    is_visible: bool,
) -> Result<(), Box<dyn std::error::Error>> {
    let show_hide = if is_visible {
        MenuItemBuilder::new("Hide Window")
            .id("toggle_window")
            .build(app)?
    } else {
        MenuItemBuilder::new("Show Window")
            .id("toggle_window")
            .build(app)?
    };

    let play_pause = if is_playing {
        MenuItemBuilder::new("Pause")
            .id("toggle_playback")
            .build(app)?
    } else {
        MenuItemBuilder::new("Play")
            .id("toggle_playback")
            .build(app)?
    };

    let mode_toggle = if is_audio_mode {
        MenuItemBuilder::new("Switch to Video Mode")
            .id("toggle_mode")
            .build(app)?
    } else {
        MenuItemBuilder::new("Switch to Audio Mode")
            .id("toggle_mode")
            .build(app)?
    };

    let quit = MenuItemBuilder::new("Quit").id("quit").build(app)?;

    let menu = MenuBuilder::new(app)
        .item(&show_hide)
        .separator()
        .item(&play_pause)
        .item(&mode_toggle)
        .separator()
        .item(&quit)
        .build()?;

    TrayIconBuilder::new()
        .icon(app.default_window_icon().unwrap().clone())
        .menu(&menu)
        .on_menu_event(move |app, event| {
            match event.id().as_ref() {
                "toggle_window" => {
                    if let Some(window) = app.get_webview_window("main") {
                        let is_visible = window.is_visible().unwrap_or(false);
                        if is_visible {
                            let _ = window.hide();
                            // Emit event to frontend to pause media when hiding
                            let _ = window.emit("window-hidden", ());
                        } else {
                            let _ = window.show();
                            let _ = window.set_focus();
                            // Emit event to frontend to resume media when showing
                            let _ = window.emit("window-shown", ());
                        }
                    }
                }
                "toggle_playback" => {
                    if let Some(window) = app.get_webview_window("main") {
                        let _ = window.emit("toggle-playback-from-tray", ());
                    }
                }
                "toggle_mode" => {
                    if let Some(window) = app.get_webview_window("main") {
                        let _ = window.emit("toggle-mode-from-tray", ());
                    }
                }
                "hide" => {
                    if let Some(window) = app.get_webview_window("main") {
                        let _ = window.hide();
                    }
                }
                "quit" => {
                    app.exit(0);
                }
                _ => {}
            }
        })
        .on_tray_icon_event(move |tray, event| {
            if let TrayIconEvent::Click {
                button: MouseButton::Left,
                button_state: MouseButtonState::Up,
                ..
            } = event
            {
                let app = tray.app_handle();
                if let Some(window) = app.get_webview_window("main") {
                    let is_visible = window.is_visible().unwrap_or(false);
                    if is_visible {
                        let _ = window.hide();
                        let _ = window.emit("window-hidden", ());
                    } else {
                        let _ = window.show();
                        let _ = window.set_focus();
                        let _ = window.emit("window-shown", ());
                    }
                }
            }
        })
        .build(app)?;

    Ok(())
}

fn build_tray(app: &AppHandle) -> Result<(), Box<dyn std::error::Error>> {
    // Initialize with default state
    build_tray_with_state(app, false, true, false)
}

fn main() {
    let app_state = AppStateType::default();

    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .manage(app_state)
        .invoke_handler(tauri::generate_handler![
            toggle_audio_mode,
            toggle_playback,
            set_window_visibility,
            get_app_state
        ])
        .setup(|app| {
            // Hide the window on startup
            if let Some(window) = app.get_webview_window("main") {
                let _ = window.hide();
            }

            // Set up system tray
            build_tray(app.handle())?;

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
