import java.io.*; 
import java.util.*;

public class Dialogue {
	public static void main(String[] args) {
		try {
			File myObj = new File("roma.txt");
			Scanner myReader = new Scanner(myObj);
			int index = 0;
			String nextCharacter = null;
			Map<String, Integer> characterLists = new HashMap<String, Integer>();
			while (myReader.hasNextLine()) {
				String character = nextCharacter == null ? myReader.nextLine() : nextCharacter;
				System.out.println(1 + " " + character);
				if (isStringUpperCase(character)) {
					nextCharacter = myReader.nextLine();
					System.out.println(2 + " " + nextCharacter);
					while (myReader.hasNextLine() && (nextCharacter == null || !isStringUpperCase(nextCharacter))) {
						if (characterLists.get(character) == null) {
							System.out.println(nextCharacter.length());
							characterLists.put(character, nextCharacter.trim().split("\\s+").length);
						} else {
						 	characterLists.put(character, characterLists.get(character) + nextCharacter.trim().split("\\s+").length);
						}
						nextCharacter = myReader.nextLine();
						System.out.println(3 + " " + nextCharacter);
					}
				}
				index++;
			}
			System.out.println(characterLists);
		} catch(Exception e) {
    		System.out.println(e);
    	}
	}

	private static boolean isStringUpperCase(String str){
        
        //convert String to char array
        char[] charArray = str.toCharArray();
        
        for(int i=0; i < charArray.length; i++){
            
            //if any character is not in upper case, return false
            if( !Character.isUpperCase( charArray[i] ))
                return false;
        }
        
        return true;
    }
}
