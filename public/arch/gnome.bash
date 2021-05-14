export c_keymap=us
export c_x_keymap=us
export c_disk=/dev/sda
export c_timezone=America/New_York
export c_hostname=austin-arch
export c_language=en_US.UTF-8
export c_language_gettext=en_US
export c_username=austin
export c_name="Austin Simon"

packages=(
	gdm-plymouth
	gnome-backgrounds
	gnome-calculator
	gnome-control-center
	gnome-disk-utility
	gnome-keyring
	gnome-shell
	gnome-system-monitor
	gnome-terminal
	eog # Image viewer
	evince # PDF viewer
	file-roller # Archive manager
	gedit # Text editor
	networkmanager # NetworkManager
	totem # Video player
	nautilus # Files

	noto-fonts-emoji # Makes emoji work
	noto-fonts-cjk # Makes some special characters work

	xdg-user-dirs # Provides base user directories (e.g. ~/Documents, ~/Downloads)
	xdg-utils # Makes xdg-open work
)

yay -Sy --noconfirm ${packages[@]} \
	--assume-installed libgdm=0 # Prevent installation of regular libgdm
sudo systemctl enable gdm

echo Setting up keyboard layout
localectl set-x11-keymap $c_x_keymap
gsettings set org.gnome.desktop.input-sources sources "[('xkb', '$c_x_keymap')]"

echo Setting up home directory
xdg-user-dirs-update

echo Enabling dark theme
gsettings set org.gnome.desktop.interface gtk-theme Adwaita-dark

echo Installing icon theme
yay -S --noconfirm papirus-icon-theme
gsettings set org.gnome.desktop.interface icon-theme Papirus-Dark

echo Tweaking GNOME settings
gsettings set org.gnome.desktop.wm.preferences action-middle-click-titlebar minimize
gsettings set org.gnome.desktop.peripherals.touchpad natural-scroll true
gsettings set org.gnome.nautilus.preferences show-create-link true
gsettings set org.gnome.desktop.interface clock-show-weekday true

echo Customizing keybindings
gsettings set org.gnome.desktop.wm.keybindings close "['<Super>q']"
gsettings set org.gnome.desktop.wm.keybindings show-desktop "['<Super>d']"

echo  Adding custom keybindings
function gsettings_append() {
	schema=$1; key=$2; value=$3

	currentValue=$(gsettings get $schema $key)

	# Check if the array is empty
	if [[ $currentValue == *[] ]]; then
		gsettings set $schema $key "['$value']"
	# Check if the value is already in the list
	elif [[ currentValue != *"'$value'"* ]]; then
		# Strip last `]` from array string and append value
		gsettings set $schema $key "${currentValue%]}, '$value']"
	fi
}

function register_shortcut() {
	id=$1; name=$2; command=$3; binding=$4

	gsettings set org.gnome.settings-daemon.plugins.media-keys.custom-keybinding:/org/gnome/settings-daemon/plugins/media-keys/custom-keybindings/$id/ name "$name"
	gsettings set org.gnome.settings-daemon.plugins.media-keys.custom-keybinding:/org/gnome/settings-daemon/plugins/media-keys/custom-keybindings/$id/ command "$command"
	gsettings set org.gnome.settings-daemon.plugins.media-keys.custom-keybinding:/org/gnome/settings-daemon/plugins/media-keys/custom-keybindings/$id/ binding "$binding"
	gsettings_append org.gnome.settings-daemon.plugins.media-keys custom-keybindings "/org/gnome/settings-daemon/plugins/media-keys/custom-keybindings/$id/"
}
register_shortcut 'terminal' 'Open terminal' 'gnome-terminal' '<Super>t'

yay -S --noconfirm gnome-shell-extension-installer

yay -S --noconfirm libappindicator-gtk3
# https://extensions.gnome.org/extension/615/appindicator-support/
gnome-shell-extension-installer 615

# https://extensions.gnome.org/extension/517/caffeine/
gnome-shell-extension-installer 517
dconf write /org/gnome/shell/extensions/caffeine/show-notifications false

echo Hiding extraneous apps from GNOME applications view
hidden_apps=(
	avahi-discover
	bssh
	bvnc
	lstopo
	qv4l2
	qvidcap
)
apps_dir="$HOME/.local/share/applications"
hidden_app="$apps_dir/.hidden.desktop"
mkdir -p $apps_dir
cat <<- EOF > $hidden_app
	[Desktop Entry]
	Type=Application
	Hidden=true
EOF
for app in "${hidden_apps[@]}"; do
	ln -s $hidden_app "$apps_dir/$app.desktop"
done

echo Enabling automatic login
sudo tee /etc/gdm/custom.conf <<- EOF
	[daemon]
	AutomaticLoginEnable=true
	AutomaticLogin=$USER
	WaylandEnable=false
EOF
