import re
import operator
import math

### Code for identifying characters
filename = input("Enter name of the text file: ")
f = open(filename, 'r')
text = f.read()
lines = text.splitlines()
characters = dict()
punctuation = [',', '.', '\'', '\"', '!', '?', '...', ':', ')', '(', '[', ']', '&']
currChar = ""
chars_inorder = [] 

for line in lines:
	line = line.strip()
	if (line.isupper()):
		s1 = re.search('EXT\.', line)
		s2 = re.search('INT\.', line)
		if (not (s1 or s2)):
			fi = line.find('(')
			if (fi != -1):
				line = line[:line.find('(')]
			line = line.strip()
			if (len(line) > 12):
				if currChar in characters:
					characters[currChar] = characters[currChar] + len(line.split())
				else:
					characters[currChar] = len(line.split())
			elif(len(line) == 0):
				continue
			else:
				currChar = line
				chars_inorder.append(line)
	else:
		if (len(chars_inorder) > 0):
			if chars_inorder[len(chars_inorder)-1] in characters:
				characters[chars_inorder[len(chars_inorder)-1]] = characters[currChar] + len(line.split())
			else:
				characters[chars_inorder[len(chars_inorder) -1]] = len(line.split())
	
temp = dict()
for char, count in characters.items():
	if ((count > 4) and (not any([c in char for c in punctuation]))):
		temp[char] = characters[char]
characters = temp.copy()
del temp

for char, count in characters.items():
	print("character: " + char + " count: " + str(count))
# to remove outliers
mean = 0
for i, j in characters.items():
	mean = mean + j
mean = mean / len(characters)

# stddev = 0
# for i, j in characters.items():
# 	stddev = stddev + (j - mean)*(j - mean)
# stddev = stddev / len(characters)
# stddev = math.sqrt(stddev)

# temp = {}
# for i, j in characters.items():
# 	if (math.fabs(j - mean) < 3*stddev):
# 		temp[i] = j
# characters = temp.copy()
# del temp

### Code for gender algorithm
charlist = sorted(characters)
gender = dict()
for char in charlist:
	m, f, p = 0, 0, 0 
	for i in range(len(lines)):
		srch = re.search(char, lines[i], re.I)
		if not srch:
			continue
		if srch.group().isupper():
			continue
		else:
			k, k_range = -1, 2
			while k + i + 1 < len(lines):
				k = k + 1
				m = m + len(re.findall("\s+he", lines[k+i], re.I)) + len(re.findall("\s+him", lines[k+i], re.I))
				f = f + len(re.findall("\s+she", lines[k+i], re.I)) + len(re.findall("\s+her", lines[k+i], re.I))
				if lines[k+i].isupper():
					break
				if k >= k_range:
					break
			k, k_range = -1, 4
			while k + i + 1 < len(lines):
				k = k + 1
				m1, m2, m3, m4 = re.search("\s+he", lines[k+i], re.I), re.search("\s+him", lines[k+i], re.I), re.search("\s+she", lines[k+i], re.I), re.search("\s+her", lines[k+i], re.I)
				if m1:
					if m2:
						mc = min(m1.span()[0], m2.span()[0])
					else:
						mc = m1.span()[0]
				else:
					mc = len(lines[k+i])
				if m3:
					if m4:
						fc = min(m3.span()[0], m4.span()[0])
					else:
						fc = m3.span()[0]
				else:
					fc = len(lines[k+i])
				if not(m1 or m2 or m3 or m4):
					continue
				else:
					if (mc < fc):
						p = p - 1
					else:
						p = p + 1
					break
				if lines[k+i].isupper():
					break
				if k >= k_range:
					break
	gender[char] = m, f, p

totalMaleLines = 0
totalFemaleLines = 0
for char, g in gender.items():
	g_score = 2*g[1] - g[0] 
	g_sum = g[1]+g[0]
	g_score = g_score
	if (g_sum == 0.0) or (0 == 1):
		print(char+" Undetermined ")
		gender[char] = 0, 0, -1
	elif g_score > 0:
		print(char+" Female "+str(g[0])+","+str(g[1])+","+str(g[2])+","+str(g_score))
		print(str(characters[char]))
		totalFemaleLines = totalFemaleLines + characters[char]
		gender[char] = 0, 0, 1
	elif (char.find("GUY") != -1 or char.find("MAN") != -1 or char.find("BOY") != -1):
		totalMaleLines = totalMaleLines + characters[char]
	elif (char.find("LADY") != -1 or char.find("WOMAN") != -1 or char.find("GIRL") != -1):
		totalFemaleLines = totalFemaleLines + characters[char]
	else:
		totalMaleLines = totalMaleLines + characters[char]
		print(char+" Male", " ", str(g[0])+","+str(g[1])+","+str(g[2])+","+str(g_score))
		gender[char] = 0, 0, 0

# gender[char][2] = -1 if undetermined, 1 if female, 0 if male
print("female lines: " + str(totalFemaleLines))
print("percentage female: " + str((totalFemaleLines * 1.0) / (totalFemaleLines + totalMaleLines)))
print("male lines: " + str(totalMaleLines))
print("percentage male " + str((totalMaleLines * 1.0) / (totalFemaleLines + totalMaleLines)))