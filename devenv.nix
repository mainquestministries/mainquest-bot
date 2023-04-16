{ pkgs, inputs, ... }:

{
  # https://devenv.sh/basics/
  env.GREET = "mainquestbot-devenv";
  

  # https://devenv.sh/packages/
  packages = [  pkgs.git 
                pkgs.nodejs-18_x 
                pkgs.nodePackages.node-gyp-build 
                pkgs.gcc9
                pkgs.python310Full 
                pkgs.gnumake
                pkgs.python310Packages.gyp];

  # https://devenv.sh/scripts/
  scripts.migrate.exec = "npx prisma migrate dev";
  scripts.update.exec = "npm ci";

  enterShell = ''
    echo Use update to update to the latest packages and migrate to do a migration.
    echo Node Version: `node --version`
  '';
  services.mysql.enable = true;
  services.mysql.package = pkgs.mariadb;
  services.mysql.initialDatabases = [{ name = "discord"; }];
  services.mysql.ensureUsers = [
    {
      name = "bot";
      password = "12345";
      ensurePermissions = { "*.*" = "ALL PRIVILEGES"; };
    }
  ];

  processes = {
    node.exec= "npm run watch:start";
  };

  # See full reference at https://devenv.sh/reference/options/
}
