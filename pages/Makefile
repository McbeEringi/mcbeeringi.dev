SHELL = /bin/bash
RUN_PREFIX := run-
ESC_PREFIX := esc-
DSTDIR := dst
SRCDIR := src

.PHONY: all clean copy exec move

all:clean copy exec move
	@echo -e "\x1b[1;32m *\x1b[0;33m all\x1b[0;1;32m complete!\x1b[0m";\

clean:
	@rm -rf "$(DSTDIR)"/*
	@echo -e "\x1b[1;32m *\x1b[0;33m clean\x1b[0;3m $(DSTDIR)\x1b[0m";
	@echo -e "\x1b[1;32m *\x1b[0;33m clean\x1b[0;32m done\x1b[0m";

copy:
	@mkdir -p "$(DSTDIR)"
	@cp -r "$(SRCDIR)"/* "$(DSTDIR)"
	@echo -e "\x1b[1;32m *\x1b[0;33m copy\x1b[0;3m $(SRCDIR)\x1b[2m =>\x1b[0;3m $(DSTDIR)\x1b[0m";
	@echo -e "\x1b[1;32m *\x1b[0;33m copy\x1b[0;32m done\x1b[0m";

exec:
	@find "$(DSTDIR)" -type f -name "$(RUN_PREFIX)*" -print0|\
		while IFS= read -r -d '' x;do\
			d=$$(awk -F'/' '{print NF}'<<<"$$x");\
			printf "%s\t%s\n" "$$d" "$$x";\
		done|\
		sort -k1,1nr -k2|\
		cut -f2-|\
		while IFS= read -r x;do\
			echo -e "\x1b[1;32m *\x1b[0;33m exec\x1b[0;3m $$x\x1b[0m";\
			chmod +x "$$x";\
			(cd "$$(dirname "$$x")"&&"./$$(basename "$$x")");\
		done
	@echo -e "\x1b[1;32m *\x1b[0;33m exec\x1b[0;32m done\x1b[0m";

move:
	@find "$(DSTDIR)" -type f -name "$(ESC_PREFIX)*" -print0|while IFS= read -r -d '' x;do\
		dir="$$(dirname "$$x")";\
		base="$$(basename "$$x")";\
		esc="$${base#$(ESC_PREFIX)}";\
		echo -e "\x1b[1;32m *\x1b[0;33m move\x1b[0;3m $$x\x1b[2m =>\x1b[0;3m $$dir/$$esc\x1b[0m";\
		mv -f "$$x" "$$dir/$$esc";\
	done
	@echo -e "\x1b[1;32m *\x1b[0;33m move\x1b[0;32m done\x1b[0m";
