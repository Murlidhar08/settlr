#!/bin/zsh -e

icon=./app/assets/light_logo.svg
bg=#ffffff

out_dir=./public/images/app-icon
manifest=./app/manifest.json
icons_path_base=images/app-icon
index=./app/pwa_icons_meta.html

npx pwa-asset-generator $icon $out_dir --manifest $manifest --opaque false --icon-only --favicon --type png --path-override $icons_path_base --index $index
npx pwa-asset-generator $icon $out_dir --manifest $manifest --background $bg --icon-only --path-override $icons_path_base --index $index

npx pwa-asset-generator $icon $out_dir --manifest $manifest --background $bg --splash-only --path-override $icons_path_base --index $index

# comment this block if you don't have an icon for a dark mode
dark_mode_icon=./app/assets/dark_logo.svg
dark_mode_bg=#000000

npx pwa-asset-generator $dark_mode_icon  $out_dir --manifest $manifest --background $dark_mode_bg --splash-only --path-override $icons_path_base --dark-mode --index $index