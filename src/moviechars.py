import re
import operator
 
filename = input("Enter name of the text file: ")
f = open(filename, 'r')
text = f.read()
lines = text.splitlines()
characters = dict()
punctuation = [',', '.', '\'', '\"', '!', '?', '...', ':', ')', '(', '[', ']', '&']
currChar = ""
for line in lines:
    line = line.strip()
    print(line)
    print(line.split())
    if (line.isupper()):
        s1 = re.search('EXT\.', line)
        s2 = re.search('INT\.', line)
        if (not (s1 or s2)):
			# update current character speaking
            currChar = line
           
    else:
		# if character is in dictionary already, add on to total words
		# otherwise add new charater to dictionary with count of current line
        if currChar in characters:
            characters[currChar] = characters[currChar] + len(line.split())
        else:
            characters[currChar] = len(line.split())
        print("count: " + str(characters[currChar]))
    
temp = dict()
# strip out any entries that have punctuation
for char, count in characters.items():
    if ((count > 4) and (not any([c in char for c in punctuation]))):
        temp[char] = characters[char]
characters = temp.copy()
del temp
 
charlist = sorted(characters)
for char in charlist:
    print(char+" "+str(characters[char]))
