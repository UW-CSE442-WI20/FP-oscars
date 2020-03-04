import re
import operator
import math

### Code for identifying characters
filename = input("Enter name of the text file: ")
f = open(filename, 'r')
print("h")
text = f.read()
print("hy")
lines = text.splitlines()
print(lines)
characters = dict()
punctuation = [',', '.', '\"', '!', '?', '...', ':', ')', '(', '[', ']', '&']
currChar = ""
chars_inorder = [] 

for line in lines:
# if (not (re.match(r'\w', line))):
	line = line.strip()
	# if (line.isupper()):
	if len(line) > 0 and line[0] == '['):
		s1 = re.search('EXT\.', line)
		s2 = re.search('INT\.', line)
		if (not (s1 or s2)):
			fi = line.find('(')
			if (fi != -1):
				line = line[:line.find('(')]
			line = line.strip()
			if(len(line) == 0):
				continue
			else:
				currChar = line
				chars_inorder.append(line)
	# elif (re.match(r'\w', line)):
		if (len(chars_inorder) > 0):
			if currChar in characters:
				characters[currChar] = characters[currChar] + len(line.split())
			else:
				characters[currChar] = len(line.split())


# for line in lines:
#     line = line.strip()
#     print(line)
#     print(line.split())
#     if (line.isupper()):
#         s1 = re.search('EXT\.', line)
#         s2 = re.search('INT\.', line)
#         if (not (s1 or s2)):
# 			# update current character speaking
#             fi = line.find('(')
#             if (fi != -1):
#                 line = line[:line.find('(')]
#             line = line.strip()
#             currChar = line       
#     else:
# 		# if character is in dictionary already, add on to total words
# 		# otherwise add new charater to dictionary with count of current line
#         if currChar in characters:
#             characters[currChar] = characters[currChar] + len(line.split())
#         else:
#             characters[currChar] = len(line.split())
	
temp = dict()
for char, count in characters.items():
	if (((count > 4) and (not any([c in char for c in punctuation]))) or char.find("SR.") != -1 or char.find("JR.")  	!= -1 or char.find("LT.") != 1):
		temp[char] = characters[char]
characters = temp.copy()
del temp

totalLineCount = 0
for char, count in characters.items():
	if (count > 100):
		print("character: " + char + " count: " + str(count))
		totalLineCount = totalLineCount + count
print("total word count: " + str(totalLineCount))