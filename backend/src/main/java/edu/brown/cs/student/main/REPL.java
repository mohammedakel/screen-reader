package edu.brown.cs.student.main;

import edu.brown.cs.student.main.commands.Command;
import edu.brown.cs.student.main.commands.ExitCommand;
import edu.brown.cs.student.main.commands.LoadDatabase;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * REPL class interprets user input in an infinite loop. Has a HashMap of possible Commands that can
 * be called by the user, and stores a reference to a DataStorage class.
 */
public class REPL {
  private final HashMap<String, Command> commands;
  private final DataStorage data;

  /**
   * REPL constructor sets up the instance variables, loads in the preset Commands, then runs
   * the actual REPL with doREPL().
   */
  public REPL() {
    commands = new HashMap<>();
    data = new DataStorage();

    //add preset commands here
    commands.put("exit", new ExitCommand());
    commands.put("load", new LoadDatabase());
  }

  /**
   * Starts the REPL, which in turn parses the user input.
   */
  public void doREPL() {
    BufferedReader reader = new BufferedReader(new InputStreamReader(System.in));
    while (true) {
      try {
        String line = reader.readLine();
        if (line == null) { //stop at EOF
          System.exit(0);
        }
        if (!line.equals("\n")) {
          parse(line);
        }
      } catch (IOException | SQLException | ClassNotFoundException e) {
        e.printStackTrace();
      }
    }
  }

  /**
   * Parses REPL input and calls the appropriate Command (if it exists).
   * @param line The input String
   */
  public void parse(String line) throws SQLException, ClassNotFoundException {
    //split the String by spaces, controlling for quotes
    ArrayList<String> input = doRegex(line);

    if (input.size() > 0) {
      //if the user inputs anything other than a (known) command
      if (!commands.containsKey(input.get(0))) {
        System.out.println("ERROR: Please input a valid command. Current commands: "
            + commands.keySet());
      } else {
        Command toExecute = commands.get(input.get(0));
        ArrayList<String> arguments = new ArrayList<>();

        //add arguments to the ArrayList if they exist
        for (int i = 1; i < input.size(); i++) {
          arguments.add(input.get(i));
        }
        //actually run the command
        toExecute.doCommand(data, arguments);
      }
    }
  }

  /**
   * Regex method to split the input String, while controlling for things like "Quoted Name".
   * Code courtesy of Jan Goyvaerts on StackOverflow. Remnant from Stars project; may or may not
   * be useful here.
   * @param line The user input
   * @return ArrayList of the split input
   */
  public ArrayList<String> doRegex(String line) {
    ArrayList<String> input = new ArrayList<>();
    //like literally what
    Pattern regex = Pattern.compile("[^\\s\"']+|\"([^\"]*)\"|'([^']*)'");
    Matcher regexMatcher = regex.matcher(line);
    while (regexMatcher.find()) {
      if (regexMatcher.group(1) != null) {
        // Add double-quoted string without the quotes
        input.add(regexMatcher.group(1));
      } else if (regexMatcher.group(2) != null) {
        // Add single-quoted string without the quotes
        input.add(regexMatcher.group(2));
      } else {
        // Add unquoted word
        input.add(regexMatcher.group());
      }
    }
    return input;
  }

  /**
   * Accessor for the DataStorage instance for use in the TableHandler in Main.java
   * @return  Global instance of DataStorage
   */
  public DataStorage getDataStorage() {
    return data;
  }
}
