#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <termios.h>
#include <sys/stat.h>

// Colors
#define RESET   "\033[0m"
#define RED     "\033[31m"
#define GREEN   "\033[32m"
#define YELLOW  "\033[33m"
#define BLUE    "\033[34m"
#define CYAN    "\033[36m"
#define WHITE   "\033[37m"
#define BOLD    "\033[1m"

#define MAX_PACKAGES 20
#define MAX_NAME 64
#define MAX_DESC 128
#define MAX_PATH 256

typedef struct {
    char name[MAX_NAME];
    char description[MAX_DESC];
    int installed;
    int update_available;
} Package;

Package packages[MAX_PACKAGES];
int package_count = 0;
int selected = 0;

char pkt_home[MAX_PATH];
char pkt_bin[MAX_PATH];
char pkt_src[MAX_PATH];
char pkt_installed[MAX_PATH];

// Get single keypress
char getch() {
    struct termios old, new;
    char c;
    tcgetattr(STDIN_FILENO, &old);
    new = old;
    new.c_lflag &= ~(ICANON | ECHO);
    tcsetattr(STDIN_FILENO, TCSANOW, &new);
    c = getchar();
    tcsetattr(STDIN_FILENO, TCSANOW, &old);
    return c;
}

void clear_screen() {
    printf("\033[2J\033[H");
}

void init_paths() {
    char *home = getenv("HOME");
    snprintf(pkt_home, MAX_PATH, "%s/.pkt", home);
    snprintf(pkt_bin, MAX_PATH, "%s/bin", pkt_home);
    snprintf(pkt_src, MAX_PATH, "%s/src", pkt_home);
    snprintf(pkt_installed, MAX_PATH, "%s/installed.json", pkt_home);
}


// Simple JSON parsing for our package list
void load_packages() {
    // Termux-specific packages
    strcpy(packages[0].name, "nnn");
    strcpy(packages[0].description, "Terminal file manager");
    packages[0].installed = 0;
    packages[0].update_available = 0;
    
    strcpy(packages[1].name, "lazygit");
    strcpy(packages[1].description, "Git TUI client");
    packages[1].installed = 0;
    packages[1].update_available = 0;
    
    strcpy(packages[2].name, "gotop");
    strcpy(packages[2].description, "Terminal system monitor");
    packages[2].installed = 0;
    packages[2].update_available = 0;
    
    strcpy(packages[3].name, "lf");
    strcpy(packages[3].description, "Terminal file manager");
    packages[3].installed = 0;
    packages[3].update_available = 0;
    
    strcpy(packages[4].name, "croc");
    strcpy(packages[4].description, "File transfer tool");
    packages[4].installed = 0;
    packages[4].update_available = 0;
    
    strcpy(packages[5].name, "glow");
    strcpy(packages[5].description, "Markdown renderer");
    packages[5].installed = 0;
    packages[5].update_available = 0;
    
    strcpy(packages[6].name, "bat");
    strcpy(packages[6].description, "Cat with syntax highlighting");
    packages[6].installed = 0;
    packages[6].update_available = 0;
    
    strcpy(packages[7].name, "termux-api");
    strcpy(packages[7].description, "Termux API access");
    packages[7].installed = 0;
    packages[7].update_available = 0;
    
    strcpy(packages[8].name, "termux-styling");
    strcpy(packages[8].description, "Terminal styling");
    packages[8].installed = 0;
    packages[8].update_available = 0;
    
    strcpy(packages[9].name, "termux-boot");
    strcpy(packages[9].description, "Run scripts on boot");
    packages[9].installed = 0;
    packages[9].update_available = 0;
    
    package_count = 10;
}

// Check if package is installed
int check_installed(const char *name) {
    char path[MAX_PATH];
    snprintf(path, MAX_PATH, "%s/%s", pkt_bin, name);
    return access(path, F_OK) == 0;
}

// Check all packages for installed status
void check_all_installed() {
    for (int i = 0; i < package_count; i++) {
        packages[i].installed = check_installed(packages[i].name);
    }
}

// Run bash script
int run_script(const char *script, const char *arg) {
    char cmd[MAX_PATH * 2];
    snprintf(cmd, sizeof(cmd), "%s/../scripts/%s %s", pkt_home, script, arg);
    return system(cmd);
}

void draw_header() {
    printf(BOLD CYAN);
    printf("  ____  _    _   \n");
    printf(" |  _ \\| | _| |_ \n");
    printf(" | |_) | |/ / __|\n");
    printf(" |  __/|   <| |_ \n");
    printf(" |_|   |_|\\_\\\\__|\n");
    printf(RESET "\n");
    printf(WHITE " Package Manager for Termux\n" RESET);
    printf(WHITE " ─────────────────────────────────\n" RESET);
}

void draw_menu() {
    clear_screen();
    draw_header();
    
    printf("\n");
    for (int i = 0; i < package_count; i++) {
        if (i == selected) {
            printf(BOLD " > " RESET);
        } else {
            printf("   ");
        }
        
        // Color based on status
        if (packages[i].update_available) {
            printf(YELLOW);
        } else if (packages[i].installed) {
            printf(GREEN);
        } else {
            printf(WHITE);
        }
        
        printf("%-12s", packages[i].name);
        printf(RESET " - %s", packages[i].description);
        
        if (packages[i].installed) {
            printf(GREEN " [installed]" RESET);
        }
        if (packages[i].update_available) {
            printf(YELLOW " [update]" RESET);
        }
        printf("\n");
    }
    
    printf("\n" WHITE " ─────────────────────────────────\n" RESET);
    printf(CYAN " [↑/↓]" RESET " Navigate  ");
    printf(CYAN "[Enter]" RESET " Install  ");
    printf(CYAN "[u]" RESET " Update  ");
    printf(CYAN "[d]" RESET " Uninstall  ");
    printf(CYAN "[q]" RESET " Quit\n");
}


void install_package(int idx) {
    if (packages[idx].installed) {
        printf(YELLOW "\n Package '%s' is already installed.\n" RESET, packages[idx].name);
        printf(" Press any key to continue...");
        getch();
        return;
    }
    
    printf(CYAN "\n Installing %s...\n" RESET, packages[idx].name);
    
    char cmd[MAX_PATH * 2];
    snprintf(cmd, sizeof(cmd), "bash %s/scripts/install.sh %s", pkt_home, packages[idx].name);
    int result = system(cmd);
    
    if (result == 0) {
        packages[idx].installed = 1;
        printf(GREEN "\n Successfully installed %s!\n" RESET, packages[idx].name);
    } else {
        printf(RED "\n Failed to install %s.\n" RESET, packages[idx].name);
    }
    
    printf(" Press any key to continue...");
    getch();
}

void uninstall_package(int idx) {
    if (!packages[idx].installed) {
        printf(YELLOW "\n Package '%s' is not installed.\n" RESET, packages[idx].name);
        printf(" Press any key to continue...");
        getch();
        return;
    }
    
    printf(RED "\n Uninstall %s? [y/N]: " RESET, packages[idx].name);
    char c = getch();
    
    if (c == 'y' || c == 'Y') {
        char cmd[MAX_PATH * 2];
        snprintf(cmd, sizeof(cmd), "bash %s/scripts/uninstall.sh %s", pkt_home, packages[idx].name);
        int result = system(cmd);
        
        if (result == 0) {
            packages[idx].installed = 0;
            printf(GREEN "\n Uninstalled %s.\n" RESET, packages[idx].name);
        } else {
            printf(RED "\n Failed to uninstall %s.\n" RESET, packages[idx].name);
        }
    } else {
        printf("\n Cancelled.\n");
    }
    
    printf(" Press any key to continue...");
    getch();
}

void check_update(int idx) {
    if (!packages[idx].installed) {
        printf(YELLOW "\n Package '%s' is not installed.\n" RESET, packages[idx].name);
        printf(" Press any key to continue...");
        getch();
        return;
    }
    
    printf(CYAN "\n Checking for updates...\n" RESET);
    
    char cmd[MAX_PATH * 2];
    snprintf(cmd, sizeof(cmd), "bash %s/scripts/check_update.sh %s", pkt_home, packages[idx].name);
    int result = system(cmd);
    
    if (result == 1) {
        packages[idx].update_available = 1;
        printf(YELLOW "\n Update available for %s!\n" RESET, packages[idx].name);
        printf(" Update now? [y/N]: ");
        char c = getch();
        
        if (c == 'y' || c == 'Y') {
            snprintf(cmd, sizeof(cmd), "bash %s/scripts/install.sh %s update", pkt_home, packages[idx].name);
            system(cmd);
            packages[idx].update_available = 0;
            printf(GREEN "\n Updated %s!\n" RESET, packages[idx].name);
        }
    } else {
        printf(GREEN "\n %s is up to date.\n" RESET, packages[idx].name);
    }
    
    printf(" Press any key to continue...");
    getch();
}

int main(int argc, char *argv[]) {
    init_paths();
    load_packages();
    check_all_installed();
    
    char c;
    while (1) {
        draw_menu();
        c = getch();
        
        // Handle arrow keys (escape sequences)
        if (c == 27) {  // ESC
            c = getch();
            if (c == '[') {
                c = getch();
                if (c == 'A' && selected > 0) selected--;  // Up
                if (c == 'B' && selected < package_count - 1) selected++;  // Down
            }
        }
        else if (c == 'k' && selected > 0) selected--;  // vim up
        else if (c == 'j' && selected < package_count - 1) selected++;  // vim down
        else if (c == '\n' || c == '\r') install_package(selected);
        else if (c == 'd' || c == 'D') uninstall_package(selected);
        else if (c == 'u' || c == 'U') check_update(selected);
        else if (c == 'q' || c == 'Q') break;
    }
    
    clear_screen();
    printf(CYAN "Thanks for using Pkt!\n" RESET);
    return 0;
}
