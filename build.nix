{ pkgs ? import (fetchTarball {
  url = "https://github.com/NixOS/nixpkgs/archive/refs/tags/22.11.tar.gz";
}) { } }:
let
  pkgs = import (fetchTarball {
    url = "https://github.com/NixOS/nixpkgs/archive/refs/tags/22.11.tar.gz";
  }) { };

  # The path to the npm project
  src = ./.;

  # Sandbox workaround: https://www.nmattia.com/posts/2022-12-18-lockfile-trick-package-npm-project-with-nix/

  # Read the package-lock.json as a Nix attrset
  packageLock =
    builtins.fromJSON (builtins.readFile (src + "/package-lock.json"));

in pkgs.stdenv.mkDerivation rec {
  inherit (packageLock) name version;
  pname = name;
  inherit src;

  buildInputs = [
    pkgs.nodejs-18_x
    pkgs.nodePackages.node-gyp-build
    pkgs.gcc9
    pkgs.python310Full
    pkgs.gnumake
    pkgs.python310Packages.gyp
  ];

  buildPhase = ''
    export HOME=$PWD/.home
    export npm_config_cache=$PWD/.npm
    npm ci --no-progress
    npx prisma generate
    npm run build:production
    rm -f dist/.tsbuildinfo
  '';

  installPhase = ''
    mkdir -p $out
    cp -t $out -r dist/ -r prisma/ LICENSE package-lock.json package.json
    cd $out
    npm ci --omit=dev
    npx prisma generate
  '';

}
