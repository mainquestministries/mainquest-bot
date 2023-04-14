{ pkgs, ... }:

{
  # https://devenv.sh/basics/
  env.GREET = "mainquestbot-devenv";

  # https://devenv.sh/packages/
  packages = [ pkgs.git pkgs.nodejs-18_x 
                pkgs.nodePackages.node-gyp-build 
                pkgs.gcc9
                pkgs.python310Full 
                pkgs.gnumake
                pkgs.python310Packages.gyp];

  # https://devenv.sh/scripts/
  scripts.hello.exec = "echo hello from $GREET";

  enterShell = ''
    hello
    node --version
  '';

  # https://devenv.sh/languages/
  # languages.nix.enable = true;

  # https://devenv.sh/pre-commit-hooks/
  # pre-commit.hooks.shellcheck.enable = true;

  # https://devenv.sh/processes/
  # processes.ping.exec = "ping example.com";

  # See full reference at https://devenv.sh/reference/options/
}
