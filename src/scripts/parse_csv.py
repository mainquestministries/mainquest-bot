import csv
file_data= ""
while True:
    try:
        file_data += input()
    except EOFError:
        break

reader = csv.reader(file_data)