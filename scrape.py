import numpy as np
from lxml import html
import requests

page = requests.get('http://www.d125.org/students/food-service')

tree = html.fromstring(page.content)

items = tree.xpath('//div[@data-sf-ftype="LongText"]/text()')

items2 = []

for i in items:
	if i != ' ':
		items2.append(i.strip())

items = items2[9:]

items2 = []

for i in items:
	if i != "":
		items2.append(i)

items = items2


items = np.array_split(items, 15)


items2 = []
for a in items:
	items2.append(a.tolist())
items = items2


i = 0
for n in [2, 3, 4, 5, 6, 9, 10, 11, 12, 13, 16, 17, 18, 19, 20, 23, 24, 25, 26, 27]:
	menu = items[i]
	