import java.io.*; 
import java.util.*;

public class DataCalculation {
	public static void main(String[] args) {
		int[] ids = new int[]{1517,5820,6407,1606,1691,1718,1796,5385,1841,8479,5386,5388,8765,1955,2033,4047,4050,4065,4169,2240,2408,6515,2445,4352,2598,4423,2688,2754,2769,2777,4540,2812,2865,4608,4619,9008,1153,5930,2944,7502,6150,4157,3124,5462,3333,3365,8089,6911,3492,8597,7214,5496,1855,2106,2144,2146,2289,2530,7563,7766,2634,2708,1115,1114,3092,1258,3178,8257,3381,5502,6000,1423,3589,5185,6905};
		String[] movieNames = new String[]{"12 Years a Slave","A Beautiful Mind","Adaptation.","Almost Famous","Argo","Avatar","Beginners","Birdman","Black Swan","Blue Jasmine","Boyhood","Bridge of Spies","Brokeback Mountain","Capote","Cold Mountain","Crash","Crazy Heart","Dallas Buyers Club","Erin Brockovich","Eternal Sunshine of the Spotless Mind","Gladiator","Gosford Park","Gravity","Her","Inception","Inglourious Basterds","Juno","Les Misérables","Life of Pi","Lincoln","Little Miss Sunshine","Lost in Translation","Master and Commander:  The Far Side of the World","Memories of a Geisha","Michael Clayton","Midnight in Paris","Milk","Million Dollar Baby","Monster's Ball","Mystic River","No Country for Old Men","Pan's Labyrinth","Precious","Room","Sideways","Slumdog Millionaire","Spotlight","Still Alice","Syriana","Talk to Her","The Aviator","The Big Short","The Blind Side","The Dark Knight","The Departed","The Descendants","The Fighter","The Help","The Hurt Locker","The Imitation Game","The Iron Lady","The King's Speech","The Lord of the Rings: The Fellowship of the Ring","The Lord of the Rings: The Return of the King","The Pianist","The Queen","The Reader","The Revenant","The Social Network","The Theory of Everything","There Will Be Blood","Traffic","Training Day","Vicky Cristina Barcelona","Whiplash"};
    	try {
    		File myObj = new File("character_list.txt");
    		Writer write = new FileWriter("character_breakdown.txt");


    		for (int i = 0; i < ids.length; i++) {
	    		
	    		Scanner myReader = new Scanner(myObj);
	    		int numFemale = 0;
	    		int numMale = 0;
	    		int total = 0;
			    while (myReader.hasNextLine()) {
				    String data = myReader.nextLine();
				    String[] parts = data.split(",");
				    if (Integer.parseInt(parts[0]) == ids[i]) {
				    	String gender = parts[3];
				    	int numLines = Integer.parseInt(parts[2]);
				    	total += numLines;
				    	if (gender.equals("\"f\"")) {
				    		numFemale += numLines;
				    	} else {
				    		numMale += numLines;
				    	}
				    }
				}
				System.out.println(movieNames[i] + " has " + numFemale + " female lines and " + numMale + " male lines!");
				double decimal = numFemale / (1.0 * total);
				write.write(movieNames[i] + "," + (double) Math.round(decimal * 10000) / 100);
				write.write("\n");
			}	
			write.flush();
			write.close();
    	} catch(Exception e) {
    		System.out.println("error!");
    	}
		
	}
}
