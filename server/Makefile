PWD:=$(shell pwd)
run:chmod
	./main.mjs
chmod:
	chmod +x ./main.mjs
restart:
	systemctl --user restart mcbeeringi-dev
install:chmod
	sed "s|PWD|$(PWD)/|g" mcbeeringi-dev.service>~/.config/systemd/user/mcbeeringi-dev.service
	loginctl enable-linger
	systemctl --user enable --now mcbeeringi-dev
uninstall:
	systemctl --user disable --now mcbeeringi-dev
	loginctl disable-linger
	rm ~/.config/systemd/user/mcbeeringi-dev.service
