const constants =
{
	calendar_events: ['11/21/2018'],
	calendar_event_names: ['Early Dismissal'],
	holidays: ['9/3/2018', '9/10/2018', '9/19/2018', '10/8/2018', '11/22/2018', '11/23/2018'],
	dates: {
		'Late Arrival': ['8/23/2018', '8/31/2018', '9/13/2018', '10/18/2018', '10/31/2018', '11/29/2018', '1/17/2019',
        	'2/14/2019', '3/14/2019', '4/25/2019'],
		'Activity Schedule': ['8/15/2018', '9/5/2018', '10/3/2018', '11/28/2018', '1/14/2019', '2/6/2019', '3/20/2019', '5/1/2019'],
		'PM Assembly': ['11/21/2018', '5/17/2019'],
		'Finals': ['12/19/2018', '12/20/2018', '12/21/2018', '5/21/2019', '5/22/2019', '5/23/2019'],
	},

	schedules: {
		'Standard Schedule': {
			start: [510, 541, 566, 593, 618, 645, 670, 697, 722, 749, 774, 801, 826, 853, 878, 905],
			end: [534, 561, 586, 613, 638, 665, 690, 717, 742, 769, 794, 821, 846, 873, 898, 925],
			periods: ['1A', '1B', '2A', '2B', '3A', '3B', '4A', '4B', '5A', '5B', '6A', '6B', '7A', '7B', '8A', '8B'],
			start_nh: [510, 566, 618, 670, 722, 774, 826, 878],
			end_nh: [561, 613, 665, 717, 769, 821, 873, 925],
			periods_nh: ['1', '2', '3', '4', '5', '6', '7', '8']
		},
		'Late Arrival': {
			start_nh: [630, 670, 705, 740, 780, 820, 860, 895],
			end_nh: [665, 700, 735, 775, 815, 855, 890, 925],
			periods_nh: ['1', '2', '3', '4', '5', '6', '7', '8'],
			nh_version: true
		},
		'Activity Schedule': {
			start: [510, 538, 560, 584, 606, 654, 678, 700, 724, 746, 770, 792, 816, 838, 862, 884, 908],
			end: [531, 555, 577, 601, 649, 671, 695, 717, 741, 763, 787, 809, 833, 855, 879, 901, 925],
			periods: ['1A', '1B', '2A', '2B', '!Activity', '3A', '3B', '4A', '4B', '5A', '5B', '6A', '6B', '7A', '7B', '8A', '8B'],
			start_nh: [510, 560, 606, 654, 700, 746, 792, 838, 884],
			end_nh: [555, 601, 649, 695, 741, 787, 833, 879, 925],
			periods_nh: ['1', '2', '!Activity', '3', '4', '5','6', '7', '8'],
		},
		'PM Assembly': {
			start: [510, 538, 560, 584, 606, 630, 652, 676, 698, 722, 744, 768, 790, 814, 836, 860, 882],
			end: [531, 555, 577, 601, 623, 647, 669, 693, 715, 739, 761, 785, 807, 831, 853, 877, 925],
			periods: ['1A', '1B', '2A', '2B', '3A', '3B', '4A', '4B', '5A', '5B', '6A', '6B', '7A', '7B', '8A', '8B', '!Assembly'],
			start_nh: [510, 560, 606, 652, 698, 744, 790, 836, 882],
			end_nh: [555, 601, 647, 693, 739, 785, 831, 877, 925],
			periods_nh: ['1', '2', '3', '4', '5', '6', '7', '8', '!Assembly']
		},
		'Finals': {
			start: [510, 610, 710],
			end: [600, 700, 800],
			periods: [['1','2','4'], ['3','7','5'], ['8','6','!Makeup']]
		},
		'Odyssey': {
			start_nh: [615, 635, 695, 755, 815, 875],
			end_nh: [625, 685, 745, 805, 865, 925],
			periods_nh: ['!Homeroom', '1', '2', '3', '4', '5'],
			nh_version: true
		}
	},

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
	  "0": ["Chopped Steak w/ Sauteed Onions", "Baked Turkey Meatloaf", "Mashed Potatoes, Sauteed Broccolini", "Cream of Chicken, Garden Vegetable"],
	  "1": ["Three Cheese Penne", "Biryani Chicken", "Yellow Rice, Roasted Carrots", "Cream of Cauliflower, Quinoa Soup"],
	  "4": ["Sliced Pork Marsala", "Baked Tilapia", "Red Potatoes, Fresh Broccoli, Braised Red Cabbage", "Chicken Noodle Soup, Cream of Spinach Soup"],
	  "5": ["Homemade Chicken Pot Pie", "Vegetable Lo-Mein Stir-Fry", "Roasted Potatoes, Roasted Vegetables, Egg Roll", "Cream of Mushroom, Mexican Chicken  Lime"],
	  "6": ["Dijon Chicken", "Sliced BBQ Pork Loin", "Mashed Potatoes, Roasted Asparagus", "Tomato Basil, Beef Vegetable"],
	  "7": ["Tempura Chicken Stir-Fry", "Spicy Whole Wheat Spaghetti", "Vegetable Spring Rolls, Rice, Roasted Cauliflower", "Potato Bacon Chowder, Tuscan Kale & White Bean Soup"],
	  "8": ["Swedish Meatballs", "Dijon Crusted Salmon", "Rice, Pasta, Green Beans and Carrots", "Lemon Chicken with Rice, Vegetable"],
	  "11": ["Roasted Turkey Breast Plate", "Italian Style Baked Cod", "Cauliflower Quinoa Burger", "Brussel Sprouts, Mashed Sweet Potatoes", "Chicken Noodle, Cream of Spinach"],
	  "12": ["Homemade Beef Meatloaf", "Korean Vegetable Stir-Fry with Tofu", "Orzo, Roasted Carrots, Roasted Broccoli", "Chicken Tortilla,Cream of Broccoli"],
	  "13": ["Open-Faced Pot Roast Sandwich", "Teriyaki Glazed Salmon", "Red Potatoes, Sauteed Broccolini", "Cream of Tomato, French Onion"],
	  "14": ["Baked Cheese Enchiladas", "Rosemary Crusted Pork Loin", "Roasted Asparagus, Cilantro Lime Rice", "Cream of Chicken, Garden Vegetable"],
	  "15": ["Baked Chicken Picata", "Chicken Tikka Masala", "Bulgur Wheat Pilaf, Rice, Lemon Pepper Green Beans", "Cream of Cauliflower, Chicken Quinoa"],
	  "18": ["Baked Cheese Tortellini", "Chicken Tagine", "Impossible Meatball with Curry Sauce", "Creamed Spinach, Carrots, Rice", "Chicken Rice, Vegetarian Chili"],
	  "19": ["Baked Battered Cod", "Lemon Garlic Baked Chicken", "Roasted Potatoes, Snow Peas with Red Peppers", "Cream of Mushroom, Mexican Chicken and Lime"],
	  "20": ["Baked Broccoli Mac and Cheese", "Turkey Breast Vesuvio", "Roasted Cauliflower, Cous Cous Primavera", "Tomato Basil, Beef Vegetable"],
	  "21": ["Baked Chicken Parmesan", "Blackened Tilapia", "Roasted Zucchini, Pasta", "Potato Bacon Chowder, Tuscan Kale & Bean Soup"],
	  "22": ["Baked Pasta with Marnaria", "Citrus Herb Salmon", "Fresh Broccoli, Season Fruit", "Lemon Chicken with Rice, Vegetable"],
	  "25": ["Baked Cheese Tortellini", "Chicken Breast Tagine", "Creamed Spinach, Baby Carrots, Rice", "Chicken Rice Soup, Vegetarian Chili"],
	  "26": ["Spinach Ravioli w/ Pesto Cream Sauce", "Baked Salmon w/ Mango Salsa", "Cous-Cous, Sugar Snap Peas", "Chicken Tortilla, Cream of Broccoli"],
	  "27": ["Homemade Beef Stew", "Thai Chicken Stir-Fry", "Rice, Roasted Cauliflower", "Cream of Tomato, French Onion"]
	},
	daysInMonth: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
}
