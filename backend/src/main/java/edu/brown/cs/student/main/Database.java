package edu.brown.cs.student.main;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

/**
 * Database class has its main code taken from the database-lab. Loads an SQL database into the
 * DataStorage class.
 */
public class Database {
  private static Connection conn = null;

  /**
   * Database constructor takes in a filename (usually given from the REPL via LoadDatabase.java).
   * @param filename  The String representing the path to the database file.
   * @throws SQLException if an error occurs in any SQL query.
   */
  public Database(String filename) throws SQLException, ClassNotFoundException {
    Class.forName("org.sqlite.JDBC");
    String urlToDB = "jdbc:sqlite:" + filename;
    conn = DriverManager.getConnection(urlToDB);
    // these two lines tell the database to enforce foreign keys during operations,
    // and should be present
    Statement stat = conn.createStatement();
    stat.executeUpdate("PRAGMA foreign_keys=ON;");
  }
}
