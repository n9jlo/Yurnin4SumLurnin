with open("message.txt", "r") as file: 
  line = file.readline()    
  while line != '': 
    for char in line:
      # Do some per-character manipulations.

      if char == 'a':
        # Create a character from it's unicode/ASCII decimal code.
        #  See: http://www.asciitable.com/
        char = chr(36)
  
      if char == 'b':
        # Get the code from the character as a decimal/integer.
        #  Modify it and convert it back to a character type.
        charAsInt = ord(char)
        charAsInt = charAsInt + 1
        char = chr(charAsInt)
          
      # Write the character to standard output.
      print( char, end='' )

    # Read the next line
    line = file.readline()
          
