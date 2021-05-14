set -e

export c_keymap=us
export c_x_keymap=us
export c_disk=/dev/sda
export c_timezone=America/New_York
export c_hostname=austin-arch
export c_language=en_US.UTF-8
export c_language_gettext=en_US
export c_username=austin
export c_name="Austin Simon"

function password_prompt() {
	echo -n 'Enter your password: '
	read -s password
	echo

	echo -n 'Enter your password again: '
	read -s password_confirmation
	echo

	if [ "$password" == "$password_confirmation" ]; then
		export c_password=$password
	else
		echo "The passwords don't match, try again!"
		password_prompt
	fi
}
if [ -z "$c_password" ]; then
	password_prompt
fi

if ! test -d /sys/firmware/efi; then
	>&2 echo "ERROR: UEFI was not detected! Make sure that UEFI is enabled in your machine's boot settings and try running the installer again."
	exit 1
fi

function echo_step() {
	echo "=== $@ ==="
}

function require_var() {
	variable=$1
	value=${!variable}
	if test -z $value; then
		echo "The '$variable' variable has to set before running the script!"
		exit 1
	fi
}

function require_vars() {
	for var in $@; do
		require_var $var
	done
}

require_vars c_keymap c_disk c_timezone c_hostname \
	c_language c_language_gettext c_username c_password
localectl set-keymap $c_keymap

echo_step Creating partitions
sgdisk --clear $c_disk
sgdisk -n 1:2048:+512M -t 1:ef00 -c 1:efi $c_disk
sgdisk -n 2:$(sgdisk -f $c_disk):$(sgdisk -E $c_disk) -t 2:8300 -c 2:system $c_disk

export part_efi=${c_disk}1
export part_system=${c_disk}2

echo_step Formatting partitions
mkfs.vfat -F32 $part_efi

# Initialize encryption
echo -n $c_password | cryptsetup -y --use-random luksFormat --key-file - $part_system

# Decrypt `system` partition
echo -n $c_password | cryptsetup luksOpen --key-file - $part_system luks

# Initialize LVM
pvcreate /dev/mapper/luks
vgcreate vg0 /dev/mapper/luks

# Create `swap` partition
lvcreate --size 4G vg0 --name swap
# Create `root` partition
lvcreate -l +100%FREE vg0 --name root

# Initialize encrypted partitions
mkfs.ext4 /dev/mapper/vg0-root
mkswap /dev/mapper/vg0-swap

echo_step Mounting partitions
mount /dev/mapper/vg0-root /mnt
mkdir /mnt/boot
mount $part_efi /mnt/boot

pacstrap /mnt base base-devel \
	linux linux-firmware \
	lvm2 \
	networkmanager \
	vim nano git fish man

echo_step Saving filesystem table
genfstab -pU /mnt >> /mnt/etc/fstab
echo 'tmpfs /tmp tmpfs defaults,noatime,mode=1777 0 0' >> /mnt/etc/fstab

arch-chroot /mnt /bin/bash -e <<- 'EOF_CHROOT'
	echo Setting timezone
	ln -s /usr/share/zoneinfo/$c_timezone /etc/localtime
	hwclock --systohc --utc
	
	echo Setting hostname
	echo $c_hostname > /etc/hostname
	cat <<- EOF >> /etc/hosts
		127.0.0.1 localhost
		::1 localhost
		127.0.0.1 $c_hostname
	EOF
	
	echo Setting locale
	echo en_US.UTF-8 UTF-8 >> /etc/locale.gen
	locale-gen
	cat <<- EOF >> /etc/locale.conf
		LANG=$c_language
		LANGUAGE=$c_language_gettext
		LC_ALL=$c_language
	EOF
	
	echo Setting keymap
	echo KEYMAP=$c_keymap > /etc/vconsole.conf
	
	echo Setting up sudo
	cat <<- EOF >> /etc/sudoers
		%wheel ALL=(ALL) ALL
		Defaults pwfeedback
	EOF
	
	echo Enabling NetworkManager
	systemctl enable NetworkManager
	
	echo Disabling root login
	usermod --lock root
	
	echo Creating user
	useradd -m -g users -G wheel -s $(which fish) -c "$c_name" $c_username
	echo "$c_username:$c_password" | chpasswd
	
	echo Setting up GnuPG
	sudo -u $c_username mkdir -p /home/$c_username/.gnupg
	echo 'keyserver pool.sks-keyservers.net' | \
			sudo -u $c_username tee /home/$c_username/.gnupg/gpg.conf 1>/dev/null
	# Source: https://wiki.archlinux.org/index.php/GnuPG#Configuration_files
	chmod 700 /home/$c_username/.gnupg
	chmod 600 /home/$c_username/.gnupg/*
	
	echo Setting up Fish shell
	sudo -u $c_username mkdir -p /home/$c_username/.config/fish/conf.d
	sudo -u $c_username echo 'set fish_greeting' \
			> /home/$c_username/.config/fish/conf.d/disable-greeting.fish
	
	echo Installing yay
	su $c_username -s /bin/bash <<- 'EOF'
		git clone https://aur.archlinux.org/yay-bin.git /tmp/yay
		cd /tmp/yay
		makepkg
	EOF
	pacman --noconfirm -U /tmp/yay/*.pkg*
	
	# TODO: See if there is a way to do this with yay
	echo Installing Plymouth
	pacman --noconfirm -S libdrm pango docbook-xsl
	su $c_username -s /bin/bash <<- 'EOF'
		git clone https://aur.archlinux.org/plymouth.git /tmp/plymouth
		cd /tmp/plymouth
		makepkg
	EOF
	pacman --noconfirm -U /tmp/plymouth/*.pkg*
	
	echo Configuring initramfs
	sed -i "/^MODULES=/s/()/(ext4)/; \
					/^HOOKS=/s/udev/systemd sd-plymouth/; \
					/^HOOKS=/s/filesystems/sd-vconsole sd-encrypt sd-lvm2 filesystems/" /etc/mkinitcpio.conf
	mkinitcpio -p linux
	
	echo Installing systemd-boot
	bootctl install
	plymouth_kernel_params="quiet splash loglevel=3 rd.udev.log_priority=3 vt.global_cursor_default=0"
	disk_uuid=$(blkid $part_system -s UUID -o value)
	luks_kernel_params="rd.luks.name=$disk_uuid=luks rd.luks.options=discard root=/dev/mapper/vg0-root"
	kernel_params="$plymouth_kernel_params $luks_kernel_params"
	cat <<- EOF >> /boot/loader/entries/arch.conf
		title Arch Linux
		linux /vmlinuz-linux
		initrd /initramfs-linux.img
		options $kernel_params
	EOF
	
	exit
EOF_CHROOT

umount -R /mnt

reboot
