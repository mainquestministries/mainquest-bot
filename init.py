import os, re

if not os.path.exists("./.env"):
    print("Please enter your Database url after the schema: USERNAME:PASSWORD@hostname:port/DATABASE")
    db_connection = input("Database url> ")
    with open("./.env", "w") as f:
        f.write(f"DATABASE_URL=\"postgresql://{db_connection}\"")
else:
    print("Database file exists")

if not os.path.exists("./src/.env"):
    print("Please enter your Discord-token")
    d_token = input("Discord token> ")
    owners = input("Enter your own id. Can be left blank.")
    with open("./src/.env", "w") as f:
        f.writelines(
            ["DISCORD_TOKEN=\"{}\"".format(d_token),
            f"OWNERS={owners}"]
        )
else:
    print("Token already exists")

print("Done!")
        
    
