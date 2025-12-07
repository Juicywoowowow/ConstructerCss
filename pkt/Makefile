CC = gcc
CFLAGS = -Wall -Wextra -O2
PREFIX = $(HOME)/.pkt

SRC = src/pkt.c
BIN = pkt

all: $(BIN)

$(BIN): $(SRC)
	$(CC) $(CFLAGS) -o $(BIN) $(SRC)

install: $(BIN) setup
	mkdir -p $(PREFIX)/bin
	cp $(BIN) $(PREFIX)/bin/
	cp -r scripts $(PREFIX)/
	cp packages.json $(PREFIX)/
	chmod +x $(PREFIX)/scripts/*.sh
	@echo "\033[32mInstalled pkt to $(PREFIX)/bin\033[0m"
	@echo "\033[33mRun 'source ~/.bashrc' or restart terminal\033[0m"

setup:
	bash scripts/setup.sh

uninstall:
	rm -f $(PREFIX)/bin/$(BIN)
	rm -rf $(PREFIX)/scripts
	rm -f $(PREFIX)/packages.json
	@echo "\033[32mUninstalled pkt\033[0m"

clean:
	rm -f $(BIN)

.PHONY: all install setup uninstall clean
