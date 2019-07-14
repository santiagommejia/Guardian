import json

with open('../configs/config.json') as json_data_file:
    data = json.load(json_data_file)
print(data)
print (data['day_light_end_hour'])