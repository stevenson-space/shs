periods = ['1A', '1B', '2A', '2B', '3A', '3B', '4A', '4B', '5A', '5B', '6A', '6B', '7A', '7B', '8A', '8B', '!Assembly']
starts = []
ends = []

for period in periods:
	s = input("When does " + period + " start? ")
	s = s.split(":")
	s[0] = int(s[0])
	s[1] = int(s[1])
	if(s[0] <= 3): s[0] += 12
	
	start_minutes = s[0]*60 + s[1]
	starts.append(start_minutes)

	e = input("When does " + period + " end? ")
	e = e.split(":")
	e[0] = int(e[0])
	e[1] = int(e[1])
	if(e[0] <= 3): e[0] += 12
	
	end_minutes = e[0]*60 + e[1]
	ends.append(end_minutes)

start_string = "Starts: ["
for i in starts: start_string += str(i) + ", "
start_string = start_string[:-2] + "]"
print(start_string)

end_string = "Ends: ["
for i in ends: end_string += str(i) + ", "
end_string = end_string[:-2] + "]"
print(end_string)


import operator
print("Verification: ", end="")
print(list(map(operator.sub, ends, starts)))