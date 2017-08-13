import numpy as np
from lxml import html
import requests

#Get the lunch page
page = requests.get('http://www.d125.org/students/food-service')

#Parse the lunch page
tree = html.fromstring(page.content)

#Get every div where data-sf-ftype is "LongText", these are lunch menu items
items = tree.xpath('//div[@data-sf-ftype="LongText"]/text()')[9:] #First 9 elements are new lines

items = [i for i in (i.strip() for i in items) if i != '']

lunch = []

#Every 4 items composes one lunch menu for a single day
for i in range(0, len(items), 4):
	lunch.append(items[i:i+4])

day_index = 0
day_numbers = [2, 3, 4, 5, 6, 9, 10, 11, 12, 13, 16, 17, 18, 19, 20, 23, 24, 25, 26, 27]

for menu in lunch:
	s = "["
	for food in menu:
		s += '"' + food + '", '
	s = s[:-2] + "],"

	print("'" + str(day_numbers[day_index]) + "': " + s)

	day_index += 1


