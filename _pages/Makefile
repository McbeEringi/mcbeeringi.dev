SHELL = /bin/bash
RUN_PREFIX := run-
ESC_PREFIX := esc-
DSTDIR := dst
SRCDIR := src

.PHONY: all clean copy exec move

all:clean copy exec move
	@echo -e "\x1b[1;32m *\x1b[0;33m all\x1b[0;1;32m complete!\x1b[0m";\

clean:
	@rm -rf $(DSTDIR)/*
	@echo -e "\x1b[1;32m *\x1b[0;33m clean\x1b[0;3m $(DSTDIR)\x1b[0m";
	@echo -e "\x1b[1;32m *\x1b[0;33m clean\x1b[0;32m done\x1b[0m";

copy:
	@cp -r $(SRCDIR)/* $(DSTDIR)
	@echo -e "\x1b[1;32m *\x1b[0;33m copy\x1b[0;3m $(SRCDIR)\x1b[2m =>\x1b[0;3m $(DSTDIR)\x1b[0m";
	@echo -e "\x1b[1;32m *\x1b[0;33m copy\x1b[0;32m done\x1b[0m";

exec:
	@for x in $(shell\
		find $(DSTDIR) -type f -name "$(RUN_PREFIX)*"|\
		awk '{ print gsub("/","/",$$0), $$0 }'|\
		sort -k1nr,1 -k2|\
		cut -d' ' -f2-\
	);do\
		chmod +x $$x;\
		$$x;\
		echo -e "\x1b[1;32m *\x1b[0;33m exec\x1b[0;3m $$x\x1b[0m";\
	done
	@echo -e "\x1b[1;32m *\x1b[0;33m exec\x1b[0;32m done\x1b[0m";

move:
	@for x in $(shell find $(DSTDIR) -type f -name "$(ESC_PREFIX)*");do\
		dir=$$(dirname $$x);\
		base=$$(basename $$x);\
		esc=$${base#$(ESC_PREFIX)};\
		mv -f "$$x" "$$dir/$$esc";\
		echo -e "\x1b[1;32m *\x1b[0;33m move\x1b[0;3m $$x\x1b[2m =>\x1b[0;3m $$dir/$$esc\x1b[0m";\
	done
	@echo -e "\x1b[1;32m *\x1b[0;33m move\x1b[0;32m done\x1b[0m";
