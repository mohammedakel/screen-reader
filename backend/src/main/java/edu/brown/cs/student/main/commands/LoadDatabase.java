package edu.brown.cs.student.main.commands;

import edu.brown.cs.student.main.DataStorage;
import edu.brown.cs.student.main.Database;

import java.sql.SQLException;
import java.util.ArrayList;

/**
 * LoadDatabase Command is called via the REPL to import an SQL database into the DataStorage.
 */
public class LoadDatabase implements Command {

  /**
   * Arguments for this implementation of doCommand should only be the filename.
   * @param data DataStorage class with Tables——where the database will be stored.
   * @param arguments Looks only for a single String filename.
   */
  @Override
  public void doCommand(DataStorage data, ArrayList<String> arguments)
      throws SQLException, ClassNotFoundException {
    if (arguments.size() < 1) {
      System.out.println("ERROR: Please include the PATH to a database file!");
    } else if (arguments.size() > 1) {
      System.out.println("ERROR: Correct usage: [load <filename>]");
    } else { //arguments are valid
      data.setDatabase(new Database(arguments.get(0)));
      System.out.println("Loaded " + arguments.get(0));
    }
  }
}
