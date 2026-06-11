#!/bin/zsh -e

icon=../public/images/logo/light_logo.png
bg=#ffffff

out_dir=../public/images/app-icon
icons_path_base=images/app-icon

npx pwa-asset-generator $icon $out_dir --opaque false --icon-only --favicon --type png --path-override $icons_path_base
npx pwa-asset-generator $icon $out_dir --background $bg --icon-only --path-override $icons_path_base
npx pwa-asset-generator $icon $out_dir --background $bg --splash-only --path-override $icons_path_base

# comment this block if you don't have an icon for a dark mode
dark_mode_icon=../public/images/logo/dark_logo.png
dark_mode_bg=#000000

npx pwa-asset-generator $dark_mode_icon  $out_dir --background $dark_mode_bg --splash-only --path-override $icons_path_base --dark-mode

# GENERATE MASKABLE ICONS EXPORT AND REPLACE \public\images\logo\* 
# https://maskable.app/editor

# TODO: NOT ACCURATE, DO NOT USE, USE MASKABLE.APP INSTEAD
# Generate maskable icons of custom sizes from public/images/logo/maskable_icon.png
# rm $out_dir/manifest-icon-*.maskable.png
# node generate_maskable_icons.js
