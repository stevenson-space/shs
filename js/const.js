const constants =
{
	calendar_events: ['8/14/2017', '11/22/2017', '2/6/2018', '2/7/2018'],
	calendar_event_names: ['School begins', 'Early Dismissal', 'Odyssey', 'Odyssey'],
	latearrival: ['8/24/2017', '9/1/2017', '9/14/2017', '10/11/2017', '10/19/2017', '11/9/2017', '11/30/2017', '1/18/2018', '2/6/2017', '2/7/2017',
								'2/22/2018', '3/15/2018', '4/19/2018'],
	activityperiod: ['8/16/2017', '9/6/2017', '10/4/2017', '11/1/2017', '11/27/2017', '1/11/2018', '2/28/2018', '3/21/2018', '4/11/2018', '5/2/2018'],
	pmassembly: ['9/15/2017', '11/22/2017', '2/23/2018', '5/18/2018'],
	finals: ['12/18/2017', '12/19/2017', '12/20/2017', '5/22/2018', '5/23/2018', '5/24/2018'],
	holidays: ['9/4/2017', '9/21/2017', '10/9/2017', '11/23/2017', '11/24/2017', '12/21/2017', '12/22/2017', '12/25/2017', '12/26/2017', '12/27/2017',
						 '12/28/2017', '12/29/2017', '1/1/2018', '1/2/2018', '1/3/2018', '1/4/2018', '1/5/2018', '1/15/2018', '2/19/2018', '3/2/2018', '3/5/2018',
					 	 '3/23/2018', '3/26/2018', '3/27/2018', '3/28/2018', '3/29/2018', '3/30/2018'],

	latearrival_s: [630, 670, 705, 740, 780, 820, 860, 895],
	latearrival_e: [665, 700, 735, 775, 815, 855, 890, 925],
	latearrival_p: ['1', '2', '3', '4', '5', '6', '7', '8'],

	activityperiod_s: [510, 560, 606, 654, 700, 746, 792, 838, 884],
	activityperiod_e: [555, 601, 649, 695, 741, 787, 833, 879, 925],
	activityperiod_p:  ['1', '2', '!Activity', '3', '4', '5', '6', '7', '8'],

	pmassembly_s: [510, 560, 606, 652, 698, 744, 790, 836, 882],
	pmassembly_e: [555, 601, 647, 693, 739, 785, 831, 877, 925],
	pmassembly_p: ['1', '2', '3', '4', '5', '6', '7', '8', '!Assembly'],

	finals_s: [510, 610, 710],
	finals_e: [600, 700, 800],
	finals_p1: ['1','2','4',],
	finals_p2: ['3','7','5'],
	finals_p3: ['8','6','!Makeup'],

	standard_s: [510, 566, 618, 670, 697, 722, 749, 774, 801, 826, 878],
	standard_e: [561, 613, 665, 690, 717, 742, 769, 794, 821, 873, 925],
	standard_p: ['1', '2', '3', '4A', '4B', '5A', '5B', '6A', '6B', '7', '8'],

	colors: ['#1693A5', '#02AAB0', '#00CDAC', '#F04155', '#FF823A', '#95CFB7', '#F56991', '#FF9F80',
		 '#4F2958', '#5B7C8D', '#66B6AB', '#5896E6', '#95DE52', '#D34747', '#2B7F7F', '#A23774',
		 '#0B3954','#AC80A0','#064789','#63A375'],
	logo: 'img/logo.png',

	calendar_color: '#00cdac',
	isHolday: false,
	holiday_colors: ['#830707', '#E80C0C', '#E60D51', '#E95182'],
	holiday_logo: 'img/valentines.png',

	lunches:
	{
    	"2": ["Baked Cheese Tortellini ", "Balsamic Garlic Chicken ", "Creamed Spinach, Baby Carrots, Rice ", "Chicken Rice Soup, Vegetarian Chili"],
    	"3": ["Tempura Chicken Stir-Fry ", "Korean Stir-Fry Vegetable W/ Tofu ", "Vegetable Spring Rolls, Brown Rice ", "Cream of Mushroom Soup, Beef Noodle Soup"],
    	"4": ["BBQ Pulled Chicken Sandwich ", "Turkey Breast Vesuvio ", "Roasted Cauliflower, Cous Cous Primavera ", "Tomato Basil Soup, Beef Vegetable Soup"],
    	"5": ["Baked Chicken Parmesan ", "Baked Tilapia ", "Ratatouille, Pasta, Cous Cous ", "Potato Bacon Chowder, Tuscan Kale & Bean Soup"],
    	"6": ["Baked Chicken Picata ", "Baked Salmon ", "Quinoa Pilaf, Lemon Pepper Green Beans ", "Cream of Potato Soup, Vegetable Rice Soup"],
    	"9": ["Sliced Pork Marsala ", "Blacken Tilapia ", "Red Potatoes, Fresh Broccoli, Braised Red Cabbage ", "Chicken Noodle Soup, Cream of Spinach Soup"],
    	"10": ["Home Made Beef Stew ", "Thai Chicken Stir-Fry ", "Rice, Stir-Fry Vegetables, Roasted Cauliflower ", "Cream of Tomato Soup, French Onion Soup"],
    	"11": ["Baked Cheese Enchiladas ", "Baja Fish Quinoa Tacos ", "Cilantro Lime Rice, Roasted Corn & Black Bean Salsa ", "Chicken Tortilla Soup, Cream of Brocoli Soup"],
    	"12": ["Chopped Steak W/ Sauteed Onions ", "Baked Turkey Meatloaf ", "Red Potatoes, Sauteed Broccolini ", "Cream of Chicken Soup, Garden Vegetable Soup"],
    	"13": ["Three Cheese Penne ", "Brazilian Chicken Breast ", "Yellow Rice, Roasted Carrots ", "Cream of Cauliflower, Chicken Quinoa Soup"],
    	"16": ["Baked Beef Ravioli", "Vegetable Lo Mein Stir-Fry", "Pea Pods, Egg Roll", "Chicken Rice Soup, Vegetarian Chili"],
    	"17": ["Home Made Chicken Pot Pie ", "Thai Steak Stir-Fry ", "Fried Rice, Roasted Vegetables ", "Cream of Mushroom Soup, Beef Noodle Soup"],
    	"18": ["BBQ Baked Chicken Breast ", "Spring Herb & Dijon Pork ", "Rice, Roasted Asparagus ", "Tomato Basil Soup, Beef Vegetable Soup"],
    	"19": ["Home Made Beef Meatloaf ", "Spicy Whole Wheat Spaghetti ", "Balsamic Swiss Chard, Orzo, Roasted Carrots ", "Chicken Tortilla Soup, Cream of Brocoli Soup"],
    	"20": ["Baked Pasta W/ Marnaria ", "Citrus Herb Salmon ", "Fresh Broccoli, Seasonal Fruit ", "Cream of Potato Soup, Vegetable Rice Soup"],
    	"23": ["Roasted Turkey Breast Plate ", "Orecchiette W/ Broccoli and Chickpeas ", "Brussel Sprouts, Mashed Sweet Potatoes ", "Chicken Noodle Soup, Cream of Spinach Soup"],
    	"24": ["Baked Battered Cod ", "Lemon Garlic Baked Chicken ", "Roasted Potatoes, Snow Peas W/ Red Peppers ", "Cream of Tomato Soup, French Onion Soup"],
    	"25": ["Open Faced Pot Roast Sandwich ", "Baked Salmon ", "Red Potatoes, Sauteed Broccolini ", "Cream of Chicken Soup, Garden Vegetable Soup"],
    	"26": ["Spinach Ravioli W/ Pesto Cream Sauce ", "Dijon Pork Loin ", "Roasted Asparagus, Baby Carrots,Cous Cous ", "Potato Bacon Chowder, Tuscan Kale & Bean Soup"],
    	"27": ["Swedish Meatballs ", "Crispy Honey BBQ Chicken Stir-Fry ", "Rice, Pasta, Fresh Broccoli ", "Cream of Cauliflower, Chicken Quinoa Soup"],
	},
	daysInMonth: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
}
