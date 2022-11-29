import csv, sys, json

with open(sys.argv[1], "r") as f:
    reader = csv.reader(f, delimiter="\t")
    csv_list = list(reader)

with open(sys.argv[2], "w") as f:
    json.dump(csv_list, f)