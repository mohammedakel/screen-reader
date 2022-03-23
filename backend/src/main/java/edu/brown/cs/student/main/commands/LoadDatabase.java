package edu.brown.cs.student.main.commands;

import edu.brown.cs.student.main.DataStorage;
import edu.brown.cs.student.main.Database;
import edu.brown.cs.student.main.table.Table;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

/**
 * LoadDatabase Command is called via the REPL to import an SQL database into the DataStorage.
 * Furthermore, it contains methods to set up Table objects for each respective table in the
 * Database, so that they can be returned when requested from the frontend.
 */
public class LoadDatabase implements Command {

  /**
   * Arguments for this implementation of doCommand() should only be the filename.
   * @param data DataStorage instance for storing global data.
   * @param arguments Looks only for a single String filename.
   */
  @Override
  public void doCommand(DataStorage data, ArrayList<String> arguments)
      throws SQLException, ClassNotFoundException {
    if (arguments.size() != 1) {
      System.out.println("ERROR: Correct usage: [load <filename>]");
    } else { //arguments are valid
      loadDatabase(arguments.get(0), data);
      System.out.println("Loaded " + arguments.get(0));
    }
  }

  /**
   * To reduce the size of the fairly general doCommand method, most of the functionality of
   * LoadDatabase is done here. This private method creates .
   * @param filename        Path to the database
   * @param data            Global DataStorage instance
   * @throws SQLException   if an error occurs in any SQL query.
   * @throws ClassNotFoundException (error handling) (necessary?)
   */
  private void loadDatabase(String filename, DataStorage data)
      throws SQLException, ClassNotFoundException {
    //load database
    Database db = new Database(filename);
    data.setDatabase(db);
    //get table names
    List<String> tableNames = db.getTableNames();
    //construct Table objects
    for (String name : tableNames) {
      //second parameter returns a List of Columns that are fully loaded with data
      Table table = new Table(name, db.createColumns(name));
      //add to HashMap in global DataStorage
      data.getTables().put(name, table);
    }
  }
}
