def main():
  RotNum = (getRotNum() % 26)
  with open("message.txt", "r") as file: 
    line = file.readline()    
    while line != '': 
      for char in line:
        # Do some per-character manipulations.
        charAsInt = ord(char)
        #if the character is a through y - Rotnum, add RotNum
        if charAsInt >= 65 and charAsInt < (90 - (RotNum - 1)):
          charAsInt += RotNum
        elif charAsInt == (90 - (RotNum - 1)):
          charAsInt = 65 + (RotNum - 1)
        elif charAsInt >= 97 and charAsInt < (122 - (RotNum - 1)):
          charAsInt += RotNum
        elif charAsInt == (122 - (RotNum - 1)):
          charAsInt = 97 +(RotNum - 1)
        char = chr(charAsInt)
        print(char, end="")

  # Yes, like an idiot, I went and individually commented these sections out. My apologies. I didn't know how to comment out sections here.

##      if char == 'a':
        # Create a character from it's unicode/ASCII decimal code.
##        #  See: http://www.asciitable.com/
##        char = chr(36)
##  
##      if char == 'b':
        # Get the code from the character as a decimal/integer.
        #  Modify it and convert it back to a character type.
##        charAsInt = ord(char)
##        charAsInt = charAsInt + 1
##        char = chr(charAsInt)
          
      # Write the character to standard output.
##      print( char, end='' )

      # Read the next line
      line = file.readline()
          
def getRotNum():
  try:
    rot_num = int(input("Enter number of rotations please "))
    return rot_num
  except IOError:
    print("That was an invalid value.")
    getRotNum()


main()