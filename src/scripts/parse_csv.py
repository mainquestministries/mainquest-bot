import csv, sys, json
import datetime

if len(sys.argv)==1:
    input_ = "losungen.csv"
    output_ = "losungen_{}.json".format(datetime.now().year)
else:
    input_ = sys.argv[1]
    output_ = sys.argv[2]

with open(input_, "r") as f:
    reader = csv.reader(f, delimiter="\t")
    csv_list = list(reader)

with open(output_, "w") as f:
    json.dump(csv_list, f)