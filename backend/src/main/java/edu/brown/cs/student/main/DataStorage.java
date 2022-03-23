package edu.brown.cs.student.main;

/**
 * DataStorage is passed into every Command by the REPL so that if they need to use the Table
 * data, they can. Mostly just a class full of accessors and mutators.
 */
public class DataStorage {
  private Database db;
  /**
   * Empty constructor for now.
   */
  public DataStorage() {
  }

  /**
   * Mutator and accessor for the instance variable "db", to set and get the Database used globally.
   * @param newDb The Database that has been loaded in, from LoadDatabase.java
   */
  public void setDatabase(Database newDb) {
    this.db = newDb;
  }
  public Database getDatabase() {
    return db;
  }
}
