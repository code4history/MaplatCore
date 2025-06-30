#!/bin/bash

# Playwright dependencies for Oracle Linux / RHEL / CentOS
echo "Installing Playwright dependencies for Oracle Linux..."

# Chromium dependencies
sudo dnf install -y \
    atk \
    at-spi2-atk \
    cups-libs \
    libxkbcommon \
    libXcomposite \
    libXdamage \
    libXfixes \
    libXrandr \
    mesa-libgbm \
    alsa-lib \
    libXScrnSaver \
    gtk3

# Firefox dependencies  
sudo dnf install -y \
    libX11-xcb \
    libXcursor \
    libXi \
    libXt \
    libXtst

# Additional libraries that might be needed
sudo dnf install -y \
    nss \
    libdrm \
    xorg-x11-fonts-100dpi \
    xorg-x11-fonts-75dpi \
    xorg-x11-fonts-cyrillic \
    xorg-x11-fonts-misc \
    xorg-x11-fonts-Type1 \
    xorg-x11-utils

echo "Dependencies installation completed!"