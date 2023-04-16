{
  pkgs ? import (fetchTarball {
    url = "https://github.com/NixOS/nixpkgs/archive/refs/tags/22.11.tar.gz";
  }) {}
}:
let
  pkgs = import (fetchTarball {
    url = "https://github.com/NixOS/nixpkgs/archive/refs/tags/22.11.tar.gz";
  }) { };

  # The path to the npm project
  src = ./.;

  # Sandbox workaround: https://www.nmattia.com/posts/2022-12-18-lockfile-trick-package-npm-project-with-nix/

  # Read the package-lock.json as a Nix attrset
  packageLock = builtins.fromJSON (builtins.readFile (src + "/package-lock.json"));

in

pkgs.stdenv.mkDerivation rec {
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
     npm ci
     npm run build:production
  '';

  installPhase = ''
    cp -t -r $out dist/ prisma/ LICENSE package-lock.json package.json
  '';

}